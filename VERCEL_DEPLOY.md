# 🚀 Deploy na Vercel - AI Interview Platform

## 📋 Pré-requisitos

1. **Conta na Vercel** - [vercel.com](https://vercel.com)
2. **Conta no GitHub** - [github.com](https://github.com)
3. **Chave da API OpenRouter** - [openrouter.ai](https://openrouter.ai)

## 🔧 Configuração

### Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Passo 2: Login na Vercel

```bash
vercel login
```

### Passo 3: Configurar Variáveis de Ambiente

No dashboard da Vercel, adicione as seguintes variáveis:

```env
DATABASE_URL=file:./prod.db
NODE_ENV=production
OPENROUTER_API_KEY=sua_chave_openrouter_aqui
AI_MODEL=deepseek/deepseek-chat-v3-0324:free
AI_API_URL=https://openrouter.ai/api/v1/chat/completions
JWT_SECRET=sua_chave_jwt_secreta_aqui
CORS_ORIGIN=https://sua-app.vercel.app
LOG_LEVEL=info
```

## 🚀 Deploy

### Opção 1: Deploy via CLI

```bash
# No diretório raiz do projeto
vercel

# Para produção
vercel --prod
```

### Opção 2: Deploy via GitHub

1. **Conecte o repositório** na Vercel
2. **Configure as variáveis** de ambiente
3. **Deploy automático** a cada push

## 📁 Estrutura do Deploy

```
/
├── vercel.json          # Configuração principal
├── backend/
│   ├── vercel.json      # Configuração do backend
│   └── src/index.js     # Entry point do backend
└── frontend/
    ├── vercel.json      # Configuração do frontend
    └── public/          # Arquivos estáticos
```

## 🔗 URLs de Acesso

Após o deploy, você terá:

- **Frontend:** `https://sua-app.vercel.app`
- **Backend API:** `https://sua-app.vercel.app/api`
- **Health Check:** `https://sua-app.vercel.app/api/health`

## 🛠️ Troubleshooting

### Problema: Erro de build
- Verifique se todas as dependências estão no `package.json`
- Confirme se as variáveis de ambiente estão configuradas

### Problema: Erro de banco de dados
- SQLite funciona na Vercel, mas considere PostgreSQL para produção
- Verifique se o `DATABASE_URL` está correto

### Problema: CORS
- Atualize `CORS_ORIGIN` com a URL correta da Vercel
- Verifique se o frontend está fazendo requisições para a URL correta

## 📊 Monitoramento

- **Logs:** Dashboard da Vercel > Functions > Logs
- **Métricas:** Dashboard da Vercel > Analytics
- **Performance:** Dashboard da Vercel > Speed Insights

## 🔄 Atualizações

Para atualizar a aplicação:

```bash
# Fazer alterações no código
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# Deploy automático via GitHub (se configurado)
# Ou deploy manual:
vercel --prod
```

## 💡 Dicas de Produção

1. **Use PostgreSQL** para banco de dados em produção
2. **Configure domínio customizado** se necessário
3. **Monitore logs** regularmente
4. **Configure backup** do banco de dados
5. **Use CDN** para arquivos estáticos

---

**Suporte:** Consulte a [documentação da Vercel](https://vercel.com/docs) para mais informações.
