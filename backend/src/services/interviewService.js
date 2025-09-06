const database = require('../config/database');
const aiService = require('./aiService');
const logger = require('../config/logger');

class InterviewService {
  /**
   * Start a new interview
   */
  async startInterview(candidateData) {
    const { name, email, jobProfile } = candidateData;
    
    try {
      logger.info(`Starting interview for candidate: ${email}`);

      // Find or create candidate
      let candidate = await database.getClient().candidate.findUnique({
        where: { email }
      });

      if (!candidate) {
        candidate = await database.getClient().candidate.create({
          data: { name, email }
        });
        logger.info(`Created new candidate: ${candidate.id}`);
      } else {
        logger.info(`Found existing candidate: ${candidate.id}`);
      }

      // Generate initial AI message
      const initialMessage = await aiService.getInitialMessage();
      const initialChatHistory = [{ role: 'assistant', content: initialMessage }];

      // Create interview
      const interview = await database.getClient().interview.create({
        data: {
          candidateId: candidate.id,
          jobProfile,
          status: 'IN_PROGRESS',
          chatHistory: initialChatHistory
        }
      });

      logger.info(`Created interview: ${interview.id}`);

      return {
        interviewId: interview.id,
        initialMessage,
        candidate: {
          id: candidate.id,
          name: candidate.name,
          email: candidate.email
        }
      };
    } catch (error) {
      logger.error('Failed to start interview:', error);
      throw new Error('Falha ao iniciar entrevista');
    }
  }

  /**
   * Process user message and get AI response
   */
  async processMessage(interviewId, message) {
    try {
      logger.info(`Processing message for interview: ${interviewId}`);

      // Get interview
      const interview = await database.getClient().interview.findUnique({
        where: { id: interviewId }
      });

      if (!interview) {
        throw new Error('Entrevista não encontrada');
      }

      if (interview.status !== 'IN_PROGRESS') {
        throw new Error('Esta entrevista já foi finalizada');
      }

      // Add user message to chat history
      const currentChatHistory = interview.chatHistory || [];
      currentChatHistory.push({ role: 'user', content: message });

      // Get AI response
      const aiResponse = await aiService.getResponse(currentChatHistory);
      currentChatHistory.push({ role: 'assistant', content: aiResponse });

      // Update interview with new chat history
      await database.getClient().interview.update({
        where: { id: interviewId },
        data: { chatHistory: currentChatHistory }
      });

      logger.info(`Message processed successfully for interview: ${interviewId}`);

      return { reply: aiResponse };
    } catch (error) {
      logger.error(`Failed to process message for interview ${interviewId}:`, error);
      throw error;
    }
  }

  /**
   * Get interview details
   */
  async getInterview(interviewId) {
    try {
      logger.info(`Getting interview details: ${interviewId}`);

      const interview = await database.getClient().interview.findUnique({
        where: { id: interviewId },
        include: { 
          candidate: true, 
          evaluation: true 
        }
      });

      if (!interview) {
        throw new Error('Entrevista não encontrada');
      }

      return interview;
    } catch (error) {
      logger.error(`Failed to get interview ${interviewId}:`, error);
      throw error;
    }
  }

  /**
   * Complete interview and generate evaluation
   */
  async completeInterview(interviewId) {
    try {
      logger.info(`Completing interview: ${interviewId}`);

      // Get interview
      const interview = await database.getClient().interview.findUnique({
        where: { id: interviewId }
      });

      if (!interview) {
        throw new Error('Entrevista não encontrada');
      }

      if (interview.status === 'EVALUATED') {
        throw new Error('Esta entrevista já foi avaliada');
      }

      if (!interview.chatHistory || interview.chatHistory.length < 2) {
        throw new Error('Entrevista muito curta para avaliação');
      }

      // Generate evaluation
      const evaluationData = await aiService.evaluateInterview(interview.chatHistory);
      
      // Calculate overall score
      const scores = Object.values(evaluationData.scores).map(s => s.score);
      const overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;

      // Create evaluation and update interview in transaction
      const [evaluation, updatedInterview] = await database.getClient().$transaction([
        database.getClient().evaluation.create({
          data: {
            interviewId: interviewId,
            evaluationData: evaluationData,
            overallScore: parseFloat(overallScore.toFixed(2))
          }
        }),
        database.getClient().interview.update({
          where: { id: interviewId },
          data: { 
            status: 'EVALUATED',
            completedAt: new Date()
          }
        })
      ]);

      logger.info(`Interview completed and evaluated: ${interviewId}`);

      return {
        evaluation,
        overallScore: evaluation.overallScore
      };
    } catch (error) {
      logger.error(`Failed to complete interview ${interviewId}:`, error);
      throw error;
    }
  }

  /**
   * Get dashboard data for RH
   */
  async getDashboardData() {
    try {
      logger.info('Getting dashboard data');

      const interviews = await database.getClient().interview.findMany({
        where: {
          status: 'EVALUATED'
        },
        include: {
          candidate: {
            select: {
              name: true,
              email: true,
            }
          },
          evaluation: {
            select: {
              overallScore: true,
              createdAt: true,
              evaluationData: true
            }
          }
        },
        orderBy: {
          completedAt: 'desc'
        }
      });

      logger.info(`Found ${interviews.length} evaluated interviews`);

      return interviews;
    } catch (error) {
      logger.error('Failed to get dashboard data:', error);
      throw new Error('Falha ao carregar dados do dashboard');
    }
  }

  /**
   * Get interview statistics
   */
  async getStatistics() {
    try {
      logger.info('Getting interview statistics');

      const [
        totalInterviews,
        completedInterviews,
        averageScore,
        scoreDistribution
      ] = await Promise.all([
        database.getClient().interview.count(),
        database.getClient().interview.count({
          where: { status: 'EVALUATED' }
        }),
        database.getClient().evaluation.aggregate({
          _avg: { overallScore: true }
        }),
        database.getClient().evaluation.groupBy({
          by: ['overallScore'],
          _count: { overallScore: true },
          orderBy: { overallScore: 'asc' }
        })
      ]);

      return {
        totalInterviews,
        completedInterviews,
        averageScore: averageScore._avg.overallScore || 0,
        scoreDistribution
      };
    } catch (error) {
      logger.error('Failed to get statistics:', error);
      throw new Error('Falha ao carregar estatísticas');
    }
  }
}

module.exports = new InterviewService();
