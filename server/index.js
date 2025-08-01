const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/linkando')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error);
  });

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  provider: { type: String, required: true }, // 'google' or 'github'
  providerId: { type: String, required: true },
  avatar: String,
  refreshTokens: [{ 
    token: String, 
    expiresAt: Date,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Link Schema
const linkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  isPrivate: { type: Boolean, default: false },
  password: { type: String, default: null }, // Hash da senha para links privados
  clicks: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null }, // Expiração opcional do link
  createdAt: { type: Date, default: Date.now }
});

// Refresh Token Schema
const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  isRevoked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Link = mongoose.model('Link', linkSchema);
const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

// JWT Token generation
const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      username: user.username, 
      email: user.email,
      type: 'access'
    },
    process.env.JWT_SECRET || 'your-jwt-secret',
    { expiresIn: '15m' } // Access token expira em 15 minutos
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      type: 'refresh'
    },
    process.env.JWT_SECRET || 'your-jwt-secret',
    { expiresIn: '7d' } // Refresh token expira em 7 dias
  );
};

// Generate unique refresh token string
const generateRefreshTokenString = () => {
  return require('crypto').randomBytes(64).toString('hex');
};

// Save refresh token to database
const saveRefreshToken = async (userId, refreshToken, expiresAt) => {
  const tokenDoc = new RefreshToken({
    userId,
    token: refreshToken,
    expiresAt
  });
  await tokenDoc.save();
  return tokenDoc;
};

// Verify refresh token
const verifyRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    
    const tokenDoc = await RefreshToken.findOne({ 
      token, 
      userId: decoded.userId,
      isRevoked: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!tokenDoc) {
      throw new Error('Refresh token not found or expired');
    }
    
    return decoded;
  } catch (error) {
    throw error;
  }
};

// Revoke refresh token
const revokeRefreshToken = async (token) => {
  await RefreshToken.findOneAndUpdate(
    { token },
    { isRevoked: true }
  );
};

// Clean expired refresh tokens
const cleanExpiredRefreshTokens = async () => {
  await RefreshToken.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Only configure OAuth strategies if credentials are provided and valid
const hasValidGoogleCredentials = process.env.GOOGLE_CLIENT_ID && 
  process.env.GOOGLE_CLIENT_SECRET && 
  process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id';

const hasValidGitHubCredentials = process.env.GITHUB_CLIENT_ID && 
  process.env.GITHUB_CLIENT_SECRET && 
  process.env.GITHUB_CLIENT_ID !== 'your-github-client-id';

if (hasValidGoogleCredentials) {
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ providerId: profile.id, provider: 'google' });
      
      if (!user) {
        // Create new user
        user = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          provider: 'google',
          providerId: profile.id,
          avatar: profile.photos[0]?.value
        });
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

if (hasValidGitHubCredentials) {
  const GitHubStrategy = require('passport-github2').Strategy;
  
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ providerId: profile.id.toString(), provider: 'github' });
      
      if (!user) {
        // Create new user
        user = new User({
          username: profile.username,
          email: profile.emails[0]?.value || `${profile.username}@github.com`,
          provider: 'github',
          providerId: profile.id.toString(),
          avatar: profile.photos[0]?.value
        });
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
  
  if (!accessToken) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET || 'your-jwt-secret');
    
    if (decoded.type !== 'access') {
      return res.status(401).json({ message: 'Invalid token type.' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired.',
        code: 'TOKEN_EXPIRED'
      });
    }
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Optional authentication middleware (for public links)
const optionalAuth = async (req, res, next) => {
  const accessToken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
  
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET || 'your-jwt-secret');
      if (decoded.type === 'access') {
        req.user = decoded;
      }
    } catch (error) {
      // Token inválido, mas não bloqueia a requisição
    }
  }
  
  next();
};

// Routes

// Google OAuth routes (only if configured)
if (hasValidGoogleCredentials) {
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      const token = generateToken(req.user);
      res.cookie('token', token, { 
        httpOnly: true, 
        secure: false, // Set to true in production
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      res.redirect('http://localhost:3000/dashboard');
    }
  );
}

