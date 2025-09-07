const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');

// Training prompts routes
router.get('/prompts', trainingController.getPrompts);
router.post('/prompts', trainingController.createPrompt);
router.put('/prompts/:id', trainingController.updatePrompt);
router.delete('/prompts/:id', trainingController.deletePrompt);

// Training statistics
router.get('/stats', trainingController.getTrainingStats);

// Training sessions routes
router.get('/sessions', trainingController.getTrainingSessions);
router.post('/sessions', trainingController.createTrainingSession);

module.exports = router;
