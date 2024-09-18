import express from 'express';
import model from './gemini.js'; // Import your gemini model

const router = express.Router();

// Function to generate quiz questions using your model
async function generateQuizQuestions(topic, numQuestions = 5) {
  const prompt = `Generate ${numQuestions} quiz questions about ${topic}. For each question, provide the correct answer. Format the output as a JSON array of objects, each with 'question' and 'answer' properties.`;

  try {
    const chat = model.startChat({
      history: [{ role: "system", parts: [{ text: prompt }] }],
      generationConfig: {},
    });

    const result = await chat;
    const response = await result.lastOutput(); // Assuming this retrieves the final output
    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    return [];
  }
}

// Route to get quiz questions
router.get('/generate', async (req, res) => {
  const { topic, numQuestions } = req.query;
  try {
    const questions = await generateQuizQuestions(topic, numQuestions || 5); // Default to 5 questions if not provided
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate quiz questions' });
  }
});

// Function to evaluate an answer using your model
async function evaluateAnswer(question, userAnswer, correctAnswer) {
  const prompt = `Question: ${question}\nUser's answer: ${userAnswer}\nCorrect answer: ${correctAnswer}\nIs the user's answer correct? Respond with just 'true' or 'false'.`;

  try {
    const chat = model.startChat({
      history: [{ role: "system", parts: [{ text: prompt }] }],
      generationConfig: {},
    });

    const result = await chat;
    const response = await result.lastOutput(); // Assuming this retrieves the final output
    const evaluation = response.text.trim().toLowerCase() === 'true';
    return evaluation;
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return false;
  }
}

// Route to evaluate an answer
router.post('/evaluate', async (req, res) => {
  const { question, userAnswer, correctAnswer } = req.body;
  try {
    const isCorrect = await evaluateAnswer(question, userAnswer, correctAnswer);
    res.json({ correct: isCorrect });
  } catch (error) {
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
});

export default router;
