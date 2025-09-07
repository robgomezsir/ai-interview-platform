const { PrismaClient } = require('@prisma/client');

async function detailedDatabaseCheck() {
    const prisma = new PrismaClient();
    
    try {
        console.log('🔍 Verificação Detalhada do Banco de Dados\n');
        
        // Verificar candidatos
        const candidates = await prisma.candidate.findMany({
            include: {
                interviews: {
                    include: {
                        evaluation: true
                    }
                }
            }
        });
        
        console.log('👥 CANDIDATOS:');
        console.log('================');
        candidates.forEach((candidate, index) => {
            console.log(`${index + 1}. ${candidate.name} (${candidate.email})`);
            console.log(`   ID: ${candidate.id}`);
            console.log(`   Criado em: ${candidate.createdAt.toLocaleString('pt-BR')}`);
            console.log(`   Entrevistas: ${candidate.interviews.length}`);
            
            candidate.interviews.forEach((interview, i) => {
                console.log(`   \n   📋 Entrevista ${i + 1}:`);
                console.log(`      ID: ${interview.id}`);
                console.log(`      Vaga: ${interview.jobProfile}`);
                console.log(`      Status: ${interview.status}`);
                console.log(`      Iniciada em: ${interview.startedAt.toLocaleString('pt-BR')}`);
                console.log(`      Concluída em: ${interview.completedAt ? interview.completedAt.toLocaleString('pt-BR') : 'Em andamento'}`);
                
                // Mostrar histórico do chat se existir
                if (interview.chatHistory && interview.chatHistory.length > 0) {
                    console.log(`      \n      💬 Histórico do Chat (${interview.chatHistory.length} mensagens):`);
                    interview.chatHistory.forEach((msg, msgIndex) => {
                        const role = msg.role === 'user' ? '👤 Usuário' : '🤖 IA';
                        const content = msg.content.length > 100 ? msg.content.substring(0, 100) + '...' : msg.content;
                        console.log(`         ${msgIndex + 1}. ${role}: ${content}`);
                    });
                }
                
                // Mostrar avaliação se existir
                if (interview.evaluation) {
                    console.log(`      \n      📊 Avaliação:`);
                    console.log(`         Pontuação Geral: ${interview.evaluation.overallScore}/100`);
                    console.log(`         Criada em: ${interview.evaluation.createdAt.toLocaleString('pt-BR')}`);
                }
            });
            console.log('');
        });
        
        // Estatísticas gerais
        const stats = await prisma.interview.groupBy({
            by: ['status'],
            _count: {
                id: true
            }
        });
        
        console.log('📊 ESTATÍSTICAS:');
        console.log('================');
        stats.forEach(stat => {
            const status = stat.status === 'IN_PROGRESS' ? 'Em Andamento' : 
                          stat.status === 'COMPLETED' ? 'Concluída' : 
                          stat.status === 'EVALUATED' ? 'Avaliada' : stat.status;
            console.log(`${status}: ${stat._count.id} entrevista(s)`);
        });
        
        // Verificar onde os dados são salvos
        console.log('\n💾 ONDE OS DADOS SÃO SALVOS:');
        console.log('============================');
        console.log('📁 Arquivo do Banco: backend/prisma/dev.db');
        console.log('🗂️  Tabelas:');
        console.log('   - candidates: Dados dos candidatos');
        console.log('   - interviews: Entrevistas e histórico de chat');
        console.log('   - evaluations: Avaliações das entrevistas');
        console.log('\n🔄 FLUXO DE SALVAMENTO:');
        console.log('1. Candidato preenche formulário → Salvo em "candidates"');
        console.log('2. Entrevista inicia → Criada em "interviews" com status IN_PROGRESS');
        console.log('3. Cada mensagem do chat → Atualiza "chatHistory" em "interviews"');
        console.log('4. Entrevista finalizada → Status muda para EVALUATED');
        console.log('5. Avaliação gerada → Salva em "evaluations"');
        
    } catch (error) {
        console.error('❌ Erro ao verificar banco:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

detailedDatabaseCheck();
