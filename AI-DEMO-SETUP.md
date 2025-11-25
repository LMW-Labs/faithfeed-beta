# AI Demo Setup Guide

This guide explains how to set up the AI Bible Study Demo page for Reddit and community testing.

## What is This?

The AI Demo (`ai-demo.html`) is a standalone page that lets people test FaithFeed's AI Bible study feature **without signing up or downloading the app**. This is perfect for:

- **Reddit users** who want to audit the AI theologically before committing
- **Skeptics** who want to see if this is helpful or harmful
- **Early feedback** before full beta launch

**Live URL (after setup):** `https://beta.faithfeed.ai/ai-demo.html`

---

## Architecture

```
User enters verse → /api/analyze-verse → Claude API → Response shown
User gives feedback → /api/ai-feedback → Discord webhook → Feedback logged
```

### Files Created

1. **`ai-demo.html`** - Frontend demo page (no signup required)
2. **`api/analyze-verse.js`** - Vercel function that calls Claude API
3. **`api/ai-feedback.js`** - Vercel function that sends feedback to Discord

---

## Setup Steps

### 1. Get Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to **API Keys**
4. Click **Create Key**
5. Copy the key (starts with `sk-ant-`)

**Cost:** Pay-as-you-go pricing
- Claude 3.5 Sonnet: ~$3 per million input tokens, ~$15 per million output tokens
- Estimated cost: **$0.01-0.05 per verse analysis**
- For 100 tests: ~$1-5
- For 1000 tests: ~$10-50

### 2. (Optional) Get Bible API Key

This is optional - the demo will work without it by showing just the verse reference.

1. Go to https://scripture.api.bible/
2. Sign up for free account
3. Get API key from dashboard
4. Free tier: 1000 requests/day

### 3. Add Environment Variables to Vercel

1. Go to your Vercel dashboard
2. Select the **faithfeed-beta** project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-xxx...` | Required - from step 1 |
| `BIBLE_API_KEY` | Your Bible API key | Optional - from step 2 |
| `DISCORD_WEBHOOK_URL` | Your webhook URL | Already set up for beta signups |

5. Click **Save**
6. **Redeploy** the site (Settings → Deployments → Redeploy latest)

---

## Testing the Demo

### Test Locally (Optional)

If you want to test before deploying:

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to faithfeed-beta directory
cd c:/Users/admin/mymobiledev/faithfeed-beta

# Create .env file
echo ANTHROPIC_API_KEY=sk-ant-xxx > .env
echo DISCORD_WEBHOOK_URL=your-webhook > .env

# Run dev server
vercel dev
```

Then visit: `http://localhost:3000/ai-demo.html`

### Test on Production

Once deployed to Vercel:

1. Visit `https://beta.faithfeed.ai/ai-demo.html`
2. Enter a verse (e.g., "John 3:16")
3. Click "Analyze Passage"
4. Verify the AI response appears
5. Submit feedback (helpful/harmful)
6. Check your Discord to see if feedback appeared

---

## How to Use for Reddit

### Sharing the Link

When posting to Reddit, share: **`https://beta.faithfeed.ai/ai-demo.html`**

Example Reddit comment:
```
Don't want to sign up? Just want to audit the AI?

Test it here (no signup required): https://beta.faithfeed.ai/ai-demo.html

Try difficult passages. Flag anything theologically concerning.
Be brutally honest - we need this feedback.
```

### Benefits of This Approach

✅ **No barrier to entry** - Anyone can test immediately
✅ **Shows transparency** - "We're not hiding anything"
✅ **Gets real feedback** - People will test edge cases
✅ **Builds trust** - Shows you care more about truth than sign-ups

---

## What the Demo Does

### For Users:
1. Enter any Bible verse reference
2. AI provides:
   - Historical context
   - Key themes
   - Cross-references
   - Study questions
   - Theological considerations
3. Rate response as helpful or harmful
4. Provide detailed feedback

### For You:
- All feedback goes to Discord webhook
- You see exactly what people think
- Can identify theological issues early
- Build credibility by being responsive

---

## Monitoring Usage

### Discord Webhook Format

Feedback messages in Discord will look like:

```
✅ AI Demo Feedback - Helpful
─────────────────────
Verse Analyzed: John 3:16
Rating: ✓ Helpful for Study

Feedback Details:
"Great historical context on Nicodemus.
Cross-references were spot-on. This would
help a new believer understand the passage."
```

or

```
⚠️ AI Demo Feedback - Concerning
─────────────────────
Verse Analyzed: Romans 9:18
Rating: ✗ Concerning/Harmful

Feedback Details:
"AI oversimplified the Calvinist vs Arminian
debate here. Needs to acknowledge both views
more clearly. Could mislead people."
```

### Cost Monitoring

Monitor your Anthropic API usage:
1. Go to https://console.anthropic.com/
2. Check **Usage** tab
3. Set up billing alerts if needed

