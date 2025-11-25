// Vercel Serverless Function for AI Bible Study Analysis
// Uses Anthropic Claude API to analyze Bible passages

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { verse } = req.body;

    if (!verse) {
      return res.status(400).json({ error: 'Verse reference required' });
    }

    // Get API key from environment variables
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    const BIBLE_API_KEY = process.env.BIBLE_API_KEY; // Optional: For fetching verse text

    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Step 1: Fetch the actual verse text from Bible API (optional)
    let verseText = '';
    try {
      const bibleResponse = await fetch(
        `https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/search?query=${encodeURIComponent(verse)}`,
        {
          headers: {
            'api-key': BIBLE_API_KEY || 'demo-key'
          }
        }
      );
      const bibleData = await bibleResponse.json();
      verseText = bibleData?.data?.passages?.[0]?.content || 'Verse text not found';
    } catch (error) {
      console.error('Bible API error:', error);
      verseText = `[${verse}]`;
    }

    // Step 2: Call Claude API for analysis
    const prompt = `You are a thoughtful Bible study assistant. A user wants to understand ${verse}.

IMPORTANT GUIDELINES:
- Provide CONTEXT, not doctrine or definitive interpretation
- Focus on historical background, cultural context, and study questions
- Be humble about limitations - acknowledge when something is debated or uncertain
- Suggest cross-references and related passages
- Frame insights as "scholars suggest" or "possible interpretation" rather than absolute statements
- Always remind users to verify with their pastor/study group
- Respect denominational differences (don't favor one tradition)

Verse text:
${verseText}

Please provide:
1. Historical Context (when written, original audience, cultural background)
2. Key Themes (main ideas in this passage)
3. Cross-References (2-4 related passages with brief explanation why they're connected)
4. Study Questions (3-5 Socratic questions for deeper reflection)
5. Theological Considerations (any denominational differences or scholarly debates about this passage)

Format your response in clear sections with headers. Be concise but thorough. Remember: you're providing study tools, not authoritative teaching.`;

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.text();
      console.error('Claude API error:', errorData);
      return res.status(500).json({ error: 'AI analysis failed' });
    }

    const claudeData = await claudeResponse.json();
    const analysis = claudeData.content[0].text;

    // Return the analysis
    return res.status(200).json({
      verse: verse,
      verseText: verseText,
      analysis: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in analyze-verse:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
