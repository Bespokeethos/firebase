# 🚀 Prometheus AI

> **Autonomous AI Executive Prosthetic** - Firebase Genkit + Vertex AI + Next.js 14

An intelligent dashboard that monitors your business, generates insights, and takes autonomous action using AI.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 14 Frontend                     │
│                   (Firebase App Hosting)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Cloud Functions (Gen 2)                    │
│                                                             │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ Marketing     │  │ Competitor   │  │  Opportunity    │ │
│  │ Brief         │  │ Watch        │  │  Scanner        │ │
│  └───────────────┘  └──────────────┘  └─────────────────┘ │
│                                                             │
│  ┌───────────────┐  ┌──────────────┐                      │
│  │ Content       │  │ Self-Healing │                      │
│  │ Drafter       │  │ Monitor      │                      │
│  └───────────────┘  └──────────────┘                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Vertex AI + Firestore + Secret Manager         │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Features

### 🤖 AI-Powered Flows

1. **Marketing Brief** - Daily executive summary from GA4 analytics
2. **Competitor Watch** - Monitor competitor changes automatically
3. **Content Drafter** - Generate SEO-optimized content
4. **Opportunity Scanner** - Find leads from NGLCC, events, news
5. **Self-Healing** - Auto-diagnose and fix system issues

### ⏰ Scheduled Tasks

- **Self-Healing Check** - Every 15 minutes
- **Opportunity Scan** - Daily at 9 AM EST

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Firebase CLI (`npm install -g firebase-tools`)
- Google Cloud CLI
- Active Google Cloud Project with billing enabled

### 1. Clone & Install

```bash
git clone https://github.com/Bespokeethos/firebase.git
cd firebase
npm install
cd functions && npm install && cd ..
```

### 2. Configure Firebase

```bash
# Login to Firebase
firebase login

# Set project
firebase use bespokeethos-analytics-475007
```

### 3. Enable Required APIs

```bash
gcloud services enable \
  aiplatform.googleapis.com \
  secretmanager.googleapis.com \
  cloudfunctions.googleapis.com \
  run.googleapis.com \
  firestore.googleapis.com \
  cloudbuild.googleapis.com
```

### 4. Set up Secrets

Add these secrets in [Secret Manager](https://console.cloud.google.com/security/secret-manager?project=bespokeethos-analytics-475007):

- `GEMINI_API_KEY`
- `GA4_PROPERTY_ID_BESPOKE`
- `GA4_PROPERTY_ID_GMFG`

### 5. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Firebase configuration:

```bash
cp .env.local.example .env.local
# Edit .env.local with your Firebase config from console
```

Get Firebase config from: https://console.firebase.google.com/project/bespokeethos-analytics-475007/settings/general

### 6. Deploy

```bash
# Full deployment
firebase deploy

# Or deploy separately:
firebase deploy --only hosting    # Next.js app
firebase deploy --only functions   # Cloud Functions
firebase deploy --only firestore   # Rules + Indexes
```

## 🧪 Local Development

### Start Next.js Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Test Cloud Functions Locally

```bash
firebase emulators:start
```

### Test Genkit Flows

```bash
npm run genkit:dev
```

Open [http://localhost:4000](http://localhost:4000) for Genkit UI

## 📦 Project Structure

```
firebase/
├── src/
│   ├── app/              # Next.js 14 App Router
│   │   ├── page.tsx     # Main dashboard
│   │   ├── layout.tsx   # Root layout
│   │   └── globals.css  # Tailwind styles
│   ├── lib/
│   │   └── firebase.ts  # Firebase client config
│   └── ai/              # AI flows (dev reference)
│       ├── genkit.ts    # Genkit configuration
│       └── flows/       # Flow definitions
├── functions/
│   ├── src/
│   │   ├── index.ts     # Cloud Functions exports
│   │   └── ai/          # AI flows (production)
│   ├── package.json
│   └── tsconfig.json
├── firebase.json         # Firebase config
├── firestore.rules       # Security rules
├── firestore.indexes.json # Database indexes
└── package.json          # Root dependencies
```

## 🔧 Configuration Files

### firebase.json

Configures:
- Next.js hosting with App Hosting
- Cloud Functions (Node 20, TypeScript)
- Firestore rules and indexes
- Local emulators

### Functions Configuration

Each function is deployed to `us-central1` with:
- Memory: 256MB (self-healing) or 512MB (other flows)
- Timeout: 60s default
- Runtime: Node 20

## 📊 Monitoring

### Cloud Trace
View traces at: https://console.cloud.google.com/traces?project=bespokeethos-analytics-475007

### Cloud Functions Logs
```bash
firebase functions:log
```

### Firestore Data
Browse at: https://console.cloud.google.com/firestore?project=bespokeethos-analytics-475007

## 🛡️ Security

- **Secrets**: Stored in Google Secret Manager (never in code)
- **Firestore Rules**: Configured in `firestore.rules`
- **Function Auth**: All functions require authentication
- **CORS**: Configured for Next.js domain only

## 🎯 AI Models Used

| Model | Purpose | Usage |
|-------|---------|-------|
| `gemini-2.0-flash` | Default (90%) | Fast, cost-efficient |
| `gemini-2.0-pro` | Escalation (10%) | Complex decisions |
| `text-embedding-004` | Vector Search | Semantic matching |

## 📝 Environment Variables

### Next.js (.env.local)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## 🚨 Troubleshooting

### Build Failures

**Issue**: Google Fonts network access error
```bash
# ✅ Fix: Use system fonts (already configured)
# Don't use: import { Inter } from 'next/font/google'
```

**Issue**: Tailwind import error
```bash
# ✅ Use: @tailwind base/components/utilities
# Don't use: @import "tailwindcss"
```

### Function Deployment Errors

```bash
# Check function logs
firebase functions:log --only functionName

# Rebuild functions
cd functions && npm run build

# Test locally first
firebase emulators:start
```

### Vertex AI Quota Errors

Check quota at: https://console.cloud.google.com/iam-admin/quotas?project=bespokeethos-analytics-475007

## 📚 Resources

- [Firebase Genkit Docs](https://firebase.google.com/docs/genkit)
- [Vertex AI Docs](https://cloud.google.com/vertex-ai/docs)
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Cloud Functions Docs](https://firebase.google.com/docs/functions)

## 🤝 Contributing

This is a private repository for Bespoke Ethos internal use.

## 📄 License

Proprietary - All Rights Reserved
