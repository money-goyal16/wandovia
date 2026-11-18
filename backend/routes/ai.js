import express from 'express';
import Groq from 'groq-sdk';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth);

const buildPrompt = ({ destination, country, days, interests, budgetLevel, pace }) => `
You are an expert travel guide. Generate a rich, diverse, and realistic day-by-day itinerary as STRICT JSON only —
no markdown, no code fences, no commentary before or after the JSON.
Each day must have a distinct theme and unique, specific activities (landmarks, cultural sites, meals, neighborhoods, local experiences) relevant to ${destination}${country ? `, ${country}` : ''}.
Do NOT repeat the same activities or titles across different days.

Trip details:
- Destination: ${destination}${country ? `, ${country}` : ''}
- Number of days: ${days}
- Interests: ${interests || 'general sightseeing and local culture'}
- Budget level: ${budgetLevel || 'moderate'}
- Pace: ${pace || 'balanced'}

Respond with exactly this JSON shape:
{
  "summary": "one paragraph overview of the trip",
  "days": [
    {
      "day": 1,
      "title": "short, unique theme or title for day 1",
      "activities": [
        "Morning: specific activity or attraction",
        "Lunch / Afternoon: specific culinary or cultural experience",
        "Evening: specific scenic, entertainment or dining experience"
      ]
    }
  ]
}
`;

const CANDIDATE_MODELS = [
  process.env.GROQ_MODEL,
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.8-27b'
].filter(Boolean);

const generateVariedFallback = ({ destination, country, days, interests, pace }) => {
  const fullDest = country ? `${destination}, ${country}` : destination;
  const numDays = parseInt(days, 10) || 3;

  const dayThemes = [
    {
      title: `Arrival & Historic Heart of ${destination}`,
      activities: [
        `Morning: Check into accommodation and take an introductory walking tour of central ${destination}`,
        `Afternoon: Discover iconic architectural landmarks and historic quarters`,
        `Evening: Welcome dinner at a popular local tavern sample regional specialties`
      ]
    },
    {
      title: `Art, Culture & Grand Monuments`,
      activities: [
        `Morning: Early visit to the premier museum and heritage palace in ${destination}`,
        `Afternoon: Stroll through traditional artisan workshops and ${interests || 'local craft centers'}`,
        `Evening: Sunset panoramic viewpoint overlooking the city followed by drinks`
      ]
    },
    {
      title: `Vibrant Bazaars & Culinary Tastings`,
      activities: [
        `Morning: Guided street food tasting walk through the busiest morning markets`,
        `Afternoon: Visit tranquil botanical gardens or heritage courtyards`,
        `Evening: Leisurely dinner at a rooftop restaurant with live local music`
      ]
    },
    {
      title: `Scenic Excursions & Hidden Gems`,
      activities: [
        `Morning: Excursion to historic fortresses or nearby scenic hills`,
        `Afternoon: Coffee break at a bohemian café and exploration of off-the-beaten-path streets`,
        `Evening: Traditional cultural performance or night food market`
      ]
    },
    {
      title: `Deep Cultural Immersion & Relaxed Discovery`,
      activities: [
        `Morning: Visit sacred temples, historic libraries, or spiritual sanctuaries`,
        `Afternoon: Souvenir shopping in antique lanes and tasting artisan treats`,
        `Evening: Relaxing evening stroll along the riverfront or central promenade`
      ]
    },
    {
      title: `Local Neighborhoods & Creative Districts`,
      activities: [
        `Morning: Explore the contemporary art galleries and bohemian district`,
        `Afternoon: Open-air dining experience and photography in scenic alleys`,
        `Evening: Sunset lounge or quiet dinner in a garden setting`
      ]
    },
    {
      title: `Grand Finale & Fond Farewell`,
      activities: [
        `Morning: Last-minute stroll to favorite viewpoints and gift shopping`,
        `Afternoon: Farewell celebratory lunch featuring signature dishes of ${destination}`,
        `Evening: Relaxed sunset walk before departure`
      ]
    }
  ];

  return {
    summary: `A delightful ${numDays}-day journey through ${fullDest}, tailored around ${interests || 'local culture'} with a ${pace || 'balanced'} pace.`,
    days: Array.from({ length: numDays }, (_, i) => {
      const theme = dayThemes[i % dayThemes.length];
      return {
        day: i + 1,
        title: theme.title,
        activities: theme.activities
      };
    })
  };
};

// POST /api/ai/itinerary - generate a trip itinerary with Groq
router.post('/itinerary', async (req, res) => {
  const { destination, country, days, interests, budgetLevel, pace } = req.body;

  if (!destination || !days) {
    return res.status(400).json({ error: 'destination and days are required' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({
      error: 'GROQ_API_KEY is not configured on the server. Add it to backend/.env.'
    });
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const prompt = buildPrompt({ destination, country, days, interests, budgetLevel, pace });

  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a JSON-only API. Only output valid JSON without any commentary or markdown formatting.' },
          { role: 'user', content: prompt }
        ],
        model,
        temperature: 0.6,
        response_format: { type: 'json_object' }
      });

      const rawText = completion.choices[0]?.message?.content;
      if (!rawText) continue;

      const cleaned = rawText.replace(/^```json\s*|\s*```$/g, '').trim();
      const itinerary = JSON.parse(cleaned);

      if (itinerary?.days && Array.isArray(itinerary.days)) {
        return res.json(itinerary);
      }
    } catch (err) {
      lastError = err;
      console.warn(`Groq model ${model} failed: ${err.message}. Trying next candidate if available...`);
    }
  }

  console.error('All AI models failed. Falling back to dynamic diverse itinerary.', lastError?.message);
  return res.json(generateVariedFallback({ destination, country, days, interests, pace }));
});

export default router;
