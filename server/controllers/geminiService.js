const fetch = globalThis.fetch || require("node-fetch");
const MICRO_LESSON_PROMPT = (text) => `
Review this document attached below - 

${text}

Identify 3 to 5 core 'micro-concepts' that can be explained in under 45 seconds each. 

The return object should be in this JSON format:

{
  title: string, // A concise title for the entire lesson set, ideally derived from the document's main topic
  description: string, // A brief summary of the document's content and the key themes covered in the micro-lessons
  lessons: [ // An array of micro-lessons, each focused on a single core concept
}

Each micro-lesson should have the following structure:
{

  title: string, // A clear and engaging name for the micro-concept being explained
  summary: string, // A brief overview of the concept, highlighting its importance and relevance
  keyPoints: 2-4 bullet points that distill the essence of the concept into easily digestible pieces of information,
  audioScript : string // A script written in an engaging, conversational, educational tone designed to be read aloud, explaining the concept in under 45 seconds in Indian language - Hindi, Punjabi, Haryanvi
  order: number // An integer representing the sequence of the micro-lesson within the lesson set, starting from 0 for the first lesson
  quiz: array of objects in this format -
  [
    {
      question: string, // A clear and concise question that tests understanding of the micro-concept
      options: array of strings, // A list of possible answers to the question, including the correct answer and plausible distractors
      answer: string // The correct answer to the quiz question, which should match one of the options provided
    },
  ]
}

Return a JSON object which can be directly parsed through JSON parse function - do not add anything additional text or formatting outside of the JSON structure.`;

function extractTextFromResponse(json) {
  console.log("Gemini raw response:", JSON.stringify(json, null, 2));
  try {
    let rawText = "";
    if (json?.candidates?.[0]?.content?.parts?.[0]?.text) {
      rawText = json.candidates[0].content.parts[0].text;
    } else if (json?.text) {
      rawText = json.text;
    } else {
      return [];
    }

    return JSON.parse(rawText);
  } catch (e) {
    console.error("Failed to parse Gemini JSON payload:", e);
    return [];
  }
}

export async function generateMicroLessons(extractedText) {
  try {
    const prompt = MICRO_LESSON_PROMPT(extractedText);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not set in environment');

    const url = process.env.GEMINI_REST_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

    const body = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Gemini REST API error: ${res.status} ${txt}`);
    }

    const json = await res.json();
    const parsedJson = extractTextFromResponse(json);

    return parsedJson;
  } catch (e) {
    console.error('Failed to JSON.parse cleaned Gemini output:', e, '\nCLEANED:', cleaned);
    return [];
  }
}
