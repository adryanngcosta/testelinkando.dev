# 🔐 Configuração OAuth Real - Google e GitHub

Este guia te ajudará a configurar autenticação real com Google e GitHub para o Linkando.

## 🚀 Configuração Rápida (Recomendado)

Execute o script interativo:

```bash
npm run setup:oauth
```

O script irá te guiar através de todo o processo e criar o arquivo `.env` automaticamente.

---

## 📋 Configuração Manual

### 🔵 Google OAuth Setup

1. **Acesse o Google Cloud Console**
   - Vá para: https://console.cloud.google.com/
   - Faça login com sua conta Google

2. **Crie um Projeto**
   - Clique em "Select a project" no topo
   - Clique em "New Project"
   - Nome: `Linkando` (ou qualquer nome)
   - Clique em "Create"

3. **Configure OAuth**
   - No menu lateral, vá em "APIs & Services" > "Credentials"
   - Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
   - Se solicitado, configure a tela de consentimento OAuth

4. **Configure a Aplicação OAuth**
   - **Application type**: Web application
   - **Name**: Linkando
   - **Authorized redirect URIs**: `http://localhost:5001/auth/google/callback`
   - Clique em "Create"

5. **Copie as Credenciais**
   - Anote o **Client ID** e **Client Secret**
   - Você precisará deles para o arquivo `.env`

### 🟣 GitHub OAuth Setup

1. **Acesse GitHub Developers**
   - Vá para: https://github.com/settings/developers
   - Faça login com sua conta GitHub

2. **Crie uma Nova OAuth App**
   - Clique em "New OAuth App"
   - Preencha os campos:
     - **Application name**: Linkando
     - **Homepage URL**: `http://localhost:3001`
     - **Application description**: Encurtador de links com autenticação
     - **Authorization callback URL**: `http://localhost:5001/auth/github/callback`

3. **Registre a Aplicação**
   - Clique em "Register application"
   - Anote o **Client ID**

4. **Gere o Client Secret**
   - Na página da aplicação, clique em "Generate a new client secret"
   - Anote o **Client Secret**

---

## ⚙️ Configuração do Arquivo .env

Crie um arquivo `.env` na raiz do projeto:

```env
# OAuth Configuration
GOOGLE_CLIENT_ID=seu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_google_client_secret_aqui
GITHUB_CLIENT_ID=seu_github_client_id_aqui
GITHUB_CLIENT_SECRET=seu_github_client_secret_aqui

# JWT and Session Secrets (gerados automaticamente pelo script)
JWT_SECRET=seu_jwt_secret_aqui
SESSION_SECRET=seu_session_secret_aqui

# Database
MONGODB_URI=mongodb://localhost:27017/linkando

# Server
PORT=5001
```

---

## 🔄 Reiniciar o Servidor

Após configurar as credenciais:

```bash
# Pare o servidor atual (Ctrl+C)
# Reinicie o servidor
npm run server
```

---

## ✅ Verificar Configuração

Acesse: http://localhost:5001/api/health

Se OAuth estiver configurado corretamente, você verá:
```json
{
  "oauth": {
    "google": true,
    "github": true
  },
  "mock": {
    "enabled": false
  }
}
```

---

## 🧪 Testar Login Real

1. **Acesse**: http://localhost:3001
2. **Clique** em "Continuar com Google" ou "Continuar com GitHub"
3. **Autorize** a aplicação na tela do Google/GitHub
4. **Será redirecionado** para o dashboard com sua conta real

---

## 🔒 Segurança

- **Nunca compartilhe** suas credenciais OAuth
- **Não commite** o arquivo `.env` no Git
- **Use variáveis de ambiente** em produção
- **Configure HTTPS** em produção

---

## 🚨 Troubleshooting

### Erro: "Invalid client"
- Verifique se as credenciais estão corretas no `.env`
- Confirme se as URLs de redirecionamento estão configuradas corretamente

### Erro: "Redirect URI mismatch"
- Verifique se a URL de callback está exatamente igual: `http://localhost:5001/auth/google/callback`

### Erro: "OAuth not configured"
- Confirme se o arquivo `.env` existe e tem as credenciais
- Reinicie o servidor após adicionar as credenciais

---

## 📱 Para Produção

Quando for para produção:

1. **Configure URLs de produção**:
   - Google: `https://seudominio.com/auth/google/callback`
   - GitHub: `https://seudominio.com/auth/github/callback`

2. **Use HTTPS** obrigatoriamente

3. **Configure variáveis de ambiente** no servidor

4. **Atualize CORS** para seu domínio

---

## 🎯 Próximos Passos

Após configurar OAuth real:

1. ✅ Teste login com Google
2. ✅ Teste login com GitHub  
3. ✅ Verifique se os dados do usuário estão corretos
4. ✅ Teste criação de links
5. ✅ Teste logout e novo login

**Agora você tem autenticação real funcionando! 🎉** 