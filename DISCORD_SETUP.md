# Discord Webhook Setup Guide

This guide shows you how to automatically post beta signups to Discord.

## Quick Setup (5 minutes)

### 1. Get Discord Webhook URL

1. Open your Discord server
2. Right-click the channel where you want announcements (e.g., `#beta-signups`)
3. Click **Settings** → **Integrations** → **Webhooks**
4. Click **New Webhook**
5. Name it: `Beta Signups Bot`
6. **Copy the Webhook URL** (keep this secret!)

### 2. Add Environment Variable to Vercel

1. Go to https://vercel.com/dashboard
2. Select your `faithfeed-beta` project
3. Click **Settings** → **Environment Variables**
4. Click **Add New**
5. Set:
   - **Name**: `DISCORD_WEBHOOK_URL`
   - **Value**: (paste your Discord webhook URL from step 1)
   - **Environments**: Check all (Production, Preview, Development)
6. Click **Save**
7. Go to **Deployments** → Click **...** on latest → **Redeploy**

### 3. Configure FormSpree Integration

1. Go to https://formspree.io/
2. Log in and select your form (ID: `manzjalj`)
3. Click **Integrations** tab
4. Click **Add Integration** → **Webhook**
5. Set webhook URL: `https://beta.faithfeed.ai/api/discord-webhook`
6. Method: `POST`
7. Click **Save**

### 4. Test It!

1. Go to https://beta.faithfeed.ai/
2. Fill out the beta signup form
3. Submit it
4. Check your Discord channel - you should see a new message! 🎉

## What Gets Posted to Discord

Each signup creates a Discord embed with:
- 🎉 Title: "New Beta Signup!"
- Name
- Email
- Church/Ministry (if provided)
- Platform preference (iOS/Android/Both)
- Newsletter opt-in status
- Timestamp

## Troubleshooting

### Not showing up in Discord?

1. **Check webhook URL is correct**:
   - Go to Vercel → Settings → Environment Variables
   - Verify `DISCORD_WEBHOOK_URL` is set correctly

2. **Check FormSpree integration**:
   - FormSpree dashboard → Integrations
   - Verify webhook URL is `https://beta.faithfeed.ai/api/discord-webhook`

3. **Check Vercel function logs**:
   - Vercel dashboard → Deployments → Click latest
   - Go to **Functions** tab → Click `discord-webhook`
   - Check logs for errors

4. **Test the webhook directly**:
   ```bash
   curl -X POST https://beta.faithfeed.ai/api/discord-webhook \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "platform": "ios",
       "newsletter": "yes"
     }'
   ```

### Getting 500 errors?

- Make sure you redeployed after adding the environment variable
- Check that the Discord webhook URL is still valid (test it in Discord settings)

## Customization

Want to change how the Discord message looks? Edit `api/discord-webhook.js`:

### Change the color:
```javascript
color: 0x3b82f6, // Blue (current)
// Try: 0x10b981 for green, 0xef4444 for red
```

### Add a custom avatar:
```javascript
username: "FaithFeed Beta Bot",
avatar_url: "https://beta.faithfeed.ai/blue glow.png"
```

### Mention a role when someone signs up:
```javascript
content: "<@&YOUR_ROLE_ID> New beta signup!"
```

## Security Notes

- ✅ Webhook URL is stored securely in Vercel environment variables (not in code)
- ✅ FormSpree validates submissions before sending to webhook
- ✅ Only POST requests are accepted
- ⚠️ Never commit your Discord webhook URL to GitHub

## Advanced: Multiple Webhooks

Want to post to multiple Discord channels? Add more webhooks:

1. Create additional webhooks in Discord
2. Add more environment variables:
   - `DISCORD_WEBHOOK_ADMIN`
   - `DISCORD_WEBHOOK_TEAM`
3. Modify `discord-webhook.js` to post to multiple URLs

---

**Need help?** Check the Vercel function logs or test the webhook manually.
