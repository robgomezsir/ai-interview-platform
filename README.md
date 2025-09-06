# Plataforma de Entrevista com IA

Sistema de entrevistas simuladas por Inteligência Artificial para avaliação de candidatos a vagas de atendimento ao cliente.

## 🏗️ Arquitetura

### Backend (Node.js + Express + Prisma)
- **API RESTful** com endpoints bem definidos
- **Banco de dados PostgreSQL** com Prisma ORM
- **Integração com IA** via OpenRouter (Gemini)
- **Validação de dados** com Joi
- **Logging estruturado** com Winston
- **Tratamento de erros** centralizado

### Frontend (Vanilla JS + Tailwind CSS)
- **Interface responsiva** para candidatos e RH
- **Componentes modulares** e reutilizáveis
- **Gerenciamento de estado** simplificado
- **Charts interativos** para visualização de dados

## 📁 Estrutura do Projeto

```
ai-interview-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── services/        # Lógica de negócio
│   │   ├── middleware/      # Middlewares customizados
│   │   ├── models/          # Modelos de dados
│   │   ├── routes/          # Definição de rotas
│   │   ├── utils/           # Utilitários
│   │   ├── validators/      # Validações
│   │   └── config/          # Configurações
│   ├── prisma/              # Schema e migrações
│   ├── tests/               # Testes
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Serviços de API
│   │   ├── utils/           # Utilitários
│   │   └── assets/          # CSS, imagens, etc.
│   └── public/              # Arquivos estáticos
├── docker/                  # Configurações Docker
├── docs/                    # Documentação
└── docker-compose.yml       # Orquestração de serviços
```

## 🚀 Como Executar

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar com Docker
docker-compose up --build
```

### Produção
```bash
# Build e deploy
docker-compose -f docker-compose.prod.yml up --build
```

## 🔧 Configuração

### Variáveis de Ambiente
```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/ai_interview"

# API de IA
OPENROUTER_API_KEY="your-api-key"

# Servidor
PORT=3000
NODE_ENV=development
```

## 📊 Funcionalidades

### Para Candidatos
- Interface de chat intuitiva
- Entrevista simulada com IA
- Feedback em tempo real

### Para RH
- Dashboard com lista de candidatos
- Relatórios detalhados de avaliação
- Gráficos de competências
- Transcrições completas

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes com coverage
npm run test:coverage

# Testes de integração
npm run test:integration
```

## 📚 Documentação

### 📖 Documentação Completa
- **[Documentação Completa](docs/DOCUMENTACAO_COMPLETA.md)** - Visão geral completa do sistema
- **[Tutorial de Uso](docs/TUTORIAL_USO.md)** - Guia passo a passo para usuários
- **[Guia de Instalação](docs/GUIA_INSTALACAO.md)** - Instalação e configuração detalhada
- **[Documentação da API](docs/api.md)** - Referência completa da API

### 🎯 Início Rápido

1. **Instalação:**
   ```bash
   git clone https://github.com/seu-usuario/ai-interview-platform.git
   cd ai-interview-platform
   npm run setup
   npm run dev
   ```

2. **Configuração:**
   - Configure sua chave da API OpenRouter no arquivo `backend/.env`
   - Acesse http://localhost:8080

3. **Uso:**
   - **Candidatos:** Clique em "Candidato" para iniciar uma entrevista
   - **RH:** Clique em "Analista de RH" para ver o dashboard

### 🚀 Funcionalidades Principais

- **Entrevistas Simuladas** com IA para candidatos
- **Dashboard Interativo** para analistas de RH
- **Avaliação Automática** de 5 competências
- **Relatórios Detalhados** com gráficos
- **API RESTful** completa
- **Interface Responsiva** e moderna

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### 📋 Padrões de Contribuição

- Siga as convenções de código existentes
- Escreva testes para novas funcionalidades
- Atualize a documentação quando necessário
- Use commits descritivos

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Documentação:** Consulte os arquivos em `/docs`
- **Issues:** Abra uma issue no GitHub para bugs ou sugestões
- **Logs:** Verifique os logs em `backend/logs/` para debugging
