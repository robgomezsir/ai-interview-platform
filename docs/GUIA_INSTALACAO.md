# 🛠️ Guia de Instalação e Configuração

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação Rápida](#instalação-rápida)
3. [Instalação Detalhada](#instalação-detalhada)
4. [Configuração](#configuração)
5. [Verificação da Instalação](#verificação-da-instalação)
6. [Configuração de Produção](#configuração-de-produção)
7. [Troubleshooting](#troubleshooting)

## 🔧 Pré-requisitos

### Software Necessário

| Software | Versão Mínima | Descrição |
|----------|---------------|-----------|
| **Docker** | 20.10+ | Containerização da aplicação |
| **Docker Compose** | 2.0+ | Orquestração de containers |
| **Git** | 2.30+ | Controle de versão |
| **Node.js** | 18.0+ | Desenvolvimento local (opcional) |

### Recursos do Sistema

- **RAM:** Mínimo 4GB, recomendado 8GB+
- **CPU:** 2 cores, recomendado 4+ cores
- **Disco:** 10GB de espaço livre
- **Sistema Operacional:** Windows 10+, macOS 10.15+, Ubuntu 18.04+

### Contas Necessárias

- **OpenRouter** (gratuito): Para API de IA
- **GitHub** (opcional): Para clonar o repositório

## 🚀 Instalação Rápida

### Passo 1: Clone o Repositório

```bash
git clone https://github.com/robgomezsir/ai-interview-platform.git
cd ai-interview-platform
```

### Passo 2: Configure as Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp backend/env.example backend/.env

# Edite o arquivo .env
nano backend/.env  # ou use seu editor preferido
```

### Passo 3: Configure a API de IA

Edite o arquivo `backend/.env` e adicione sua chave:

```env
OPENROUTER_API_KEY=sua_chave_aqui
```

### Passo 4: Execute a Aplicação

```bash
# Instalar dependências
npm run setup

# Iniciar aplicação
npm run dev
```

### Passo 5: Acesse a Aplicação

- **Frontend:** http://localhost:8080
- **Backend:** http://localhost:3000

## 📖 Instalação Detalhada

### Passo 1: Preparação do Ambiente

#### Windows

1. **Instale o Docker Desktop:**
   - Baixe em: https://www.docker.com/products/docker-desktop
   - Execute o instalador
   - Reinicie o computador

2. **Instale o Git:**
   - Baixe em: https://git-scm.com/download/win
   - Use as configurações padrão

3. **Instale o Node.js (opcional):**
   - Baixe em: https://nodejs.org/
   - Escolha a versão LTS

#### macOS

1. **Instale o Homebrew:**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. **Instale o Docker:**
```bash
brew install --cask docker
```

3. **Instale o Git:**
```bash
brew install git
```

4. **Instale o Node.js (opcional):**
```bash
brew install node
```

#### Ubuntu/Debian

1. **Atualize o sistema:**
```bash
sudo apt update && sudo apt upgrade -y
```

2. **Instale o Docker:**
```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. **Instale o Git:**
```bash
sudo apt install git -y
```

4. **Instale o Node.js (opcional):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Passo 2: Obtenção da Chave da API

1. **Acesse o OpenRouter:**
   - Vá para: https://openrouter.ai/
   - Crie uma conta gratuita

2. **Gere uma chave API:**
   - Acesse: https://openrouter.ai/keys
   - Clique em "Create Key"
   - Copie a chave gerada

3. **Configure os créditos:**
   - O plano gratuito inclui créditos limitados
   - Para produção, considere um plano pago

### Passo 3: Configuração do Projeto

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/ai-interview-platform.git
cd ai-interview-platform
```

2. **Configure as variáveis de ambiente:**
```bash
# Copie o arquivo de exemplo
cp backend/env.example backend/.env

# Edite o arquivo
nano backend/.env
```

3. **Configure o arquivo .env:**
```env
# Banco de Dados
DATABASE_URL="postgresql://postgres:postgres123@postgres:5432/ai_interview_platform"

# API de IA
OPENROUTER_API_KEY="sua_chave_aqui"
AI_MODEL="deepseek/deepseek-chat-v3-0324:free"
AI_API_URL="https://openrouter.ai/api/v1/chat/completions"

# Servidor
NODE_ENV="development"
PORT=3000
HOST="0.0.0.0"

# CORS
CORS_ORIGIN="http://localhost:8080"

# Logs
LOG_LEVEL="info"
```

### Passo 4: Instalação das Dependências

```bash
# Instalar dependências do projeto principal
npm install

# Instalar dependências do backend
cd backend && npm install && cd ..

# Instalar dependências do frontend (se existir)
cd frontend && npm install && cd ..
```

### Passo 5: Execução da Aplicação

```bash
# Voltar para o diretório raiz
cd ai-interview-platform

# Iniciar todos os serviços
npm run dev
```

## ⚙️ Configuração

### Configurações do Banco de Dados

O sistema usa PostgreSQL com as seguintes configurações padrão:

```yaml
# docker-compose.yml
postgres:
  image: postgres:15-alpine
  environment:
    POSTGRES_DB: ai_interview_platform
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres123
  ports:
    - "5432:5432"
```

### Configurações da API de IA

```env
# Modelo de IA usado
AI_MODEL="deepseek/deepseek-chat-v3-0324:free"

# URL da API
AI_API_URL="https://openrouter.ai/api/v1/chat/completions"

# Chave da API
OPENROUTER_API_KEY="sua_chave_aqui"
```

### Configurações de Rate Limiting

```javascript
// backend/src/middleware/rateLimiter.js
const rateLimits = {
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // 100 requisições por 15 minutos
  },
  ai: {
    windowMs: 15 * 60 * 1000,
    max: 20 // 20 requisições por 15 minutos
  },
  evaluation: {
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 10 // 10 requisições por hora
  }
};
```

### Configurações de Logs

```env
# Níveis de log disponíveis
LOG_LEVEL="error"    # Apenas erros
LOG_LEVEL="warn"     # Avisos e erros
LOG_LEVEL="info"     # Informações, avisos e erros
LOG_LEVEL="debug"    # Tudo (desenvolvimento)
```

## ✅ Verificação da Instalação

### Teste 1: Verificar Containers

```bash
# Verificar se todos os containers estão rodando
docker ps

# Deve mostrar:
# - ai-interview-postgres
# - ai-interview-backend
# - ai-interview-frontend
```

### Teste 2: Verificar API

```bash
# Testar endpoint de health
curl http://localhost:3000/health

# Resposta esperada:
{
  "status": "ok",
  "timestamp": "2025-01-06T10:30:00.000Z",
  "uptime": 3600,
  "database": {
    "status": "healthy"
  }
}
```

### Teste 3: Verificar Frontend

1. **Acesse:** http://localhost:8080
2. **Verifique se carrega** a página inicial
3. **Teste os links** para candidato e RH

### Teste 4: Teste Completo

1. **Inicie uma entrevista** como candidato
2. **Envie algumas mensagens**
3. **Finalize a entrevista**
4. **Verifique no dashboard** se aparece

## 🚀 Configuração de Produção

### Passo 1: Configurações de Produção

Crie um arquivo `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      OPENROUTER_API_KEY: ${OPENROUTER_API_KEY}
    depends_on:
      - postgres
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

### Passo 2: Variáveis de Ambiente de Produção

Crie um arquivo `.env.prod`:

```env
# Banco de Dados
DB_NAME=ai_interview_platform
DB_USER=postgres
DB_PASSWORD=senha_super_segura_aqui

# API de IA
OPENROUTER_API_KEY=sua_chave_de_producao

# Segurança
NODE_ENV=production
CORS_ORIGIN=https://seu-dominio.com
```

### Passo 3: Deploy

```bash
# Build das imagens de produção
docker-compose -f docker-compose.prod.yml build

# Executar em produção
docker-compose -f docker-compose.prod.yml up -d
```

### Passo 4: Configurações Adicionais

1. **Configure um proxy reverso** (Nginx)
2. **Configure SSL/TLS** (Let's Encrypt)
3. **Configure backup** do banco de dados
4. **Configure monitoramento** (logs, métricas)

## 🐛 Troubleshooting

### Problema: Containers não iniciam

**Sintomas:**
```bash
docker ps
# Lista vazia ou containers com status "Exited"
```

**Soluções:**
1. **Verifique os logs:**
```bash
docker-compose logs
```

2. **Verifique se as portas estão livres:**
```bash
# Windows
netstat -an | findstr :3000
netstat -an | findstr :8080

# Linux/macOS
lsof -i :3000
lsof -i :8080
```

3. **Reinicie o Docker:**
```bash
# Windows/macOS: Reinicie o Docker Desktop
# Linux:
sudo systemctl restart docker
```

### Problema: Erro de conexão com banco

**Sintomas:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Soluções:**
1. **Verifique se o PostgreSQL está rodando:**
```bash
docker logs ai-interview-postgres
```

2. **Verifique a string de conexão:**
```bash
# No arquivo .env
DATABASE_URL="postgresql://postgres:postgres123@postgres:5432/ai_interview_platform"
```

3. **Reinicie o banco:**
```bash
docker-compose restart postgres
```

### Problema: Erro de API de IA

**Sintomas:**
```
Error: API key invalid
Error: Insufficient credits
```

**Soluções:**
1. **Verifique a chave da API:**
```bash
# No arquivo .env
OPENROUTER_API_KEY="sua_chave_correta"
```

2. **Verifique os créditos:**
   - Acesse: https://openrouter.ai/keys
   - Verifique o saldo disponível

3. **Teste a chave:**
```bash
curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer sua_chave" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-chat-v3-0324:free", "messages": [{"role": "user", "content": "Hello"}]}'
```

### Problema: Frontend não carrega

**Sintomas:**
- Página em branco
- Erro 502/503
- Recursos não carregam

**Soluções:**
1. **Verifique se o container frontend está rodando:**
```bash
docker logs ai-interview-frontend
```

2. **Verifique se o backend está acessível:**
```bash
curl http://localhost:3000/health
```

3. **Limpe o cache do navegador:**
   - Ctrl+F5 (Windows/Linux)
   - Cmd+Shift+R (macOS)

### Problema: Performance lenta

**Sintomas:**
- Respostas lentas da API
- Interface travando
- Timeouts

**Soluções:**
1. **Verifique recursos do sistema:**
```bash
# CPU e memória
docker stats
```

2. **Ajuste configurações de rate limiting**
3. **Otimize consultas do banco**
4. **Considere upgrade de hardware**

## 📞 Suporte

### Logs Úteis

```bash
# Logs gerais
docker-compose logs

# Logs específicos
docker logs ai-interview-backend
docker logs ai-interview-frontend
docker logs ai-interview-postgres

# Logs em tempo real
docker-compose logs -f
```

### Informações do Sistema

```bash
# Versão do Docker
docker --version
docker-compose --version

# Informações dos containers
docker ps -a
docker images

# Uso de recursos
docker system df
```

### Contato

- **GitHub Issues:** Para bugs e melhorias
- **Documentação:** Consulte os outros arquivos em `/docs`
- **Logs:** Sempre inclua logs relevantes ao reportar problemas

---

**Versão do Guia:** 2.0.0  
**Última Atualização:** Janeiro 2025

> 💡 **Dica:** Mantenha sempre uma cópia de backup das suas configurações e dados importantes antes de fazer alterações significativas.
