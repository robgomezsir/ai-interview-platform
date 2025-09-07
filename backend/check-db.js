const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
    const prisma = new PrismaClient();
    
    try {
        console.log('🔍 Verificando banco de dados...\n');
        
        // Verificar se as tabelas existem
        const candidates = await prisma.candidate.findMany();
        const interviews = await prisma.interview.findMany();
        const evaluations = await prisma.evaluation.findMany();
        
        console.log('📊 Dados encontrados:');
        console.log(`- Candidatos: ${candidates.length}`);
        console.log(`- Entrevistas: ${interviews.length}`);
        console.log(`- Avaliações: ${evaluations.length}\n`);
        
        if (candidates.length > 0) {
            console.log('👥 Candidatos:');
            candidates.forEach(candidate => {
                console.log(`  - ${candidate.name} (${candidate.email})`);
            });
        }
        
        if (interviews.length > 0) {
            console.log('\n💼 Entrevistas:');
            interviews.forEach(interview => {
                console.log(`  - ${interview.jobProfile} - Status: ${interview.status}`);
            });
        }
        
        // Criar dados de exemplo se estiver vazio
        if (candidates.length === 0) {
            console.log('\n🌱 Criando dados de exemplo...');
            
            const candidate = await prisma.candidate.create({
                data: {
                    name: 'João Silva',
                    email: 'joao@exemplo.com'
                }
            });
            
            const interview = await prisma.interview.create({
                data: {
                    candidateId: candidate.id,
                    jobProfile: 'Atendente de Suporte ao Cliente',
                    status: 'IN_PROGRESS'
                }
            });
            
            console.log('✅ Dados de exemplo criados!');
            console.log(`- Candidato: ${candidate.name}`);
            console.log(`- Entrevista: ${interview.jobProfile}`);
        }
        
    } catch (error) {
        console.error('❌ Erro ao acessar banco:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase();
