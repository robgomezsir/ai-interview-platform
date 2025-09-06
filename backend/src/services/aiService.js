const config = require('../config');
const logger = require('../config/logger');

class AIService {
  constructor() {
    this.apiUrl = config.ai.apiUrl;
    this.apiKey = config.ai.apiKey;
    this.model = config.ai.model;
    this.timeout = config.ai.timeout;
    this.maxRetries = config.ai.maxRetries;
  }

  /**
   * Make API request to AI service
   */
  async makeRequest(messages, retryCount = 0) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        logger.error(`AI API Error: ${response.status} - ${errorBody}`);
        throw new Error(`AI API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from AI service');
      }

      return data.choices[0].message.content;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('AI service request timeout');
      }

      // Retry logic
      if (retryCount < this.maxRetries) {
        logger.warn(`AI request failed, retrying... (${retryCount + 1}/${this.maxRetries})`);
        await this.delay(1000 * (retryCount + 1)); // Exponential backoff
        return this.makeRequest(messages, retryCount + 1);
      }

      logger.error(`AI service error after ${this.maxRetries} retries:`, error);
      throw error;
    }
  }

  /**
   * Get initial AI message for interview
   */
  async getInitialMessage() {
    const systemPrompt = this.getSystemPrompt();
    const messages = [{ role: 'system', content: systemPrompt }];
    
    try {
      logger.info('Generating initial AI message');
      const response = await this.makeRequest(messages);
      logger.info('Initial AI message generated successfully');
      return response;
    } catch (error) {
      logger.error('Failed to generate initial AI message:', error);
      throw new Error('Falha ao gerar mensagem inicial da IA');
    }
  }

  /**
   * Get AI response to user message
   */
  async getResponse(chatHistory) {
    const systemPrompt = this.getSystemPrompt();
    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory
    ];

    try {
      logger.info('Generating AI response');
      const response = await this.makeRequest(messages);
      logger.info('AI response generated successfully');
      return response;
    } catch (error) {
      logger.error('Failed to generate AI response:', error);
      throw new Error('Falha ao gerar resposta da IA');
    }
  }

  /**
   * Evaluate interview performance
   */
  async evaluateInterview(chatHistory) {
    const evaluationPrompt = this.getEvaluationPrompt();
    const transcript = this.formatTranscript(chatHistory);
    const fullPrompt = evaluationPrompt + transcript;
    
    const messages = [{ role: 'user', content: fullPrompt }];

    try {
      logger.info('Generating interview evaluation');
      const response = await this.makeRequest(messages);
      logger.info('Interview evaluation generated successfully');
      
      return this.parseEvaluationResponse(response);
    } catch (error) {
      logger.error('Failed to generate interview evaluation:', error);
      throw new Error('Falha ao gerar avaliação da entrevista');
    }
  }

  /**
   * Get system prompt for AI behavior
   */
  getSystemPrompt() {
    return `Você é um cliente de uma empresa de telecomunicações e está insatisfeito com o seu serviço de internet. Seu papel é interagir com o atendente (o candidato) para tentar resolver seu problema. 

INSTRUÇÕES IMPORTANTES:
- Seja um pouco impaciente e descreva o problema de forma realista
- Seu problema é que a "internet está muito lenta nos últimos dias"
- Inicie a conversa se apresentando como 'Cliente' e reclamando do problema
- Mantenha o tom de um cliente real frustrado, mas educado
- Faça perguntas específicas sobre o problema
- Seja persistente mas não agressivo
- Quando o atendente resolver o problema adequadamente, agradeça e encerre a conversa
- Mantenha as respostas concisas (máximo 2-3 frases)
- Use linguagem natural e coloquial brasileira`;
  }

  /**
   * Get evaluation prompt for AI assessment
   */
  getEvaluationPrompt() {
    return `Você é um gerente de RH sênior especializado em treinamento de equipes de atendimento ao cliente.
Analise a seguinte transcrição de entrevista e avalie o desempenho do candidato em uma escala de 1 (muito fraco) a 10 (excelente) para cada um dos seguintes critérios: Empatia, Resolução de Problemas, Clareza na Comunicação, Tom de Voz e Eficiência.

Para cada critério, forneça:
1. A nota (um número de 1 a 10).
2. Uma justificativa detalhada para a nota, citando trechos específicos da conversa.
3. Um resumo final destacando o principal ponto forte e a principal área a ser desenvolvida pelo candidato.

Retorne sua análise estritamente em um formato JSON. O JSON deve ter a seguinte estrutura:
{
  "scores": {
    "empathy": { "score": <nota>, "justification": "<justificativa>" },
    "problemSolving": { "score": <nota>, "justification": "<justificativa>" },
    "communication": { "score": <nota>, "justification": "<justificativa>" },
    "toneOfVoice": { "score": <nota>, "justification": "<justificativa>" },
    "efficiency": { "score": <nota>, "justification": "<justificativa>" }
  },
  "summary": {
    "strength": "<ponto forte>",
    "developmentArea": "<área a desenvolver>"
  }
}

---
TRANSCRIÇÃO:
`;
  }

  /**
   * Format chat history as transcript
   */
  formatTranscript(chatHistory) {
    return chatHistory
      .map(msg => `${msg.role === 'user' ? 'Candidato' : 'Cliente'}: ${msg.content}`)
      .join('\n');
  }

  /**
   * Parse evaluation response from AI
   */
  parseEvaluationResponse(response) {
    try {
      // Clean the response to extract JSON
      const cleanJsonString = response
        .replace(/```json\n/g, '')
        .replace(/\n```/g, '')
        .replace(/```\n/g, '')
        .replace(/```/g, '')
        .trim();

      const evaluation = JSON.parse(cleanJsonString);

      // Validate the structure
      if (!evaluation.scores || !evaluation.summary) {
        throw new Error('Invalid evaluation structure');
      }

      // Validate scores
      const requiredScores = ['empathy', 'problemSolving', 'communication', 'toneOfVoice', 'efficiency'];
      for (const score of requiredScores) {
        if (!evaluation.scores[score] || typeof evaluation.scores[score].score !== 'number') {
          throw new Error(`Invalid score for ${score}`);
        }
      }

      return evaluation;
    } catch (error) {
      logger.error('Failed to parse AI evaluation response:', error);
      logger.error('Raw response:', response);
      throw new Error('Resposta da IA em formato inválido');
    }
  }

  /**
   * Delay utility for retries
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new AIService();
