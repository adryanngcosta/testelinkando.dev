#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🔐 CONFIGURAÇÃO OAUTH - GOOGLE E GITHUB');
console.log('=====================================\n');

async function setupOAuth() {
  const envPath = path.join(__dirname, '.env');
  let envContent = '';

  // Check if .env exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  console.log('📋 Vamos configurar suas credenciais OAuth:\n');

  // Google OAuth Setup
  console.log('🔵 GOOGLE OAUTH SETUP:');
  console.log('1. Acesse: https://console.cloud.google.com/');
  console.log('2. Crie um novo projeto ou selecione um existente');
  console.log('3. Vá em "APIs & Services" > "Credentials"');
  console.log('4. Clique em "Create Credentials" > "OAuth 2.0 Client IDs"');
  console.log('5. Configure:');
  console.log('   - Application type: Web application');
  console.log('   - Name: Linkando (ou qualquer nome)');
  console.log('   - Authorized redirect URIs: http://localhost:5001/auth/google/callback');
  console.log('6. Copie o Client ID e Client Secret\n');

  const googleClientId = await question('🔑 Google Client ID: ');
  const googleClientSecret = await question('🔐 Google Client Secret: ');

  console.log('\n🟣 GITHUB OAUTH SETUP:');
  console.log('1. Acesse: https://github.com/settings/developers');
  console.log('2. Clique em "New OAuth App"');
  console.log('3. Configure:');
  console.log('   - Application name: Linkando (ou qualquer nome)');
  console.log('   - Homepage URL: http://localhost:3001');
  console.log('   - Authorization callback URL: http://localhost:5001/auth/github/callback');
  console.log('4. Clique em "Register application"');
  console.log('5. Copie o Client ID e gere um Client Secret\n');

  const githubClientId = await question('🔑 GitHub Client ID: ');
  const githubClientSecret = await question('🔐 GitHub Client Secret: ');

  // Generate JWT secret
  const jwtSecret = require('crypto').randomBytes(64).toString('hex');
  const sessionSecret = require('crypto').randomBytes(32).toString('hex');

  // Build .env content
  const newEnvContent = `# OAuth Configuration
GOOGLE_CLIENT_ID=${googleClientId}
GOOGLE_CLIENT_SECRET=${googleClientSecret}
GITHUB_CLIENT_ID=${githubClientId}
GITHUB_CLIENT_SECRET=${githubClientSecret}

# JWT and Session Secrets
JWT_SECRET=${jwtSecret}
SESSION_SECRET=${sessionSecret}

# Database
MONGODB_URI=mongodb://localhost:27017/linkando

# Server
PORT=5001
`;

  // Write .env file
  fs.writeFileSync(envPath, newEnvContent);

  console.log('\n✅ CONFIGURAÇÃO CONCLUÍDA!');
  console.log('========================');
  console.log('📁 Arquivo .env criado/atualizado');
  console.log('🔐 Credenciais OAuth configuradas');
  console.log('🔑 JWT e Session secrets gerados automaticamente');
  console.log('\n🚀 PRÓXIMOS PASSOS:');
  console.log('1. Reinicie o servidor: npm run server');
  console.log('2. Acesse: http://localhost:3001');
  console.log('3. Teste o login real com Google/GitHub');
  console.log('\n⚠️  IMPORTANTE:');
  console.log('- Mantenha suas credenciais seguras');
  console.log('- Não compartilhe o arquivo .env');
  console.log('- Para produção, use variáveis de ambiente do servidor');

  rl.close();
}

setupOAuth().catch(console.error); 