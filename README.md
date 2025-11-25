# FaithFeed Beta Site

This is the private beta landing page for FaithFeed, deployed at **beta.faithfeed.ai**.

## Overview

This is a lightweight, focused beta signup page designed to:
- Capture beta tester signups via FormSpree
- Showcase key features and benefits
- Build excitement for the December 2025 launch
- Provide clear timeline and expectations

## Tech Stack

- **Frontend**: Pure HTML, CSS, JavaScript (no framework needed)
- **Form Handling**: FormSpree (https://formspree.io/f/manzjalj)
- **Hosting**: Vercel
- **Domain**: beta.faithfeed.ai

## Project Structure

```
faithfeed-beta/
├── index.html          # Main landing page
├── styles.css          # All styling with animations
├── script.js           # Form handling and interactions
├── README.md           # This file
└── .gitignore         # Git ignore file
```

## Features

### 1. Hero Section
- Eye-catching gradient design
- Beta badge with floating animation
- Clear value proposition

### 2. Stats Grid
- Shows beta spots available
- Launch date
- Free beta access highlight

### 3. Benefits Section
- 4 key benefits of joining beta
- Animated cards with hover effects
- Icons for visual interest

### 4. Signup Form
- Name, email, church/ministry (optional)
- Platform selection (iOS/Android/Both)
- Newsletter opt-in
- FormSpree integration for easy handling

### 5. Features Preview
- Checklist of what beta testers will experience
- Clear expectations

### 6. Timeline
- Visual roadmap with completed/active/upcoming phases
- Pulsing animation on active phase

### 7. Responsive Design
- Mobile-first approach
- Looks great on all screen sizes

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial beta site setup"

# Create GitHub repo and push
# (You'll do this via GitHub UI or CLI)
gh repo create faithfeed-beta --public --source=. --remote=origin --push
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose your **faithfeed-beta** repository
5. Configure project:
   - **Framework Preset**: Other (it's just HTML/CSS/JS)
   - **Root Directory**: `./`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
6. Click **"Deploy"**

### Step 3: Add Custom Domain

1. After deployment, go to project settings
2. Click **"Domains"**
3. Add domain: `beta.faithfeed.ai`
4. Vercel will provide DNS instructions

### Step 4: Configure DNS

In your domain registrar (Namecheap/Cloudflare):

1. Add a **CNAME record**:
   - **Host**: `beta`
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: Automatic

2. Wait for DNS propagation (5-30 minutes)

3. Verify in Vercel - it should show as "Valid Configuration"

## Environment Variables

None needed! FormSpree handles the backend.

## FormSpree Setup

The form currently uses: `https://formspree.io/f/manzjalj`

### To Update FormSpree Endpoint:

1. Go to https://formspree.io/
2. Log in with your account
3. Find your form endpoint
4. Update the `action` attribute in [index.html](index.html) line 119:

```html
<form class="beta-form" action="https://formspree.io/f/YOUR-FORM-ID" method="POST" id="betaForm">
```

### FormSpree Email Notifications

FormSpree will send you an email for each submission with:
- Name
- Email
- Church/Ministry
- Platform preference
- Newsletter opt-in status

## Customization

### Update Beta Spots Count

In [index.html](index.html), find the stats section and update:

```html
<div class="stat-number">500+</div>
<div class="stat-label">Beta Spots Available</div>
```

### Change Launch Date

In [index.html](index.html), update the timeline and hero sections with new dates.

### Modify Colors

In [styles.css](styles.css), update the CSS variables at the top:

```css
:root {
    --primary-blue: #3b82f6;
    --dark-blue: #1e40af;
    --accent-green: #10b981;
    /* etc. */
}
```

## Testing Locally

Simply open `index.html` in a browser:

```bash
# Option 1: Open directly
start index.html

# Option 2: Use a local server (recommended)
npx http-server

# Option 3: Use VS Code Live Server extension
# Right-click index.html -> Open with Live Server
```

## Analytics (Optional)

To add Google Analytics:

1. Get your GA4 tracking ID
2. Add to `<head>` in [index.html](index.html):

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

The JavaScript in [script.js](script.js) already includes event tracking for form submissions.

## SEO Optimization

The site includes:
- ✅ Semantic HTML
- ✅ Meta description
- ✅ Proper heading hierarchy
- ✅ Fast loading (no heavy frameworks)
- ✅ Mobile responsive

### Add favicon:

Create a `favicon.png` (32x32 or 64x64) and place in root directory.

## Troubleshooting

### Form submissions not working

1. Check FormSpree endpoint is correct
2. Verify email in FormSpree dashboard is confirmed
3. Check browser console for errors
4. Test with different email addresses

### DNS not resolving

1. Use https://dnschecker.org/ to verify propagation
2. Clear your DNS cache: `ipconfig /flushdns` (Windows)
3. Wait longer - can take up to 48 hours (usually faster)
4. Double-check CNAME record is pointing to `cname.vercel-dns.com`

### Styling looks broken

1. Ensure `styles.css` is in same directory as `index.html`
2. Check browser console for 404 errors
3. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Vercel deployment failed

1. Check build logs in Vercel dashboard
2. Ensure all files are committed to GitHub
3. Verify repository is public or Vercel has access

## Maintenance

### Weekly Checklist

- [ ] Check FormSpree submissions
- [ ] Respond to beta signups
- [ ] Update beta spots count if needed
- [ ] Monitor Vercel analytics
- [ ] Check for any errors in Vercel logs

### Monthly Checklist

- [ ] Review and optimize based on conversion rate
- [ ] A/B test different copy/CTAs
- [ ] Update timeline if dates change
- [ ] Add testimonials if available

## Next Steps After Launch

1. **Collect Submissions**: Download CSV from FormSpree
2. **Send Invites**: Use beta-invitation-email.md templates
3. **Track Metrics**: Monitor signup conversion rate
4. **Iterate**: A/B test headlines, CTAs, form fields
5. **Engage**: Send regular updates to waitlist

## Support

For issues or questions:
- **Email**: beta@lmwlabs.faith
- **Main Site**: https://faithfeed.ai
- **Company**: LMW Labs (https://lmwlabs.faith)

## License

© 2025 LMW Labs. All rights reserved.

---

**Last Updated**: November 24, 2025
**Version**: 1.0.0
**Status**: Ready for deployment
