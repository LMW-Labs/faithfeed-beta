// Vercel Serverless Function for AI Demo Feedback
// Sends feedback to Discord webhook

export default async function handler(req, res) {
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
    const { verse, feedbackType, feedback } = req.body;

    if (!verse || !feedbackType || !feedback) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

    if (!DISCORD_WEBHOOK_URL) {
      console.error('Discord webhook URL not configured');
      // Still return success to user, just log the error
      return res.status(200).json({ success: true });
    }

    // Determine emoji and color based on feedback type
    const isHelpful = feedbackType === 'helpful';
    const emoji = isHelpful ? '✅' : '⚠️';
    const color = isHelpful ? 0x10b981 : 0xef4444;

    // Create Discord embed message
    const discordMessage = {
      embeds: [{
        title: `${emoji} AI Demo Feedback - ${isHelpful ? 'Helpful' : 'Concerning'}`,
        color: color,
        fields: [
          {
            name: "Verse Analyzed",
            value: verse,
            inline: true
          },
          {
            name: "Rating",
            value: isHelpful ? "✓ Helpful for Study" : "✗ Concerning/Harmful",
            inline: true
          },
          {
            name: "Feedback Details",
            value: feedback.length > 1000 ? feedback.substring(0, 1000) + '...' : feedback,
            inline: false
          }
        ],
        footer: {
          text: "FaithFeed AI Demo Feedback"
        },
        timestamp: new Date().toISOString()
      }]
    };

    // Send to Discord
    const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(discordMessage)
    });

    if (!discordResponse.ok) {
      console.error('Discord webhook failed:', await discordResponse.text());
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error in ai-feedback:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
