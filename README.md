# Mission Control Dashboard

A professional dark-themed dashboard for OpenClaw, built with Next.js 15 and Tailwind CSS.

## Features

- **Tasks Board** - Manage tasks with status tracking (todo, in-progress, done), assignees, and priorities
- **Memory Viewer** - Browse and search memory files from the workspace
- **Agent Status** - Monitor running sub-agents and their current tasks
- **Team Structure** - View all team members (humans and agents) organized by role
- **Calendar** - Manage scheduled tasks and cron jobs

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel (Free Tier)

### Option 1: Deploy from Git

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Vercel](https://vercel.com) and sign up
3. Click "Add New Project" and select your repository
4. Configure the project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Click "Deploy"

### Option 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd mission-control
vercel
```

### Environment Variables

For production, you may want to add:

```
# Optional: If connecting to external services
NEXT_PUBLIC_API_URL=your-api-url
```

## Project Structure

```
mission-control/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   └── workspace/ # Workspace file APIs
│   │   ├── agents/        # Agent status page
│   │   ├── calendar/     # Calendar/scheduler page
│   │   ├── memory/       # Memory viewer page
│   │   ├── tasks/        # Tasks board page
│   │   ├── team/         # Team structure page
│   │   ├── globals.css   # Global styles (dark theme)
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Dashboard home
│   └── components/
│       ├── Sidebar.tsx       # Navigation sidebar
│       └── DashboardLayout.tsx  # Dashboard layout wrapper
├── public/
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Dark Theme

The dashboard uses a professional dark theme with:

- Primary background: `#0a0a0f`
- Secondary background: `#12121a`
- Card background: `#16161f`
- Accent colors: Blue, Green, Yellow, Red, Purple

## API Routes

- `GET /api/workspace/memory` - List memory files
- `GET /api/workspace/memory?file=/path` - Get file content
- `GET /api/workspace/stats` - Get system stats
- `GET /api/workspace/files` - List workspace files

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4
- Lucide React (icons)
- TypeScript

## License

MIT