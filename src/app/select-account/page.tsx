'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const mockAccounts = [
  {
    id: 'google-1',
    name: 'João Silva',
    email: 'joao.silva@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    provider: 'google',
    providerId: 'mock-google-123'
  },
  {
    id: 'google-2',
    name: 'Ana Costa',
    email: 'ana.costa@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    provider: 'google',
    providerId: 'mock-google-456'
  },
  {
    id: 'github-1',
    name: 'maria_dev',
    email: 'maria.dev@github.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    provider: 'github',
    providerId: 'mock-github-456'
  },
  {
    id: 'github-2',
    name: 'pedro_coder',
    email: 'pedro.coder@github.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    provider: 'github',
    providerId: 'mock-github-789'
  }
];

export default function SelectAccount() {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAccountSelect = async (accountId: string) => {
    setSelectedAccount(accountId);
    setLoading(true);

    const account = mockAccounts.find(acc => acc.id === accountId);
    if (!account) return;

    try {
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Fazer login com a conta selecionada
      const response = await fetch(`http://localhost:5001/auth/mock-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          accountId: account.id,
          username: account.name,
          email: account.email,
          provider: account.provider,
          providerId: account.providerId,
          avatar: account.avatar
        }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        console.error('Erro no login');
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <h1 className="text-xl font-medium text-gray-200">Linkando</h1>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-medium transition-all duration-300"
        >
          Voltar
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-2xl space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">Escolha sua conta</h2>
            <p className="text-gray-400 text-lg">Selecione uma das contas disponíveis para continuar</p>
          </div>

          {/* Account Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => handleAccountSelect(account.id)}
                disabled={loading}
                className={`relative p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                  selectedAccount === account.id ? 'border-purple-500/50 bg-purple-500/10' : ''
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {/* Loading overlay */}
                {loading && selectedAccount === account.id && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <img 
                    src={account.avatar} 
                    alt={account.name}
                    className="w-16 h-16 rounded-full border-2 border-white/20"
                  />
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-semibold text-white">{account.name}</h3>
                    <p className="text-gray-400 text-sm">{account.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`w-3 h-3 rounded-full ${
                        account.provider === 'google' ? 'bg-red-500' : 'bg-gray-700'
                      }`}></div>
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {account.provider}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Info */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Esta é uma simulação do processo de autenticação OAuth
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 