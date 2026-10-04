
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Gemini configuration
const GEMINI_KEY = (process.env.GEMINI_API_KEY || '').trim();

const isPlaceholderKey =
  !GEMINI_KEY ||
  /YOUR_|PLACEHOLDER|<[^>]+>|^xxx$|change_?me/i.test(GEMINI_KEY);

if (isPlaceholderKey) {
  console.error(
    'GEMINI_API_KEY is missing or a placeholder. ' +
      'Get a key at https://aistudio.google.com/apikey ' +
      'and set it in backend/.env'
  );
}

const ai = isPlaceholderKey
  ? null
  : new GoogleGenAI({ apiKey: GEMINI_KEY });

const MODEL = 'gemini-3.5-flash-lite';

console.log('[Gemini diagnostic]', {
  keyLoaded: Boolean(GEMINI_KEY),
  isPlaceholderKey,
  aiInitialized: Boolean(ai),
});

// Check Gemini configuration
const ensureConfigured = () => {
  console.log('[Gemini check]', {
    aiExists: Boolean(ai),
    keyLoaded: Boolean(GEMINI_KEY),
    isPlaceholderKey,
  });

  if (!ai) {
    const error = new Error(
      'AI is not configured: set a valid GEMINI_API_KEY in backend/.env'
    );
    error.statusCode = 503;
    throw error;
  }
};

// Log useful error details without exposing the API key
const logGeminiError = (feature, error) => {
  console.error(`[Gemini ${feature} error]`, {
    message: error?.message,
    status: error?.status,
    code: error?.code,
    name: error?.name,
    details: error?.errorDetails,
  });
};

// Common Gemini request function
const generateContent = async (prompt) => {
  ensureConfigured();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  const generatedText = response.text;

  if (!generatedText || typeof generatedText !== 'string') {
    throw new Error('Gemini returned an empty response');
  }

  return generatedText;
};

/**
 * Generate flashcards from text
 * @param {string} text - Document text
 * @param {number} count - Number of flashcards
 * @returns {Promise<Array<{question: string, answer: string, difficulty: string}>>}
 */
