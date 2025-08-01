import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Link, CreateLinkRequest } from '../types';
import { userApi, linksApi } from '../services/api';

export const useDashboardController = () => {
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [originalUrl, setOriginalUrl] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [expiresIn, setExpiresIn] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  // Fetch user data
  const fetchUser = async () => {
    try {
      const userData = await userApi.getCurrentUser();
      if (userData) {
        setUser(userData);
      } else {
        console.log('Usuário não autenticado, redirecionando...');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  // Fetch links
  const fetchLinks = async () => {
    try {
      const linksData = await linksApi.getLinks();
      setLinks(linksData);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  // Create new link
  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl.trim()) return;

    setCreating(true);
    try {
      const linkData: CreateLinkRequest = {
        originalUrl: originalUrl.trim(),
        isPrivate,
        password: isPrivate && password ? password : undefined,
        expiresIn: expiresIn ? parseInt(expiresIn) : undefined
      };

      const newLink = await linksApi.createLink(linkData);
      if (newLink) {
        setLinks(prev => [newLink, ...prev]);
        setOriginalUrl('');
        setIsPrivate(false);
        setPassword('');
        setExpiresIn('');
      }
    } catch (error) {
      console.error('Error creating link:', error);
    } finally {
      setCreating(false);
    }
  };

  // Delete link
  const handleDeleteLink = async (linkId: string) => {
    try {
      const success = await linksApi.deleteLink(linkId);
      if (success) {
        setLinks(prev => prev.filter(link => link._id !== linkId));
      }
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  // Copy link to clipboard
  const handleCopyLink = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(`http://localhost:5001/${shortUrl.split('/').pop()}`);
      // You could add a toast notification here
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      const success = await userApi.logout();
      if (success) {
        router.push('/');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      router.push('/');
    }
  };

  // Effects
  useEffect(() => {
    fetchUser();
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchLinks();
    }
  }, [user]);

  return {
    // State
    user,
    links,
    originalUrl,
    isPrivate,
    password,
    expiresIn,
    loading,
    creating,
    
    // Setters
    setOriginalUrl,
    setIsPrivate,
    setPassword,
    setExpiresIn,
    
    // Actions
    handleCreateLink,
    handleDeleteLink,
    handleCopyLink,
    handleLogout
  };
}; 