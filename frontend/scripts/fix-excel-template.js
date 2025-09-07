const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Dados do template com headers em português
const templateData = [
    {
        'Nome do Prompt': 'Pergunta sobre experiência',
        'Categoria': 'INTERVIEW',
        'Tipo de Prompt': 'FOLLOW_UP',
        'Conteúdo': 'Conte-me sobre sua experiência anterior em atendimento ao cliente.',
        'Idioma': 'pt-BR',
        'Comportamento': 'PROFESSIONAL',
        'Tom': 'NEUTRAL',
        'Contexto': 'Usado na fase inicial da entrevista para avaliar experiência prévia',
        'Resposta Esperada': 'Candidato deve mencionar experiências relevantes, conquistas e aprendizados',
        'Critérios de Avaliação': 'Clareza na comunicação, exemplos específicos, relevância da experiência',
        'Dificuldade': 'MEDIUM',
        'Limite de Tempo (s)': 120,
        'Palavras-chave': 'experiência, atendimento, cliente, trabalho anterior',
        'Prioridade': 1,
        'Ativo': true
    },
    {
        'Nome do Prompt': 'Avaliação de soft skills',
        'Categoria': 'INTERVIEW',
        'Tipo de Prompt': 'EVALUATION',
        'Conteúdo': 'Avalie as habilidades de comunicação e resolução de problemas do candidato.',
        'Idioma': 'pt-BR',
        'Comportamento': 'PROFESSIONAL',
        'Tom': 'ENCOURAGING',
        'Contexto': 'Aplicado durante a análise final do candidato',
        'Resposta Esperada': 'Avaliação detalhada das competências comportamentais observadas',
        'Critérios de Avaliação': 'Comunicação clara, pensamento crítico, criatividade, trabalho em equipe',
        'Dificuldade': 'HARD',
        'Limite de Tempo (s)': 180,
        'Palavras-chave': 'soft skills, comunicação, resolução de problemas, avaliação',
        'Prioridade': 2,
        'Ativo': true
    },
    {
        'Nome do Prompt': 'Atendimento reativo',
        'Categoria': 'CUSTOMER_SERVICE',
        'Tipo de Prompt': 'INITIAL_MESSAGE',
        'Conteúdo': 'Como você lidaria com um cliente insatisfeito com nosso produto?',
        'Idioma': 'pt-BR',
        'Comportamento': 'FRIENDLY',
        'Tom': 'POSITIVE',
        'Contexto': 'Cenário de simulação para testar habilidades de atendimento',
        'Resposta Esperada': 'Demonstrar empatia, escuta ativa, busca por solução e follow-up',
        'Critérios de Avaliação': 'Empatia, proatividade, conhecimento do produto, técnicas de resolução',
        'Dificuldade': 'MEDIUM',
        'Limite de Tempo (s)': 150,
        'Palavras-chave': 'atendimento, cliente insatisfeito, resolução, empresa',
        'Prioridade': 1,
        'Ativo': true
    },
    {
        'Nome do Prompt': 'Venda consultiva',
        'Categoria': 'SALES',
        'Tipo de Prompt': 'FOLLOW_UP',
        'Conteúdo': 'Demonstre como você faria uma venda consultiva para um produto complexo.',
        'Idioma': 'pt-BR',
        'Comportamento': 'PROFESSIONAL',
        'Tom': 'CHALLENGING',
        'Contexto': 'Teste prático de habilidades de vendas consultivas',
        'Resposta Esperada': 'Processo estruturado: descoberta, apresentação, objeções, fechamento',
        'Critérios de Avaliação': 'Estrutura do processo, perguntas qualificadoras, handling de objeções',
        'Dificuldade': 'EXPERT',
        'Limite de Tempo (s)': 300,
        'Palavras-chave': 'venda consultiva, processo de vendas, qualificação, fechamento',
        'Prioridade': 3,
        'Ativo': true
    }
];

try {
    // Criar workbook
    const wb = XLSX.utils.book_new();
    
    // Converter dados para planilha
    const ws = XLSX.utils.json_to_sheet(templateData);
    
    // Ajustar largura das colunas
    const colWidths = [
        { wch: 25 }, // Nome do Prompt
        { wch: 15 }, // Categoria
        { wch: 15 }, // Tipo de Prompt
        { wch: 40 }, // Conteúdo
        { wch: 10 }, // Idioma
        { wch: 15 }, // Comportamento
        { wch: 15 }, // Tom
        { wch: 30 }, // Contexto
        { wch: 30 }, // Resposta Esperada
        { wch: 30 }, // Critérios de Avaliação
        { wch: 12 }, // Dificuldade
        { wch: 15 }, // Limite de Tempo (s)
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
    XLSX.writeFile(wb, excelPath, { bookType: 'xlsx', type: 'buffer' });
    
    console.log('✅ Template Excel criado com sucesso:', excelPath);
    
    // Verificar se o arquivo foi criado corretamente
    if (fs.existsSync(excelPath)) {
        const stats = fs.statSync(excelPath);
        console.log('📊 Tamanho do arquivo:', stats.size, 'bytes');
        
        // Testar se o arquivo pode ser lido
        try {
            const testWb = XLSX.readFile(excelPath);
            console.log('✅ Arquivo Excel é válido e pode ser lido');
            console.log('📋 Planilhas encontradas:', testWb.SheetNames);
        } catch (error) {
            console.error('❌ Erro ao ler arquivo Excel:', error.message);
        }
    } else {
        console.error('❌ Arquivo não foi criado');
    }
    
} catch (error) {
    console.error('❌ Erro ao criar template Excel:', error);
    process.exit(1);
}
