const interviewService = require('../services/interviewService');
const logger = require('../config/logger');

class InterviewController {
  /**
   * Start a new interview
   */
  async startInterview(req, res) {
    try {
      const { name, email, jobProfile } = req.body;

      logger.info(`Starting interview for: ${email}`);

      const result = await interviewService.startInterview({
        name,
        email,
        jobProfile
      });

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Error in startInterview controller:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * Process user message
   */
  async postMessage(req, res) {
    try {
      const { id } = req.params;
      const { message } = req.body;

      logger.info(`Processing message for interview: ${id}`);

      const result = await interviewService.processMessage(id, message);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error(`Error in postMessage controller for interview ${req.params.id}:`, error);
      
      const statusCode = error.message.includes('não encontrada') ? 404 : 
                        error.message.includes('finalizada') ? 400 : 500;
      
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * Get interview details
   */
  async getInterview(req, res) {
    try {
      const { id } = req.params;

      logger.info(`Getting interview details: ${id}`);

      const interview = await interviewService.getInterview(id);

      res.status(200).json({
        success: true,
        data: interview
      });
    } catch (error) {
      logger.error(`Error in getInterview controller for interview ${req.params.id}:`, error);
      
      const statusCode = error.message.includes('não encontrada') ? 404 : 500;
      
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * Complete interview and generate evaluation
   */
  async completeInterview(req, res) {
    try {
      const { id } = req.params;

      logger.info(`Completing interview: ${id}`);

      const result = await interviewService.completeInterview(id);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Entrevista finalizada e avaliada com sucesso'
      });
    } catch (error) {
      logger.error(`Error in completeInterview controller for interview ${req.params.id}:`, error);
      
      const statusCode = error.message.includes('não encontrada') ? 404 : 
                        error.message.includes('já foi avaliada') ? 400 :
                        error.message.includes('muito curta') ? 400 : 500;
      
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * Get interview statistics
   */
  async getStatistics(req, res) {
    try {
      logger.info('Getting interview statistics');

      const statistics = await interviewService.getStatistics();

      res.status(200).json({
        success: true,
        data: statistics
      });
    } catch (error) {
      logger.error('Error in getStatistics controller:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro interno do servidor'
      });
    }
  }
}

module.exports = new InterviewController();
