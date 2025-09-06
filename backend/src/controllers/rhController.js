const interviewService = require('../services/interviewService');
const logger = require('../config/logger');

class RHController {
  /**
   * Get dashboard data for RH
   */
  async getDashboardData(req, res) {
    try {
      logger.info('Getting dashboard data for RH');

      const interviews = await interviewService.getDashboardData();

      res.status(200).json({
        success: true,
        data: interviews,
        count: interviews.length
      });
    } catch (error) {
      logger.error('Error in getDashboardData controller:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * Get detailed interview information
   */
  async getInterviewDetails(req, res) {
    try {
      const { id } = req.params;

      logger.info(`Getting detailed interview information: ${id}`);

      const interview = await interviewService.getInterview(id);

      // Check if interview is evaluated
      if (interview.status !== 'EVALUATED') {
        return res.status(400).json({
          success: false,
          error: 'Esta entrevista ainda não foi avaliada'
        });
      }

      res.status(200).json({
        success: true,
        data: interview
      });
    } catch (error) {
      logger.error(`Error in getInterviewDetails controller for interview ${req.params.id}:`, error);
      
      const statusCode = error.message.includes('não encontrada') ? 404 : 500;
      
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * Get candidate information
   */
  async getCandidate(req, res) {
    try {
      const { id } = req.params;

      logger.info(`Getting candidate information: ${id}`);

      const candidate = await database.getClient().candidate.findUnique({
        where: { id },
        include: {
          interviews: {
            include: {
              evaluation: true
            },
            orderBy: {
              startedAt: 'desc'
            }
          }
        }
      });

      if (!candidate) {
        return res.status(404).json({
          success: false,
          error: 'Candidato não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: candidate
      });
    } catch (error) {
      logger.error(`Error in getCandidate controller for candidate ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * Get evaluation report
   */
  async getEvaluationReport(req, res) {
    try {
      const { id } = req.params;

      logger.info(`Getting evaluation report for interview: ${id}`);

      const interview = await interviewService.getInterview(id);

      if (!interview.evaluation) {
        return res.status(400).json({
          success: false,
          error: 'Esta entrevista ainda não foi avaliada'
        });
      }

      const report = {
        interviewId: interview.id,
        candidate: {
          name: interview.candidate.name,
          email: interview.candidate.email
        },
        jobProfile: interview.jobProfile,
        completedAt: interview.completedAt,
        evaluation: interview.evaluation
      };

      res.status(200).json({
        success: true,
        data: report
      });
    } catch (error) {
      logger.error(`Error in getEvaluationReport controller for interview ${req.params.id}:`, error);
      
      const statusCode = error.message.includes('não encontrada') ? 404 : 500;
      
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Erro interno do servidor'
      });
    }
  }
}

module.exports = new RHController();