// GitHub OAuth routes (only if configured)
if (hasValidGitHubCredentials) {
  app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
  );

  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
      const token = generateToken(req.user);
      res.cookie('token', token, { 
        httpOnly: true, 
        secure: false, // Set to true in production
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      res.redirect('http://localhost:3000/dashboard');
    }
  );
}

// Mock login route for account selection
app.post('/auth/mock-login', async (req, res) => {
  try {
    const { accountId, username, email, provider, providerId, avatar } = req.body;
    
    if (!username || !email || !provider || !providerId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Create or find user
    let user = await User.findOne({ providerId, provider });
    
    if (!user) {
      user = new User({
        username,
        email,
        provider,
        providerId,
        avatar
      });
      await user.save();
    }
    
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const refreshTokenString = generateRefreshTokenString();
    
    // Save refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    await saveRefreshToken(user._id, refreshTokenString, expiresAt);
    
    // Set cookies
    res.cookie('accessToken', accessToken, { 
      httpOnly: true, 
      secure: false,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    res.cookie('refreshToken', refreshTokenString, { 
      httpOnly: true, 
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Error in mock login:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Mock login routes for development (when OAuth is not configured)
if (!hasValidGoogleCredentials || !hasValidGitHubCredentials) {
  app.get('/auth/google', async (req, res) => {
    try {
      // Simular dados do Google OAuth
      const mockGoogleUser = {
        username: 'João Silva',
        email: 'joao.silva@gmail.com',
        provider: 'google',
        providerId: 'mock-google-123',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      };
      
      // Create or find user
      let user = await User.findOne({ providerId: mockGoogleUser.providerId, provider: 'google' });
      
      if (!user) {
        user = new User(mockGoogleUser);
        await user.save();
      }
      
      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      const refreshTokenString = generateRefreshTokenString();
      
      // Save refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
      await saveRefreshToken(user._id, refreshTokenString, expiresAt);
      
      // Set cookies
      res.cookie('accessToken', accessToken, { 
        httpOnly: true, 
        secure: false,
        maxAge: 15 * 60 * 1000 // 15 minutes
      });
      
      res.cookie('refreshToken', refreshTokenString, { 
        httpOnly: true, 
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.redirect('http://localhost:3000/dashboard');
    } catch (error) {
      res.status(500).json({ message: 'Error creating mock user' });
    }
  });

  app.get('/auth/github', async (req, res) => {
    try {
      // Simular dados do GitHub OAuth
      const mockGitHubUser = {
        username: 'maria_dev',
        email: 'maria.dev@github.com',
        provider: 'github',
        providerId: 'mock-github-456',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      };
      
      // Create or find user
      let user = await User.findOne({ providerId: mockGitHubUser.providerId, provider: 'github' });
      
      if (!user) {
        user = new User(mockGitHubUser);
        await user.save();
      }
      
      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      const refreshTokenString = generateRefreshTokenString();
      
      // Save refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
      await saveRefreshToken(user._id, refreshTokenString, expiresAt);
      
      // Set cookies
      res.cookie('accessToken', accessToken, { 
        httpOnly: true, 
        secure: false,
        maxAge: 15 * 60 * 1000 // 15 minutes
      });
      
      res.cookie('refreshToken', refreshTokenString, { 
        httpOnly: true, 
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.redirect('http://localhost:3000/dashboard');
    } catch (error) {
      res.status(500).json({ message: 'Error creating mock user' });
    }
  });
}

// Refresh token route
app.post('/auth/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not provided' });
  }
  
  try {
    const decoded = await verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Generate new access token
    const newAccessToken = generateAccessToken(user);
    
    // Set new access token cookie
    res.cookie('accessToken', newAccessToken, { 
      httpOnly: true, 
      secure: false,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    res.json({ 
      message: 'Token refreshed successfully',
      accessToken: newAccessToken
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Logout route
app.post('/auth/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (refreshToken) {
    try {
      await revokeRefreshToken(refreshToken);
    } catch (error) {
      // Continue with logout even if token revocation fails
    }
  }
  
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

// Get current user
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-__v -refreshTokens');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Create short link - POST /shorten
app.post('/shorten', authenticateToken, async (req, res) => {
  try {
    const { originalUrl, isPrivate = false, password = null, expiresIn = null } = req.body;
    
    if (!originalUrl) {
      return res.status(400).json({ message: 'Original URL is required' });
    }
    
    // Validate URL format
    try {
      new URL(originalUrl);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }
    
    // Generate unique slug
    const generateSlug = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    
    let slug;
    let isUnique = false;
    
    while (!isUnique) {
      slug = generateSlug();
      const existingLink = await Link.findOne({ slug });
      if (!existingLink) {
        isUnique = true;
      }
    }
    
    // Calculate expiration date if provided
    let expiresAt = null;
    if (expiresIn) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));
    }
    
    // Hash password if provided
    let hashedPassword = null;
    if (password && isPrivate) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    
    const link = new Link({
      userId: req.user.userId,
      originalUrl,
      shortUrl: `lknd/${slug}`,
      slug,
      isPrivate,
      password: hashedPassword,
      expiresAt
    });
    
    await link.save();
    
    res.status(201).json({
      success: true,
      link: {
        id: link._id,
        originalUrl: link.originalUrl,
        shortUrl: link.shortUrl,
        slug: link.slug,
        isPrivate: link.isPrivate,
        hasPassword: !!link.password,
        expiresAt: link.expiresAt,
        createdAt: link.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ message: 'Error creating link' });
  }
});

// Create short link (legacy route)
app.post('/api/links', authenticateToken, async (req, res) => {
  try {
    const { originalUrl, isPrivate = false } = req.body;
    
    if (!originalUrl) {
      return res.status(400).json({ message: 'Original URL is required' });
    }
    
    // Generate short URL
    const generateShortUrl = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    
    let shortUrl;
    let isUnique = false;
    
    while (!isUnique) {
      shortUrl = generateShortUrl();
      const existingLink = await Link.findOne({ shortUrl });
      if (!existingLink) {
        isUnique = true;
      }
    }
    
    const link = new Link({
      userId: req.user.userId,
      originalUrl,
      shortUrl: `lknd/${shortUrl}`,
      slug: shortUrl,
      isPrivate
    });
    
    await link.save();
    
    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ message: 'Error creating link' });
  }
});

// Verify password for private link
app.post('/verify-password/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    
    const link = await Link.findOne({ slug });
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    if (!link.isPrivate || !link.password) {
      return res.status(400).json({ message: 'Link does not require password' });
    }
    
    const isValidPassword = await bcrypt.compare(password, link.password);
    
    if (isValidPassword) {
      res.json({ 
        success: true, 
        message: 'Password verified',
        redirectUrl: `/lknd/${link.slug}?password=${encodeURIComponent(password)}`
      });
    } else {
      res.status(401).json({ 
        success: false,
        message: 'Invalid password' 
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying password' });
  }
});

// Get user's links with enhanced data
app.get('/api/links', authenticateToken, async (req, res) => {
  try {
    const links = await Link.find({ userId: req.user.userId })
      .select('-password') // Don't send password hashes
      .sort({ createdAt: -1 });
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching links' });
  }
});

// Get link details by ID
app.get('/api/links/:id', authenticateToken, async (req, res) => {
  try {
    const link = await Link.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    }).select('-password');
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching link' });
  }
});

// Update link
app.put('/api/links/:id', authenticateToken, async (req, res) => {
  try {
    const { isPrivate, password, expiresIn } = req.body;
    
    const link = await Link.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    // Update fields
    if (typeof isPrivate === 'boolean') {
      link.isPrivate = isPrivate;
    }
    
    if (password && isPrivate) {
      link.password = await bcrypt.hash(password, 10);
    } else if (!isPrivate) {
      link.password = null;
    }
    
    if (expiresIn) {
      link.expiresAt = new Date();
      link.expiresAt.setDate(link.expiresAt.getDate() + parseInt(expiresIn));
    }
    
    await link.save();
    
    res.json({
      success: true,
      link: {
        id: link._id,
        originalUrl: link.originalUrl,
        shortUrl: link.shortUrl,
        slug: link.slug,
        isPrivate: link.isPrivate,
        hasPassword: !!link.password,
        expiresAt: link.expiresAt,
        clicks: link.clicks,
        lastAccessed: link.lastAccessed,
        createdAt: link.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating link' });
  }
});

// Delete link
app.delete('/api/links/:id', authenticateToken, async (req, res) => {
  try {
    const link = await Link.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting link' });
  }
});

// Redirect short link - GET /:slug
app.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;
    const { password } = req.query;
    
    const link = await Link.findOne({ slug });
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    // Check if link is expired
    if (link.expiresAt && new Date() > link.expiresAt) {
      return res.status(410).json({ message: 'Link has expired' });
    }
    
    // Check if link is private and requires password
    if (link.isPrivate) {
      if (!password) {
        return res.status(401).json({ 
          message: 'Password required for private link',
          requiresPassword: true,
          slug: link.slug
        });
      }
      
      // Verify password
      if (link.password) {
        const isValidPassword = await bcrypt.compare(password, link.password);
        if (!isValidPassword) {
          return res.status(401).json({ 
            message: 'Invalid password',
            requiresPassword: true,
            slug: link.slug
          });
        }
      }
    }
    
    // Increment clicks and update last accessed
    link.clicks += 1;
    link.lastAccessed = new Date();
    await link.save();
    
    res.redirect(link.originalUrl);
  } catch (error) {
    console.error('Error redirecting link:', error);
    res.status(500).json({ message: 'Error redirecting link' });
  }
});

// Legacy redirect route
app.get('/lknd/:shortUrl', async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const link = await Link.findOne({ shortUrl: `lknd/${shortUrl}` });
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    // Check if link is expired
    if (link.expiresAt && new Date() > link.expiresAt) {
      return res.status(410).json({ message: 'Link has expired' });
    }
    
    // Increment clicks
    link.clicks += 1;
    link.lastAccessed = new Date();
    await link.save();
    
    res.redirect(link.originalUrl);
  } catch (error) {
    res.status(500).json({ message: 'Error redirecting link' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    oauth: {
      google: hasValidGoogleCredentials,
      github: hasValidGitHubCredentials
    },
    mock: {
      enabled: !hasValidGoogleCredentials || !hasValidGitHubCredentials
    },
    features: {
      refreshTokens: true,
      passwordProtectedLinks: true,
      linkExpiration: true,
      advancedAuth: true
    }
  });
});

// Cleanup expired tokens every hour
setInterval(async () => {
  try {
    await cleanExpiredRefreshTokens();
    console.log('Cleaned expired refresh tokens');
  } catch (error) {
    console.error('Error cleaning expired tokens:', error);
  }
}, 60 * 60 * 1000); // Every hour

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API Documentation:`);
  console.log(`   POST /shorten - Create short link`);
  console.log(`   GET /:slug - Redirect to original URL`);
  console.log(`   POST /auth/refresh - Refresh access token`);
  console.log(`   POST /verify-password/:slug - Verify password for private link`);
  
  if (!hasValidGoogleCredentials || !hasValidGitHubCredentials) {
    console.log('⚠️  OAuth not configured. Using mock authentication for development.');
    console.log('   Set up your .env file with real OAuth credentials to enable real login.');
  } else {
    console.log('✅ OAuth configured and ready for production use.');
  }
  
  console.log('✨ Advanced features enabled:');
  console.log('   - JWT with refresh tokens');
  console.log('   - Password-protected links');
  console.log('   - Link expiration');
  console.log('   - Enhanced security');
}); 