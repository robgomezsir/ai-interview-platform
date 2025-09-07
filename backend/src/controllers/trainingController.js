const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TrainingController {
    // Get all training prompts
    async getPrompts(req, res) {
        try {
            const prompts = await prisma.trainingPrompt.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            
            res.json(prompts);
        } catch (error) {
            console.error('Error fetching prompts:', error);
            res.status(500).json({ error: 'Erro ao buscar prompts' });
        }
    }

    // Create a new training prompt
    async createPrompt(req, res) {
        try {
            const {
                name,
                category,
                promptType,
                content,
                language = 'pt-BR',
                behavior = 'PROFESSIONAL',
                tone = 'NEUTRAL',
                context,
                expectedResponse,
                evaluationCriteria,
                difficulty = 'MEDIUM',
                timeLimit,
                keywords,
                priority = 1,
                isActive = true
            } = req.body;

            // Validate required fields
            if (!name || !category || !promptType || !content) {
                return res.status(400).json({ 
                    error: 'Campos obrigatórios: name, category, promptType, content' 
                });
            }

            const prompt = await prisma.trainingPrompt.create({
                data: {
                    name,
                    category,
                    promptType,
                    content,
                    language,
                    behavior,
                    tone,
                    context,
                    expectedResponse,
                    evaluationCriteria,
                    difficulty,
                    timeLimit: timeLimit ? parseInt(timeLimit) : null,
                    keywords: keywords ? JSON.stringify(keywords) : null,
                    priority: parseInt(priority),
                    isActive
                }
            });

            res.status(201).json(prompt);
        } catch (error) {
            console.error('Error creating prompt:', error);
            res.status(500).json({ error: 'Erro ao criar prompt' });
        }
    }

    // Update a training prompt
    async updatePrompt(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Process keywords if provided
            if (updateData.keywords) {
                updateData.keywords = JSON.stringify(updateData.keywords);
            }

            const prompt = await prisma.trainingPrompt.update({
                where: { id },
                data: updateData
            });

            res.json(prompt);
        } catch (error) {
            console.error('Error updating prompt:', error);
            res.status(500).json({ error: 'Erro ao atualizar prompt' });
        }
    }

    // Delete a training prompt
    async deletePrompt(req, res) {
        try {
            const { id } = req.params;

            await prisma.trainingPrompt.delete({
                where: { id }
            });

            res.json({ message: 'Prompt deletado com sucesso' });
        } catch (error) {
            console.error('Error deleting prompt:', error);
            res.status(500).json({ error: 'Erro ao deletar prompt' });
        }
    }

    // Get training statistics
    async getTrainingStats(req, res) {
        try {
            const [
                activePrompts,
                trainingSessions,
                categories
            ] = await Promise.all([
                prisma.trainingPrompt.count({
                    where: { isActive: true }
                }),
                prisma.aITrainingSession.count(),
                prisma.trainingPrompt.groupBy({
                    by: ['category'],
                    _count: {
                        category: true
                    }
                })
            ]);

            res.json({
                activePrompts,
                trainingSessions,
                categories: categories.length,
                lastUpdate: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error fetching training stats:', error);
            res.status(500).json({ error: 'Erro ao buscar estatísticas de treinamento' });
        }
    }

    // Create a training session
    async createTrainingSession(req, res) {
        try {
            const {
                sessionName,
                description,
                categories = [],
                prompts = []
            } = req.body;

            if (!sessionName) {
                return res.status(400).json({ 
                    error: 'Nome da sessão é obrigatório' 
                });
            }

            const session = await prisma.aITrainingSession.create({
                data: {
                    sessionName,
                    description,
                    prompts: JSON.stringify(prompts),
                    status: 'PENDING',
                    startedAt: new Date()
                }
            });

            res.status(201).json(session);
        } catch (error) {
            console.error('Error creating training session:', error);
            res.status(500).json({ error: 'Erro ao criar sessão de treinamento' });
        }
    }

    // Get all training sessions
    async getTrainingSessions(req, res) {
        try {
            const sessions = await prisma.aITrainingSession.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });

            res.json(sessions);
        } catch (error) {
            console.error('Error fetching training sessions:', error);
            res.status(500).json({ error: 'Erro ao buscar sessões de treinamento' });
        }
    }
}

module.exports = new TrainingController();
