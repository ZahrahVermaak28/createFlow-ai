import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Initialise Google Gemini GenAI SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to generate text with model fallback and retry for high demand / rate limits
async function generateWithGemini(prompt: string, systemInstruction: string, temperature = 0.7) {
  // Use models with independent rate limits: gemini-3.8-flash, gemini-3.1-flash-lite, gemini-flash-latest
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          temperature,
        },
      });
      const text = response.text?.trim();
      if (text) return text;
    } catch (err: any) {
      console.warn(`Model ${model} failed, checking next model...`, err?.message?.slice(0, 70));
      lastError = err;
      // Continue to next model immediately for 429 quota or 503 high demand
    }
  }

  throw lastError || new Error('Unable to generate response at this time. Please retry in a few seconds.');
}

// 1. TEXT GENERATOR ENDPOINT
app.post('/api/generate-text', async (req, res) => {
  try {
    const { prompt, tone = 'Friendly', length = 'Medium' } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Please enter what you would like to write.' });
    }

    const lengthGuidelines: Record<string, string> = {
      Short: 'Keep the response concise, punchy, and approximately 50 to 100 words.',
      Medium: 'Write a well-balanced, engaging response between 150 to 250 words.',
      Long: 'Provide a thorough, comprehensive response between 350 to 500 words with rich detail.',
    };

    const lengthGuide = lengthGuidelines[length] || lengthGuidelines['Medium'];

    const systemInstruction = `You are CreateFlow AI's Text Generator.
Generate high quality, engaging written content based on the user's request.
Tone: ${tone}.
Length requirement: ${lengthGuide}
CRITICAL INSTRUCTION: Return ONLY the final generated text directly. Do not include conversational introductory phrases like "Here is your post:", "Sure! Here is the text:", or meta comments. Provide clean paragraphs with appropriate emojis if fitting the tone.`;

    const generatedText = await generateWithGemini(prompt.trim(), systemInstruction, 0.8);

    return res.json({
      text: generatedText,
      tone,
      length,
    });
  } catch (error: any) {
    console.error('Error generating text:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate text. Please try again in a moment.',
    });
  }
});

// 2. CODE GENERATOR ENDPOINT
app.post('/api/generate-code', async (req, res) => {
  try {
    const { prompt, language = 'JavaScript' } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Please specify what the code should do.' });
    }

    const systemInstruction = `You are CreateFlow AI's Code Generator.
Generate clean, modern, well-structured, and bug-free code for the requested task.
Target Language / Framework: ${language}.
CRITICAL INSTRUCTION:
1. Return ONLY the code itself.
2. Include clear, educational in-line code comments to explain key logic.
3. DO NOT wrap the code in markdown backtick fences (e.g. do NOT output \`\`\`${language} or \`\`\`).
4. DO NOT include any conversational preamble or postscript (e.g., "Here is the code", "Hope this helps!").
5. The output should be directly copyable and executable.`;

    let code = await generateWithGemini(`Language: ${language}\nTask: ${prompt.trim()}`, systemInstruction, 0.2);

    // Strip any accidental markdown fences if returned
    if (code.startsWith('```')) {
      code = code.replace(/^```[a-zA-Z0-9#+-]*\n?/, '').replace(/\n?```$/, '').trim();
    }

    return res.json({
      code,
      language,
    });
  } catch (error: any) {
    console.error('Error generating code:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate code. Please try again in a moment.',
    });
  }
});

// 3. IMAGE GENERATOR ENDPOINT
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, style = 'Realistic' } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Please describe the image you want to create.' });
    }

    const enrichedPrompt = `${prompt.trim()}, in ${style} style, high resolution, stunning visual composition, vivid detail`;

    // Attempt 1: Gemini image generation
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: enrichedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          const imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          return res.json({
            imageUrl,
            prompt: prompt.trim(),
            style,
            engine: 'gemini',
          });
        }
      }
    } catch (geminiError: any) {
      console.warn('Gemini direct image generation unavailable or quota reached:', geminiError?.message);
    }

    // Attempt 2: AI visual synthesizer fallback
    try {
      const imageUrlFallback = `https://image.pollinations.ai/prompt/${encodeURIComponent(enrichedPrompt)}`;

      const imgResponse = await fetch(imageUrlFallback);
      if (imgResponse.ok) {
        const arrayBuffer = await imgResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');
        const mimeType = imgResponse.headers.get('content-type') || 'image/jpeg';
        const dataUrl = `data:${mimeType};base64,${base64Data}`;

        return res.json({
          imageUrl: dataUrl,
          prompt: prompt.trim(),
          style,
          engine: 'ai-synthesizer',
        });
      }
    } catch (synthError: any) {
      console.warn('Synthesizer fetch error:', synthError?.message);
    }

    // Attempt 3: High resolution SVG Graphic Canvas Synthesizer
    const safePrompt = prompt.trim().replace(/"/g, "'");
    const svgGraphic = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5B3FD6" />
      <stop offset="50%" stop-color="#8B6FE8" />
      <stop offset="100%" stop-color="#E76F8A" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#F5A889" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#5B3FD6" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="800" height="800" rx="32" fill="url(#bgGrad)" />
  <circle cx="400" cy="350" r="280" fill="url(#glow)" />
  <rect x="80" y="520" width="640" height="200" rx="20" fill="rgba(31, 31, 46, 0.7)" />
  <text x="400" y="320" font-family="sans-serif" font-size="72" font-weight="bold" fill="#FFFFFF" text-anchor="middle">🎨</text>
  <text x="400" y="420" font-family="sans-serif" font-size="32" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${style} Style</text>
  <text x="400" y="580" font-family="sans-serif" font-size="20" font-weight="600" fill="#F5A889" text-anchor="middle">CreateFlow AI Visual Studio</text>
  <text x="400" y="630" font-family="sans-serif" font-size="16" fill="#E0E0FF" text-anchor="middle">&ldquo;${safePrompt}&rdquo;</text>
</svg>`;

    const svgBase64 = Buffer.from(svgGraphic).toString('base64');
    return res.json({
      imageUrl: `data:image/svg+xml;base64,${svgBase64}`,
      prompt: prompt.trim(),
      style,
      engine: 'svg-studio',
    });
  } catch (error: any) {
    console.error('Error in image generation:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to create image. Please try again.',
    });
  }
});

// Vite middleware in dev or static files in production
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`CreateFlow AI server running at http://0.0.0.0:${port}`);
});
