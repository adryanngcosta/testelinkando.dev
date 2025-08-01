import { Link } from '../types';
import { useState, useEffect } from 'react';

interface DashboardViewProps {
  user: any;
  links: Link[];
  originalUrl: string;
  isPrivate: boolean;
  password: string;
  expiresIn: string;
  loading: boolean;
  creating: boolean;
  setOriginalUrl: (value: string) => void;
  setIsPrivate: (value: boolean) => void;
  setPassword: (value: string) => void;
  setExpiresIn: (value: string) => void;
  handleCreateLink: (e: React.FormEvent) => void;
  handleDeleteLink: (linkId: string) => void;
  handleCopyLink: (shortUrl: string) => void;
  handleLogout: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  links,
  originalUrl,
  isPrivate,
  password,
  expiresIn,
  loading,
  creating,
  setOriginalUrl,
  setIsPrivate,
  setPassword,
  setExpiresIn,
  handleCreateLink,
  handleDeleteLink,
  handleCopyLink,
  handleLogout
}) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (loading || !isHydrated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/80 text-xl font-light">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Background Fluid Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,rgba(59,130,246,0.1),rgba(6,182,212,0.1),rgba(59,130,246,0.1))] opacity-30"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Header */}
      <header className="relative flex justify-center items-center p-12 z-10">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
              <svg className="w-8 h-8 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full border-2 border-slate-900 shadow-lg animate-pulse"></div>
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-extralight text-white/95 tracking-wider bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">linkando.dev</h1>
            <p className="text-blue-200/70 text-lg mt-3 font-light">Encurta links com fluidez</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-8 pb-24 z-10">
        <div className="w-full max-w-3xl space-y-16">
          {/* Create Link Form */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-600/10 rounded-3xl blur-3xl group-hover:blur-4xl transition-all duration-700"></div>
            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <form onSubmit={handleCreateLink} className="space-y-10 relative z-10">
                <div>
                  <label className="block text-white/90 mb-4 font-light text-xl">URL</label>
                  <div className="flex gap-4">
                    <div className="flex-1 relative group/input">
                      <input
                        type="url"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        onPaste={(e) => {
                          const pastedText = e.clipboardData.getData('text');
                          setOriginalUrl(pastedText);
                        }}
                        placeholder="Cole o link aqui..."
                        className="w-full px-6 py-5 pr-14 bg-white/5 border border-white/10 rounded-2xl text-white/90 placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/40 transition-all duration-300 text-base shadow-none relative overflow-hidden group-hover:bg-white/8"
                        required
                      />
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/input:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-600/10 rounded-2xl animate-pulse"></div>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            setOriginalUrl(text);
                          } catch (error) {
                            console.error('Erro ao ler clipboard:', error);
                          }
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-blue-200/70 hover:text-white transition-colors relative overflow-hidden group/btn rounded-xl"
                        title="Colar do clipboard"
                      >
                        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl animate-pulse"></div>
                        </div>
                        <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPrivate(!isPrivate)}
                      className={`p-0 w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center bg-white/5 transition-all duration-300 shadow-none focus:ring-2 focus:ring-blue-500/30 relative overflow-hidden group/btn ${isPrivate ? 'text-blue-200' : 'text-cyan-200'}`}
                      title={isPrivate ? 'Link Privado' : 'Link Público'}
                    >
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-600/20 animate-pulse rounded-2xl"></div>
                      </div>
                      {isPrivate ? (
                        <svg className="w-7 h-7 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-7 h-7 relative z-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M1.75 12S5.5 5.75 12 5.75 22.25 12 22.25 12 18.5 18.25 12 18.25 1.75 12 1.75 12Z" />
                          <circle cx="12" cy="12" r="3.25" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {isPrivate && (
                  <div>
                    <label className="block text-white/90 mb-4 font-light text-xl">Senha (opcional)</label>
                    <div className="relative group/input">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha para acesso ao link"
                        className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white/90 placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/40 transition-all duration-300 text-base shadow-none pr-10 relative overflow-hidden group-hover:bg-white/8"
                      />
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/input:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-600/10 rounded-2xl animate-pulse"></div>
                      </div>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200/70" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-white/90 mb-4 font-light text-xl">Expiração (opcional)</label>
                  <div className="relative group/input">
                    <input
                      type="number"
                      value={expiresIn}
                      onChange={(e) => setExpiresIn(e.target.value)}
                      placeholder="Dias"
                      min="1"
                      max="365"
                      className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white/90 placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/40 transition-all duration-300 text-base shadow-none pr-10 relative overflow-hidden group-hover:bg-white/8"
                    />
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/input:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-600/10 rounded-2xl animate-pulse"></div>
                    </div>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full px-8 py-6 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-600/20 border border-white/10 text-white/90 font-light rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-none focus:ring-2 focus:ring-blue-500/30 text-xl flex items-center justify-center gap-3 relative overflow-hidden group/btn hover:from-blue-500/30 hover:via-cyan-500/30 hover:to-blue-600/30"
                >
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-600/20 animate-pulse rounded-2xl"></div>
                  </div>
                  {creating ? (
                    <div className="flex items-center justify-center gap-3 relative z-10">
                      <div className="w-6 h-6 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-lg">Criando...</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span className="relative z-10">Encurtar</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Links List */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-600/10 rounded-3xl blur-3xl group-hover:blur-4xl transition-all duration-700"></div>
            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <h3 className="text-4xl font-extralight text-white/95 mb-12 text-center relative z-10 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">Seus Links</h3>
              {links.length === 0 ? (
                <div className="text-center py-20 relative z-10">
                  <div className="w-32 h-32 mx-auto mb-10 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-blue-600/20 rounded-full flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-xl">
                    <svg className="w-16 h-16 text-blue-200/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h4 className="text-4xl font-extralight text-white/90 mb-6">Nenhum link criado ainda</h4>
                  <p className="text-blue-200/70 text-xl font-light">Encurte seu primeiro link acima para começar</p>
                </div>
              ) : (
                <div className="space-y-8 relative z-10">
                  {links.map((link) => (
                    <div key={link._id} className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-blue-400/30 transition-all duration-500 group relative overflow-hidden">
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-600/10 animate-pulse rounded-3xl"></div>
                      </div>
                      {/* Header com status e data */}
                      <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-4">
                          <span className={`text-sm font-light px-4 py-2 rounded-full ${
                            link.isPrivate 
                              ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-200 border border-blue-400/30' 
                              : 'bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 text-cyan-200 border border-cyan-400/30'
                          }`}>
                            {link.isPrivate ? '🔒' : '👁️'}
                          </span>
                          <span className="text-blue-200/70 text-sm font-light">
                            👆 {link.clicks} cliques
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-blue-200/70 text-sm font-light">
                            {new Date(link.createdAt).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                          <button
                            onClick={() => handleDeleteLink(link._id)}
                            className="text-red-400/80 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-xl hover:scale-110 relative overflow-hidden group/btn"
                            title="Deletar link"
                          >
                            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 animate-pulse rounded-xl"></div>
                            </div>
                            <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* URL Original */}
                      <div className="mb-6 relative z-10">
                        <p className="text-white/80 text-lg break-all leading-relaxed font-light">{link.originalUrl}</p>
                      </div>
                      
                      {/* URL Encurtada e Botão Copiar */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10">
                        <div className="flex items-center gap-4">
                          <p className="text-white/95 font-mono text-xl font-bold">{link.shortUrl}</p>
                          <button
                            onClick={() => handleCopyLink(link.shortUrl)}
                            className="px-5 py-2 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-600/20 hover:from-blue-500/30 hover:via-cyan-500/30 hover:to-blue-600/30 rounded-xl transition-all duration-300 border border-white/10 hover:border-blue-400/30 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 relative overflow-hidden group/btn"
                            title="Copiar link"
                          >
                            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-600/20 animate-pulse rounded-xl"></div>
                            </div>
                            <svg className="w-4 h-4 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span className="text-white text-sm font-light relative z-10">Copiar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Logout Button - Fixed at bottom right */}
      <button
        onClick={handleLogout}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-600/20 hover:from-blue-500/30 hover:via-cyan-500/30 hover:to-blue-600/30 border border-white/10 hover:border-blue-400/30 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl hover:shadow-2xl backdrop-blur-xl z-20 hover:scale-110 relative overflow-hidden group"
        title="Sair"
      >
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-600/20 animate-pulse rounded-full"></div>
        </div>
        <svg className="w-7 h-7 text-white/90 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  );
}; 