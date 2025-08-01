# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o **linkando.dev**! 🎉

## 📋 Como Contribuir

### 1. Fork e Clone
```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/adryanngcosta/testelinkando.dev.git
cd testelinkando.dev

# Adicione o repositório original como upstream
git remote add upstream https://github.com/adryanngcosta/testelinkando.dev.git
```

### 2. Configure o Ambiente
```bash
# Instale dependências
npm install

# Configure variáveis de ambiente
cp env.example .env.local
# Edite .env.local com suas configurações

# Configure OAuth (se necessário)
npm run setup:oauth
```

### 3. Crie uma Branch
```bash
# Mantenha sua main atualizada
git checkout main
git pull upstream main

# Crie uma branch para sua feature
git checkout -b feature/nome-da-sua-feature
# ou
git checkout -b fix/nome-do-bug
```

### 4. Desenvolva
- Siga as [convenções de código](#convenções-de-código)
- Mantenha commits pequenos e focados
- Teste suas mudanças localmente

### 5. Commit e Push
```bash
# Adicione suas mudanças
git add .

# Commit com mensagem descritiva
git commit -m "feat: adiciona funcionalidade de exportar links"

# Push para sua branch
git push origin feature/nome-da-sua-feature
```

### 6. Pull Request
1. Vá para o GitHub
2. Clique em "New Pull Request"
3. Selecione sua branch
4. Preencha o template do PR
5. Aguarde review

## 📝 Convenções de Código

### Commits
Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: adiciona funcionalidade de exportar links
fix: corrige bug na validação de URLs
docs: atualiza README com novas instruções
style: formata código com prettier
refactor: reorganiza estrutura de componentes
test: adiciona testes para DashboardController
chore: atualiza dependências
```

### Estrutura de Arquivos
```
src/
├── app/           # Next.js App Router
├── controllers/   # Lógica de negócio
├── views/         # Componentes de UI
├── services/      # Comunicação com API
├── types/         # Tipos TypeScript
├── utils/         # Utilitários
└── models/        # Entidades de dados
```

### Nomenclatura
- **Arquivos**: `PascalCase.tsx` (componentes), `camelCase.ts` (utilitários)
- **Componentes**: `PascalCase`
- **Funções**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase`

### Estilo de Código
- Use TypeScript para tipagem
- Prefira arrow functions
- Use destructuring quando possível
- Mantenha funções pequenas e focadas
- Adicione comentários para lógica complexa

## 🧪 Testes

### Executar Testes
```bash
# Testes unitários
npm test

# Testes de integração
npm run test:integration

# Cobertura
npm run test:coverage
```

### Escrever Testes
```typescript
// Exemplo de teste para controller
describe('DashboardController', () => {
  it('should create link successfully', async () => {
    // Arrange
    const url = 'https://example.com';
    
    // Act
    const result = await createLink(url);
    
    // Assert
    expect(result.shortUrl).toBeDefined();
  });
});
```

## 🐛 Reportando Bugs

### Template de Bug Report
```markdown
**Descrição do Bug**
Uma descrição clara e concisa do bug.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Comportamento Atual**
O que realmente acontece.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente**
- OS: [ex: macOS 14.0]
- Browser: [ex: Chrome 120]
- Versão: [ex: 1.0.0]

**Informações Adicionais**
Qualquer contexto adicional sobre o problema.
```

## 💡 Sugerindo Features

### Template de Feature Request
```markdown
**Problema que a feature resolve**
Uma descrição clara do problema que sua feature resolve.

**Solução proposta**
Uma descrição clara da solução que você gostaria.

**Alternativas consideradas**
Uma descrição clara de quaisquer soluções alternativas ou features que você considerou.

**Contexto adicional**
Qualquer contexto adicional, screenshots ou mockups sobre a feature.
```

## 🎨 Design e UI

### Princípios de Design
- **Glassmorphism**: Use backdrop-blur e transparências
- **Fluidez**: Animações suaves e transições
- **Responsividade**: Funcione em todos os dispositivos
- **Acessibilidade**: Siga WCAG guidelines

### Cores
```css
/* Cores principais */
--primary: #3B82F6;    /* Azul */
--secondary: #06B6D4;  /* Ciano */
--background: #000000; /* Preto */
--text: #FFFFFF;       /* Branco */
```

### Componentes
- Use Tailwind CSS para estilização
- Mantenha consistência visual
- Teste em diferentes tamanhos de tela
- Considere modo escuro/claro

## 📚 Recursos Úteis

### Documentação
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Ferramentas
- [ESLint](https://eslint.org/) - Linting
- [Prettier](https://prettier.io/) - Formatação
- [Jest](https://jestjs.io/) - Testes
- [Storybook](https://storybook.js.org/) - Componentes

## 🏆 Tipos de Contribuições

### 🐛 Bug Fixes
- Corrigir bugs existentes
- Melhorar tratamento de erros
- Otimizar performance

### ✨ Features
- Adicionar novas funcionalidades
- Melhorar UX/UI
- Implementar melhorias de acessibilidade

### 📚 Documentação
- Melhorar README
- Adicionar comentários no código
- Criar guias de uso

### 🧪 Testes
- Adicionar testes unitários
- Implementar testes de integração
- Melhorar cobertura de código

### 🔧 Infraestrutura
- Atualizar dependências
- Melhorar configurações
- Otimizar build

## 🎯 Áreas de Foco

### Prioridade Alta
- [ ] Melhorar performance
- [ ] Adicionar testes
- [ ] Implementar analytics
- [ ] Otimizar SEO

### Prioridade Média
- [ ] Adicionar mais provedores OAuth
- [ ] Implementar cache
- [ ] Melhorar acessibilidade
- [ ] Adicionar PWA features

### Prioridade Baixa
- [ ] Temas personalizáveis
- [ ] API pública
- [ ] Integração com redes sociais
- [ ] Dashboard avançado

## 🙏 Agradecimentos

Obrigado por contribuir com o **linkando.dev**! 

- ⭐ Se o projeto te ajudou, considere dar uma estrela
- 🐛 Reporte bugs que encontrar
- 💡 Sugira melhorias
- 🤝 Ajude outros contribuidores

---

**Juntos fazemos o linkando.dev melhor!** 🚀 