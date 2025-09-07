const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Dados do template
const templateData = [
    {
        name: "Pergunta sobre experiência",
        category: "INTERVIEW",
        promptType: "FOLLOW_UP",
        content: "Conte-me sobre sua experiência anterior em atendimento ao cliente.",
        language: "pt-BR",
        behavior: "PROFESSIONAL",
        tone: "NEUTRAL",
        context: "Usado na fase inicial da entrevista para avaliar experiência prévia",
        expectedResponse: "Candidato deve mencionar experiências relevantes, conquistas e aprendizados",
        evaluationCriteria: "Clareza na comunicação, exemplos específicos, relevância da experiência",
        difficulty: "MEDIUM",
        timeLimit: 120,
        keywords: "experiência, atendimento, cliente, trabalho anterior",
        priority: 1,
        isActive: true
    },
    {
        name: "Avaliação de soft skills",
        category: "INTERVIEW",
        promptType: "EVALUATION",
        content: "Avalie as habilidades de comunicação e resolução de problemas do candidato.",
        language: "pt-BR",
        behavior: "PROFESSIONAL",
        tone: "ENCOURAGING",
        context: "Aplicado durante a análise final do candidato",
        expectedResponse: "Avaliação detalhada das competências comportamentais observadas",
        evaluationCriteria: "Comunicação clara, pensamento crítico, criatividade, trabalho em equipe",
        difficulty: "HARD",
        timeLimit: 180,
        keywords: "soft skills, comunicação, resolução de problemas, avaliação",
        priority: 2,
        isActive: true
    },
    {
        name: "Atendimento reativo",
        category: "CUSTOMER_SERVICE",
        promptType: "INITIAL_MESSAGE",
        content: "Como você lidaria com um cliente insatisfeito com nosso produto?",
        language: "pt-BR",
        behavior: "FRIENDLY",
        tone: "POSITIVE",
        context: "Cenário de simulação para testar habilidades de atendimento",
        expectedResponse: "Demonstrar empatia, escuta ativa, busca por solução e follow-up",
        evaluationCriteria: "Empatia, proatividade, conhecimento do produto, técnicas de resolução",
        difficulty: "MEDIUM",
        timeLimit: 150,
        keywords: "atendimento, cliente insatisfeito, resolução, empresa",
        priority: 1,
        isActive: true
    },
    {
        name: "Venda consultiva",
        category: "SALES",
        promptType: "FOLLOW_UP",
        content: "Demonstre como você faria uma venda consultiva para um produto complexo.",
        language: "pt-BR",
        behavior: "PROFESSIONAL",
        tone: "CHALLENGING",
        context: "Teste prático de habilidades de vendas consultivas",
        expectedResponse: "Processo estruturado: descoberta, apresentação, objeções, fechamento",
        evaluationCriteria: "Estrutura do processo, perguntas qualificadoras, handling de objeções",
        difficulty: "EXPERT",
        timeLimit: 300,
        keywords: "venda consultiva, processo de vendas, qualificação, fechamento",
        priority: 3,
        isActive: true
    }
];

// Criar workbook
const wb = XLSX.utils.book_new();

// Adicionar planilha com os dados
const ws = XLSX.utils.json_to_sheet(templateData);

// Adicionar cabeçalhos com formatação
const headerRow = [
    'Nome do Prompt',
    'Categoria',
    'Tipo de Prompt',
    'Conteúdo',
    'Idioma',
    'Comportamento',
    'Tom',
    'Contexto',
    'Resposta Esperada',
    'Critérios de Avaliação',
    'Dificuldade',
    'Limite de Tempo (s)',
    'Palavras-chave',
    'Prioridade',
    'Ativo'
];

// Adicionar linha de cabeçalho
XLSX.utils.sheet_add_aoa(ws, [headerRow], { origin: 'A1' });

// Ajustar largura das colunas
const colWidths = [
    { wch: 25 }, // Nome
    { wch: 15 }, // Categoria
    { wch: 15 }, // Tipo
    { wch: 40 }, // Conteúdo
    { wch: 10 }, // Idioma
    { wch: 15 }, // Comportamento
    { wch: 15 }, // Tom
    { wch: 30 }, // Contexto
    { wch: 30 }, // Resposta Esperada
    { wch: 30 }, // Critérios
    { wch: 12 }, // Dificuldade
    { wch: 15 }, // Tempo
    { wch: 25 }, // Palavras-chave
    { wch: 10 }, // Prioridade
    { wch: 8 }   // Ativo
];

ws['!cols'] = colWidths;

// Adicionar planilha ao workbook
XLSX.utils.book_append_sheet(wb, ws, 'Prompts Template');

// Criar diretório se não existir
const templatesDir = path.join(__dirname, '../public/templates');
if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
}

// Salvar arquivo Excel
const excelPath = path.join(templatesDir, 'prompts-template.xlsx');
XLSX.writeFile(wb, excelPath);

console.log('Template Excel criado com sucesso:', excelPath);

// Criar também um arquivo de instruções
const instructions = `
# Template de Prompts de Treinamento IA

## Como usar este template:

1. **Baixe o arquivo:** prompts-template.xlsx
2. **Preencha os campos** com seus prompts personalizados
3. **Mantenha o formato** das colunas conforme o template
4. **Valores válidos para cada campo:**

### Categoria:
- INTERVIEW (Entrevista)
- CUSTOMER_SERVICE (Atendimento ao Cliente)
- SALES (Vendas)
- TECHNICAL (Técnico)

### Tipo de Prompt:
- INITIAL_MESSAGE (Mensagem Inicial)
- FOLLOW_UP (Pergunta de Acompanhamento)
- EVALUATION (Avaliação)
- CUSTOM (Personalizado)

### Idioma:
- pt-BR (Português Brasil)
- en-US (English US)
- es-ES (Español)

### Comportamento:
- PROFESSIONAL (Profissional)
- FRIENDLY (Amigável)
- FORMAL (Formal)
- CASUAL (Casual)

### Tom:
- NEUTRAL (Neutro)
- POSITIVE (Positivo)
- ENCOURAGING (Encorajador)
- CHALLENGING (Desafiador)

### Dificuldade:
- EASY (Fácil)
- MEDIUM (Médio)
- HARD (Difícil)
- EXPERT (Especialista)

### Prioridade:
- 0 (Baixa)
- 1 (Normal)
- 2 (Alta)
- 3 (Crítica)

### Ativo:
- true (Ativo)
- false (Inativo)

## Dicas:
- Use vírgulas para separar palavras-chave
- O limite de tempo é em segundos (30-600)
- Campos de texto podem conter quebras de linha
- Salve o arquivo como .xlsx ou .csv
`;

fs.writeFileSync(path.join(templatesDir, 'INSTRUCOES.md'), instructions);
console.log('Arquivo de instruções criado:', path.join(templatesDir, 'INSTRUCOES.md'));