export const generateFlashcards = async (text, count = 10) => {
  const prompt = `Generate exactly ${count} educational flashcards from the following text.

Format each flashcard as:
Q: [Clear, specific question]
A: [Concise, accurate answer]
D: [Difficulty level: easy, medium, or hard]

Separate each flashcard with "---".

Text:
${String(text || '').substring(0, 15000)}`;

  try {
    const generatedText = await generateContent(prompt);
    const flashcards = [];

    const cards = generatedText
      .split('---')
      .filter((card) => card.trim());

    for (const card of cards) {
      const lines = card.trim().split('\n');

      let question = '';
      let answer = '';
      let difficulty = 'medium';

      for (let line of lines) {
        line = line.trim();

        if (line.startsWith('Q:')) {
          question = line.substring(2).trim();
        } else if (line.startsWith('A:')) {
          answer = line.substring(2).trim();
        } else if (line.startsWith('D:')) {
          const diff = line.substring(2).trim().toLowerCase();

          if (['easy', 'medium', 'hard'].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      if (question && answer) {
        flashcards.push({
          question,
          answer,
          difficulty,
        });
      }
    }

    if (flashcards.length === 0) {
      throw new Error('No valid flashcards could be parsed');
    }

    return flashcards.slice(0, count);
  } catch (error) {
    logGeminiError('flashcards', error);

    const err = new Error(
      error.message || 'Failed to generate flashcards',
      { cause: error }
    );

    err.statusCode = error.status || error.statusCode || 500;
    throw err;
  }
};

/**
 * Generate quiz questions
 * @param {string} text - Document text
 * @param {number} numQuestions - Number of questions
 * @returns {Promise<Array>}
 */
export const generateQuiz = async (text, numQuestions = 5) => {
  const prompt = `Generate exactly ${numQuestions} multiple-choice questions from the following text.

Format each question as:
Q: [Question]
O1: [Option 1]
O2: [Option 2]
O3: [Option 3]
O4: [Option 4]
A: [Correct option - exactly as written above]
E: [Brief explanation]
D: [Difficulty level: easy, medium, or hard]

Separate each question with "---".

Text:
${String(text || '').substring(0, 15000)}`;

  try {
    const generatedText = await generateContent(prompt);
    const questions = [];

    const questionBlocks = generatedText
      .split('---')
      .filter((block) => block.trim());

    for (const block of questionBlocks) {
      const lines = block.trim().split('\n');

      let question = '';
      const options = [];
      let correctAnswer = '';
      let explanation = '';
      let difficulty = 'medium';

      for (let line of lines) {
        line = line.trim();

        if (line.startsWith('Q:')) {
          question = line.substring(2).trim();
        } else if (/^O[1-4]:/.test(line)) {
          options.push(line.substring(line.indexOf(':') + 1).trim());
        } else if (line.startsWith('A:')) {
          correctAnswer = line.substring(2).trim();
        } else if (line.startsWith('E:')) {
          explanation = line.substring(2).trim();
        } else if (line.startsWith('D:')) {
          const diff = line.substring(2).trim().toLowerCase();

          if (['easy', 'medium', 'hard'].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      if (question && correctAnswer && options.length === 4) {
        questions.push({
          question,
          options,
          correctAnswer,
          explanation,
          difficulty,
        });
      }
    }

    if (questions.length === 0) {
      throw new Error('No valid quiz questions could be parsed');
    }

    return questions.slice(0, numQuestions);
  } catch (error) {
    logGeminiError('quiz', error);

    const err = new Error(
      error.message || 'Failed to generate quiz',
      { cause: error }
    );

    err.statusCode = error.status || error.statusCode || 500;
    throw err;
  }
};

/**
 * Generate document summary
 * @param {string} text - Document text
 * @returns {Promise<string>}
 */
export const generateSummary = async (text) => {
  const prompt = `Provide a concise summary of the following text, highlighting the key concepts, main ideas, and important points.

Keep the summary clear and structured.

Text:
${String(text || '').substring(0, 20000)}`;

  try {
    return await generateContent(prompt);
  } catch (error) {
    logGeminiError('summary', error);

    const err = new Error(
      error.message || 'Failed to generate summary',
      { cause: error }
    );

    err.statusCode = error.status || error.statusCode || 500;
    throw err;
  }
};

/**
 * Chat with document context
 * @param {string} question - User question
 * @param {Array<Object>} chunks - Relevant document chunks
 * @returns {Promise<string>}
 */
export const chatWithContent = async (question, chunks = []) => {
  const context = chunks
    .map((chunk, index) => `[Chunk ${index + 1}]\n${chunk.content || ''}`)
    .join('\n\n')
    .substring(0, 20000);

  const prompt = `Based on the following context from a document, analyze the context and answer the user's question.

If the answer is not in the context, say so. Do not invent information.

Context:
${context}

Question: ${question}

Answer:`;

  try {
    return await generateContent(prompt);
  } catch (error) {
    logGeminiError('chat', error);

    const err = new Error(
      error.message || 'Failed to process chat request',
      { cause: error }
    );

    err.statusCode = error.status || error.statusCode || 500;
    throw err;
  }
};

/**
 * Explain a specific concept
 * @param {string} concept - Concept to explain
 * @param {Array<Object>} chunks - Relevant document chunks
 * @returns {Promise<string>}
 */
export const explainConcept = async (concept, chunks = []) => {
  const context = chunks
    .map((chunk, index) => `[Chunk ${index + 1}]\n${chunk.content || ''}`)
    .join('\n\n')
    .substring(0, 10000);

  const prompt = `Explain the concept of ${concept} based on the following context.

Provide a clear, educational explanation that is easy to understand.
Include an example if relevant.

Context:
${context}`;

  try {
    return await generateContent(prompt);
  } catch (error) {
    logGeminiError('concept explanation', error);

    const err = new Error(
      error.message || 'Failed to explain concept',
      { cause: error }
    );

    err.statusCode = error.status || error.statusCode || 500;
    throw err;
  }
};
