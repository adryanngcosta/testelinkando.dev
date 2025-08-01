# 🔗 linkando.dev

[![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Uma aplicação moderna e elegante para encurtamento de links com autenticação OAuth, interface glassmorphism e recursos avançados.

## ✨ Funcionalidades

- 🔗 **Encurtamento de Links**: URLs longas transformadas em links curtos e memoráveis
- 🔒 **Links Privados**: Proteção com senha opcional
- ⏰ **Expiração Automática**: Defina prazos de validade para seus links
- 📊 **Analytics**: Contagem de cliques em tempo real
- 🔐 **Autenticação OAuth**: Login com Google e GitHub
- 🎨 **Interface Moderna**: Design glassmorphism com efeitos fluidos
- 📱 **Responsivo**: Funciona perfeitamente em todos os dispositivos
- ⚡ **Performance**: Otimizado com Next.js 15 e Turbopack

## 🚀 Demonstração

![Dashboard](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Dashboard+linkando.dev)

> **Nota**: Screenshots serão adicionados em breve!

## 🛠️ Tecnologias

### Frontend
- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS utilitário
- **Glassmorphism** - Efeitos visuais modernos

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Passport.js** - Autenticação OAuth
- **JWT** - Tokens de autenticação

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- MongoDB
- Contas OAuth (Google/GitHub)

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/linkando.dev.git
cd linkando.dev
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:

```env
# Server Configuration
PORT=5001
MONGODB_URI=mongodb://localhost:27017/linkando
JWT_SECRET=seu-jwt-secret-super-seguro-e-aleatorio
SESSION_SECRET=seu-session-secret-super-seguro

# Google OAuth
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=seu-github-client-id
GITHUB_CLIENT_SECRET=seu-github-client-secret
```

### 4. Configure OAuth
```bash
npm run setup:oauth
```

### 5. Inicie o servidor de desenvolvimento
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:server
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🏗️ Arquitetura MVC

O projeto segue o padrão Model-View-Controller para melhor organização e manutenibilidade.

### 📁 Estrutura de Pastas

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Página do dashboard
│   └── ...
├── controllers/           # Controllers (Lógica de negócio)
│   └── DashboardController.ts
├── views/                 # Views (Componentes de UI)
│   └── DashboardView.tsx
├── services/              # Services (Comunicação com API)
│   └── api.ts
├── types/                 # Tipos TypeScript
│   └── index.ts
├── models/                # Models (Entidades de dados)
├── utils/                 # Utilitários
└── ...
```

### 🔧 Componentes da Arquitetura

#### **Models** (`src/types/`)
- **User**: Interface do usuário
- **Link**: Interface do link encurtado
- **CreateLinkRequest**: Interface para criação de links

#### **Views** (`src/views/`)
- **DashboardView**: Componente de UI do dashboard
- Responsável apenas pela apresentação visual
- Recebe props do controller

#### **Controllers** (`src/controllers/`)
- **DashboardController**: Gerencia toda a lógica de negócio
- Estados, efeitos e handlers
- Comunicação com services

#### **Services** (`src/services/`)
- **api.ts**: Centraliza toda comunicação com o backend
- **userApi**: Operações relacionadas ao usuário
- **linksApi**: Operações relacionadas aos links
- **fetchWithAuth**: Função com refresh automático de token

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Frontend (Next.js)
npm run dev:server       # Backend (Express)

# Produção
npm run build           # Build do frontend
npm run start           # Iniciar produção
npm run server          # Iniciar servidor backend

# Utilitários
npm run lint            # Linting
npm run setup:oauth     # Configurar OAuth
```

## 🎨 Design System

### Cores
- **Primária**: Azul (#3B82F6)
- **Secundária**: Ciano (#06B6D4)
- **Fundo**: Preto (#000000)
- **Texto**: Branco com transparência

### Efeitos
- **Glassmorphism**: Backdrop blur e transparências
- **Gradientes**: Radiais e lineares
- **Animações**: Pulse, hover e transições suaves
- **Partículas**: Efeitos flutuantes

## 🔐 Configuração OAuth

### Google OAuth
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto ou selecione um existente
3. Ative a API Google+ 
4. Configure as credenciais OAuth 2.0
5. Adicione URIs de redirecionamento

### GitHub OAuth
1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. Crie um novo OAuth App
3. Configure a URL de callback
4. Copie Client ID e Client Secret

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/google` - Login Google
- `POST /api/auth/github` - Login GitHub
- `POST /api/auth/logout` - Logout

### Links
- `GET /api/links` - Listar links do usuário
- `POST /api/links` - Criar novo link
- `DELETE /api/links/:id` - Deletar link
- `GET /:shortCode` - Redirecionar para URL original

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [MongoDB](https://mongodb.com/) - Banco de dados
- [Passport.js](https://passportjs.org/) - Autenticação

---

**Desenvolvido com ❤️ para [linkando.dev](https://linkando.dev)**

[![GitHub stars](https://img.shields.io/github/stars/seu-usuario/linkando.dev?style=social)](https://github.com/seu-usuario/linkando.dev)
[![GitHub forks](https://img.shields.io/github/forks/seu-usuario/linkando.dev?style=social)](https://github.com/seu-usuario/linkando.dev)
[![GitHub issues](https://img.shields.io/github/issues/seu-usuario/linkando.dev)](https://github.com/seu-usuario/linkando.dev/issues)
