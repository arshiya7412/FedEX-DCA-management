import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

const MODEL_NAME = 'gemini-3-flash-preview';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY environment variable is required' }) };
    }
    const ai = new GoogleGenAI({ apiKey });

    const { prompt } = JSON.parse(event.body || '{}');
    if (!prompt) return { statusCode: 400, body: 'Missing prompt' };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result: response.text }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate AI response' }),
    };
  }
};
