# 📚 Documentação Completa - Plataforma de Entrevista com IA

## 🎯 Visão Geral

A **Plataforma de Entrevista com IA** é um sistema completo desenvolvido para simular entrevistas de atendimento ao cliente utilizando Inteligência Artificial. A plataforma permite que candidatos realizem entrevistas simuladas e que analistas de RH visualizem e analisem os resultados através de um dashboard interativo.

### 🚀 Principais Funcionalidades

- **Para Candidatos:**
  - Interface de chat intuitiva para entrevistas simuladas
  - Simulação realista de cenários de atendimento ao cliente
  - Feedback em tempo real durante a conversa
  - Avaliação automática por IA

- **Para Analistas de RH:**
  - Dashboard completo com lista de candidatos
  - Relatórios detalhados de avaliação
  - Gráficos interativos de competências
  - Transcrições completas das entrevistas
  - Análise de pontuação por competências

## 🏗️ Arquitetura do Sistema

### Stack Tecnológica

**Backend:**
- **Node.js** com Express.js
- **PostgreSQL** como banco de dados
- **Prisma ORM** para gerenciamento de dados
- **OpenRouter API** para integração com IA (Gemini)
- **Winston** para logging estruturado
- **Joi** para validação de dados

**Frontend:**
- **HTML5** com JavaScript Vanilla
- **Tailwind CSS** para estilização
- **Lucide Icons** para ícones
- **Chart.js** para gráficos interativos
- **Nginx** como servidor web

**Infraestrutura:**
- **Docker** e **Docker Compose** para containerização
- **PostgreSQL** em container separado
- **Nginx** para servir arquivos estáticos

### Estrutura de Dados

O sistema utiliza três entidades principais:

1. **Candidate** - Dados dos candidatos
2. **Interview** - Sessões de entrevista
3. **Evaluation** - Avaliações geradas pela IA

## 📁 Estrutura do Projeto

```
ai-interview-platform/
├── backend/                    # Servidor Node.js
│   ├── src/
│   │   ├── controllers/        # Controladores da API
│   │   ├── services/          # Lógica de negócio
│   │   ├── middleware/        # Middlewares customizados
│   │   ├── routes/            # Definição de rotas
│   │   └── config/            # Configurações
│   ├── prisma/                # Schema e migrações
│   ├── tests/                 # Testes automatizados
│   └── Dockerfile
├── frontend/                   # Interface do usuário
│   ├── public/                # Arquivos estáticos
│   │   ├── index.html         # Página inicial
│   │   ├── chat.html          # Interface de entrevista
│   │   └── dashboard.html     # Painel do RH
│   ├── src/                   # Código fonte
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── services/          # Serviços de API
│   │   └── utils/             # Utilitários
│   └── Dockerfile
├── docs/                      # Documentação
├── docker-compose.yml         # Orquestração de serviços
└── README.md
```

## 🔧 Configuração e Instalação

### Pré-requisitos

- **Docker** e **Docker Compose**
- **Node.js** 18+ (para desenvolvimento local)
- **Git**

### Instalação Rápida

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/ai-interview-platform.git
cd ai-interview-platform
```

2. **Configure as variáveis de ambiente:**
```bash
cp backend/env.example backend/.env
```

3. **Configure a chave da API de IA:**
```bash
# Edite o arquivo backend/.env
OPENROUTER_API_KEY=sua_chave_da_api_openrouter
```

4. **Execute a aplicação:**
```bash
# Instalar dependências
npm run setup

# Iniciar com Docker
npm run dev
```

### Acesso à Aplicação

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000
- **Banco de dados:** localhost:5432

## 🎮 Como Usar a Aplicação

### Para Candidatos

1. **Acesse a página inicial** em http://localhost:8080
2. **Clique em "Candidato"** para iniciar uma entrevista
3. **Preencha seus dados:**
   - Nome completo
   - Email válido
4. **Clique em "Começar Entrevista"**
5. **Participe da conversa** simulada com o cliente
6. **Responda às situações** apresentadas pela IA
7. **A entrevista será avaliada automaticamente** ao finalizar

### Para Analistas de RH

1. **Acesse a página inicial** em http://localhost:8080
2. **Clique em "Analista de RH"** para acessar o dashboard
3. **Visualize a lista de candidatos** avaliados
4. **Clique em um candidato** para ver detalhes completos
5. **Analise os gráficos** de competências
6. **Revise a transcrição** completa da entrevista
7. **Consulte o relatório** de avaliação detalhado

## 📊 Sistema de Avaliação

### Competências Avaliadas

O sistema avalia 5 competências principais:

1. **Empatia** (0-10)
   - Capacidade de entender e se conectar com o cliente
   - Demonstração de compreensão das necessidades

2. **Resolução de Problemas** (0-10)
   - Identificação rápida de problemas
   - Proposição de soluções eficazes

3. **Comunicação** (0-10)
   - Clareza na comunicação
   - Uso adequado da linguagem

4. **Tom de Voz** (0-10)
   - Profissionalismo
   - Cordialidade e paciência

5. **Eficiência** (0-10)
   - Rapidez na resolução
   - Uso otimizado do tempo

### Pontuação Final

- **Nota geral:** Média ponderada das 5 competências
- **Escala:** 0 a 10 pontos
- **Classificação:**
  - 8.0-10.0: Excelente
  - 6.0-7.9: Bom
  - 4.0-5.9: Regular
  - 0-3.9: Precisa melhorar

## 🔌 API Endpoints

### Entrevistas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/interviews/start` | Iniciar nova entrevista |
| POST | `/api/interviews/{id}/message` | Enviar mensagem |
| GET | `/api/interviews/{id}` | Obter detalhes da entrevista |
| POST | `/api/interviews/{id}/complete` | Finalizar entrevista |
| GET | `/api/interviews/statistics` | Estatísticas gerais |

