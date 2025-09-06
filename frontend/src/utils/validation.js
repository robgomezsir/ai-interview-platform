/**
 * Validation utilities
 */
export class ValidationUtils {
  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate name format
   */
  static isValidName(name) {
    return name && name.trim().length >= 2 && name.trim().length <= 100;
  }

  /**
   * Validate message format
   */
  static isValidMessage(message) {
    return message && message.trim().length >= 1 && message.trim().length <= 1000;
  }

  /**
   * Validate UUID format
   */
  static isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
  }

  /**
   * Validate interview start data
   */
  static validateInterviewStart(data) {
    const errors = [];

    if (!this.isValidName(data.name)) {
      errors.push('Nome deve ter entre 2 e 100 caracteres');
    }

    if (!this.isValidEmail(data.email)) {
      errors.push('Email deve ter um formato válido');
    }

    if (!data.jobProfile || data.jobProfile.trim().length < 2) {
      errors.push('Perfil da vaga é obrigatório');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate message data
   */
  static validateMessage(data) {
    const errors = [];

    if (!this.isValidMessage(data.message)) {
      errors.push('Mensagem deve ter entre 1 e 1000 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