**Important:** Start with a low monthly budget ($10-20) to prevent surprise costs.

---

## Handling High Traffic

If your Reddit post goes viral:

### Rate Limiting (Recommended)

Add this to `analyze-verse.js` to prevent abuse:

```javascript
// Simple rate limiting by IP
const rateLimits = new Map();

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const now = Date.now();
  const limit = rateLimits.get(ip) || { count: 0, resetTime: now + 60000 };

  if (now > limit.resetTime) {
    limit.count = 0;
    limit.resetTime = now + 60000;
  }

  if (limit.count > 10) { // Max 10 requests per minute per IP
    return res.status(429).json({ error: 'Rate limit exceeded. Try again in a minute.' });
  }

  limit.count++;
  rateLimits.set(ip, limit);

  // ... rest of your code
}
```

### Cost Controls

1. Set Anthropic account spending limit
2. Monitor usage hourly during Reddit traffic spike
3. Pause API if costs exceed budget

---

## Improving Based on Feedback

### Common Issues to Watch For

❌ **Theological errors** - AI makes doctrinal mistakes
→ Update prompt to be more careful about doctrine

❌ **Denominational bias** - AI favors one tradition
→ Add denominational perspective options

❌ **Oversimplification** - Complex topics dumbed down
→ Prompt AI to acknowledge complexity

❌ **Irrelevant content** - AI goes off-topic
→ Tighten prompt constraints

### Iterating the Prompt

The AI behavior is controlled by the prompt in `api/analyze-verse.js` around line 50.

To improve:
1. Collect feedback from Discord
2. Identify patterns in criticism
3. Update the prompt
4. Git push (Vercel auto-deploys)
5. Test again

---

## Troubleshooting

### "API request failed" Error

**Cause:** Anthropic API key not set or invalid

**Fix:**
1. Check Vercel environment variables
2. Verify API key is correct
3. Redeploy after adding/updating env vars

### Feedback not appearing in Discord

**Cause:** Discord webhook URL not set

**Fix:**
1. Verify `DISCORD_WEBHOOK_URL` is set in Vercel
2. Test webhook URL manually with curl
3. Check Discord webhook hasn't been deleted

### AI responses are low quality

**Cause:** Prompt needs improvement

**Fix:**
1. Review `api/analyze-verse.js` prompt
2. Add more specific instructions
3. Test with difficult passages
4. Iterate based on feedback

### Page doesn't load

**Cause:** Vercel deployment failed

**Fix:**
1. Check Vercel deployment logs
2. Look for build errors
3. Verify all files are pushed to GitHub

---

## Security Considerations

### API Key Safety

✅ **DO:**
- Store API keys in Vercel environment variables
- Never commit API keys to GitHub
- Rotate keys if accidentally exposed

❌ **DON'T:**
- Put API keys in frontend JavaScript
- Share API keys publicly
- Use production keys for testing

### Rate Limiting

Without rate limiting, someone could:
- Spam your API and rack up costs
- Use your API key for their own purposes

**Mitigation:**
- Implement rate limiting (see "Handling High Traffic")
- Monitor usage daily during Reddit campaign
- Set spending alerts

---

## Reddit Campaign Strategy

### When to Share the Demo

**Phase 1: Soft Launch (This Week)**
- Post to r/Christianity with humble ask for feedback
- Share demo link in comments
- Monitor Discord for feedback
- Fix any critical issues

**Phase 2: Expand (Next Week)**
- Post to r/Reformed, r/Bible with learnings from Phase 1
- Reference improvements made based on initial feedback
- Build credibility: "We listened and improved"

**Phase 3: Scale (Week 3-4)**
- Post to larger subs if feedback is positive
- Share demo in comments on related discussions
- Build library of testimonials from helpful feedback

### What NOT to Do

❌ Spam the demo link everywhere
❌ Get defensive about criticism
❌ Ignore negative feedback
❌ Over-promise features

---

## Success Metrics

Track these to know if the demo is working:

1. **Feedback Volume**
   - How many people are testing?
   - How many leave feedback?

2. **Feedback Quality**
   - Helpful vs Harmful ratio
   - Specific issues identified
   - Constructive suggestions

3. **Conversion**
   - Do demo users sign up for beta?
   - Do critics become supporters?

4. **Theological Accuracy**
   - Are there repeated concerns?
   - Do scholars/pastors flag issues?

---

## Next Steps

1. ✅ Files created (you're here!)
2. ⬜ Get Anthropic API key
3. ⬜ Add environment variables to Vercel
4. ⬜ Test the demo page
5. ⬜ Share on Reddit (start small!)
6. ⬜ Monitor feedback in Discord
7. ⬜ Iterate based on feedback

---

## Questions?

If something doesn't work:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Test API endpoints directly
4. Verify environment variables are set

The goal: Get honest feedback on whether AI Bible study helps or hurts discipleship. This demo gives critics a way to engage without commitment.
