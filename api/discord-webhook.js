// Vercel Serverless Function: FormSpree → Discord Webhook
// This receives FormSpree submissions and posts them to Discord

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, church, platform, newsletter } = req.body;

    // Your Discord webhook URL (set this as environment variable in Vercel)
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

    if (!DISCORD_WEBHOOK_URL) {
      console.error('Discord webhook URL not configured');
      return res.status(500).json({ error: 'Webhook not configured' });
    }

    // Format message for Discord
    const discordMessage = {
      embeds: [{
        title: "🎉 New Beta Signup!",
        color: 0x3b82f6, // Blue color
        fields: [
          {
            name: "Name",
            value: name || "Not provided",
            inline: true
          },
          {
            name: "Email",
            value: email || "Not provided",
            inline: true
          },
          {
            name: "Church/Ministry",
            value: church || "Not provided",
            inline: false
          },
          {
            name: "Platform",
            value: platform || "Not specified",
            inline: true
          },
          {
            name: "Newsletter",
            value: newsletter === 'yes' ? "✅ Yes" : "❌ No",
            inline: true
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "FaithFeed Beta Signups"
        }
      }]
    };

    // Send to Discord
    const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordMessage)
    });

    if (!discordResponse.ok) {
      throw new Error(`Discord API error: ${discordResponse.status}`);
    }

    // Return success
    return res.status(200).json({
      success: true,
      message: 'Posted to Discord successfully'
    });

  } catch (error) {
    console.error('Error posting to Discord:', error);
    return res.status(500).json({
      error: 'Failed to post to Discord',
      details: error.message
    });
  }
}