### Dashboard RH

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/rh/dashboard` | Lista de entrevistas avaliadas |
| GET | `/api/rh/interviews/{id}` | Detalhes completos da entrevista |

### Health Check

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Status da aplicação |

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Iniciar em modo desenvolvimento
npm run start        # Iniciar em modo produção
npm run stop         # Parar containers
npm run restart      # Reiniciar containers
npm run logs         # Ver logs dos containers

# Testes
npm run test         # Executar testes
npm run test:coverage # Testes com cobertura
npm run lint         # Verificar código
npm run format       # Formatar código

# Banco de dados
npm run db:migrate   # Executar migrações
npm run db:generate  # Gerar cliente Prisma
npm run db:studio    # Abrir Prisma Studio

# Utilitários
npm run clean        # Limpar volumes Docker
npm run build        # Build das imagens
```

### Estrutura de Desenvolvimento

1. **Backend:** Desenvolvido em Node.js com arquitetura MVC
2. **Frontend:** JavaScript Vanilla com componentes modulares
3. **Banco de dados:** PostgreSQL com Prisma ORM
4. **Testes:** Jest para testes unitários e de integração
5. **Logs:** Winston para logging estruturado

## 🔒 Segurança

### Medidas Implementadas

- **Rate Limiting:** Limitação de requisições por IP
- **Validação de dados:** Validação rigorosa de entrada
- **CORS:** Configuração adequada de CORS
- **Helmet:** Headers de segurança
- **Sanitização:** Limpeza de dados de entrada

### Configurações de Rate Limit

- **Endpoints gerais:** 100 requisições por 15 minutos
- **Endpoints de IA:** 20 requisições por 15 minutos
- **Endpoints de avaliação:** 10 requisições por hora

## 📈 Monitoramento

### Logs

O sistema gera logs estruturados em:
- `backend/logs/combined.log` - Todos os logs
- `backend/logs/error.log` - Apenas erros

### Métricas Disponíveis

- Número total de entrevistas
- Entrevistas completadas
- Pontuação média geral
- Distribuição de pontuações
- Tempo médio de entrevista

## 🚀 Deploy em Produção

### Configuração de Produção

1. **Configure as variáveis de ambiente:**
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/database
OPENROUTER_API_KEY=sua_chave_producao
```

2. **Execute o deploy:**
```bash
npm run deploy
```

### Considerações de Produção

- Use um banco de dados PostgreSQL gerenciado
- Configure um proxy reverso (Nginx)
- Implemente SSL/TLS
- Configure backup automático do banco
- Monitore logs e métricas

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco:**
   - Verifique se o PostgreSQL está rodando
   - Confirme a string de conexão no .env

2. **Erro de API de IA:**
   - Verifique se a chave da API está correta
   - Confirme se há créditos disponíveis

3. **Frontend não carrega:**
   - Verifique se o container frontend está rodando
   - Confirme se a porta 8080 está disponível

### Logs de Debug

```bash
# Ver logs em tempo real
npm run logs

# Logs específicos do backend
docker logs ai-interview-backend

# Logs específicos do frontend
docker logs ai-interview-frontend
```

## 🤝 Contribuição

### Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrões de Código

- Use ESLint para JavaScript
- Siga as convenções do Prettier
- Escreva testes para novas funcionalidades
- Documente mudanças significativas

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas:
- Abra uma issue no GitHub
- Consulte a documentação da API em `/docs/api.md`
- Verifique os logs da aplicação

---

**Versão da Documentação:** 2.0.0  
**Última Atualização:** Janeiro 2025
