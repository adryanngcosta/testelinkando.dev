export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface Link {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  slug: string;
  isPrivate: boolean;
  hasPassword?: boolean;
  clicks: number;
  lastAccessed?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface CreateLinkRequest {
  originalUrl: string;
  isPrivate: boolean;
  password?: string;
  expiresIn?: number;
} 