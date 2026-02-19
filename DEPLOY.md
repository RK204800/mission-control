# Deployment Guide

## Quick Deploy to Vercel (Free Tier)

### Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (free)

### Steps

#### 1. Prepare Your Code

```bash
cd /root/.openclaw/workspace/mission-control

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Mission Control Dashboard"
```

#### 2. Push to GitHub

```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/mission-control.git
git branch -M main
git push -u origin main
```

#### 3. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your repository
5. Keep default settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Click "Deploy"

#### 4. Your Dashboard is Live! 🎉

The dashboard will be deployed to a URL like: `https://mission-control-xxx.vercel.app`

---

## Alternative: Vercel CLI Deployment

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login
vercel login

# Deploy from project directory
cd /root/.openclaw/workspace/mission-control
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your name
# - Want to modify settings? No (defaults are fine)
```

---

## Optional: Connect to Real Workspace Files

For production, you can configure the API routes to read from a Git repository or external storage.

### Option A: Clone Workspace Files at Build Time

Update `next.config.ts` to clone your workspace during deployment:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Clone workspace files during build
  // This requires adding secrets in Vercel
}

module.exports = nextConfig
```

### Option B: Use Environment Variables

In Vercel dashboard, add:

```
WORKSPACE_REPO_URL=https://github.com/your/workspace.git
WORKSPACE_PATH=/path/to/workspace
```

---

## Free Tier Limits (Vercel)

| Feature | Free Tier |
|---------|-----------|
| Bandwidth | 100 GB/month |
| Build Time | 6,000 minutes/month |
| Functions | 12 functions |
| SSL | ✓ |
| Custom Domain | ✓ |

For the Mission Control dashboard, the free tier is more than sufficient!

---

## Troubleshooting

### Build Fails
- Ensure `npm install` runs without errors locally first
- Check that all dependencies are in package.json

### API Routes Not Working
- In production, API routes are serverless functions
- Check Vercel function logs in dashboard

### Styles Look Wrong
- Ensure Tailwind CSS is properly configured
- Clear browser cache

---

## Adding Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for propagation (usually a few minutes to hours)