import { User, Link, CreateLinkRequest } from '../types';

const API_BASE = 'http://localhost:5001';

// Function to refresh access token
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.accessToken;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
  return null;
};

// Enhanced fetch with token refresh
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response | null> => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      const errorData = await response.json();
      if (errorData.code === 'TOKEN_EXPIRED') {
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry the request with new token
          return fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...options.headers,
            },
          });
        }
      }
    }

    return response;
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
};

// User API
export const userApi = {
  getCurrentUser: async (): Promise<User | null> => {
    const response = await fetchWithAuth(`${API_BASE}/api/user`);
    if (response && response.ok) {
      return response.json();
    }
    return null;
  },

  logout: async (): Promise<boolean> => {
    const response = await fetchWithAuth(`${API_BASE}/auth/logout`, {
      method: 'POST',
    });
    return response ? response.ok : false;
  }
};

// Links API
export const linksApi = {
  getLinks: async (): Promise<Link[]> => {
    const response = await fetchWithAuth(`${API_BASE}/api/links`);
    if (response && response.ok) {
      return response.json();
    }
    return [];
  },

  createLink: async (linkData: CreateLinkRequest): Promise<Link | null> => {
    const response = await fetchWithAuth(`${API_BASE}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        originalUrl: linkData.originalUrl.trim(),
        isPrivate: linkData.isPrivate,
        password: linkData.isPrivate && linkData.password ? linkData.password : null,
        expiresIn: linkData.expiresIn ? parseInt(linkData.expiresIn.toString()) : null
      }),
    });

    if (response && response.ok) {
      const data = await response.json();
      return data.link;
    }
    return null;
  },

  deleteLink: async (linkId: string): Promise<boolean> => {
    const response = await fetchWithAuth(`${API_BASE}/api/links/${linkId}`, {
      method: 'DELETE',
    });
    return response ? response.ok : false;
  }
}; 