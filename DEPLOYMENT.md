# 🚀 Deployment Checklist

## Pre-Deployment Setup (One-Time)

### 1. Google Cloud Project Setup

- [ ] Create/verify project: `bespokeethos-analytics-475007`
- [ ] Enable billing account: `01D82D-EE885B-C29459`
- [ ] Set default region: `us-central1`

### 2. Enable Required APIs

```bash
gcloud services enable \
  aiplatform.googleapis.com \
  secretmanager.googleapis.com \
  cloudfunctions.googleapis.com \
  run.googleapis.com \
  pubsub.googleapis.com \
  firestore.googleapis.com \
  cloudbuild.googleapis.com \
  firebase.googleapis.com
```

### 3. Create Secrets in Secret Manager

Navigate to: https://console.cloud.google.com/security/secret-manager?project=bespokeethos-analytics-475007

Create these secrets:

- [ ] `GEMINI_API_KEY` - Gemini API key for Vertex AI
- [ ] `GA4_PROPERTY_ID_BESPOKE` - GA4 property ID for bespoke-ethos
- [ ] `GA4_PROPERTY_ID_GMFG` - GA4 property ID for GMFG

### 4. Firebase Project Setup

```bash
# Login to Firebase
firebase login

# Select project
firebase use bespokeethos-analytics-475007

# Initialize if needed
firebase init
# Select:
# - Firestore
# - Functions (TypeScript, Node 20)
# - Hosting (Next.js)
```

### 5. Firestore Setup

- [ ] Create Firestore database in `us-central1`
- [ ] Deploy security rules: `firebase deploy --only firestore:rules`
- [ ] Deploy indexes: `firebase deploy --only firestore:indexes`

### 6. Local Environment Setup

Create `.env.local` in project root:

```bash
# Get these from Firebase Console > Project Settings
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bespokeethos-analytics-475007.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bespokeethos-analytics-475007.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Regular Deployment Process

### Step 1: Pre-Deployment Checks

- [ ] All tests pass locally
- [ ] Build succeeds: `npm run build`
- [ ] Functions build: `cd functions && npm run build`
- [ ] No secrets in code (use Secret Manager)
- [ ] Environment variables configured
- [ ] Git branch is up to date

### Step 2: Deploy Functions

```bash
# Build functions
cd functions
npm run build
cd ..

# Deploy functions only
firebase deploy --only functions

# Or deploy specific function
firebase deploy --only functions:marketingBrief
```

**Expected Functions:**
- `competitorWatch`
- `contentDrafter`
- `marketingBrief`
- `opportunityScanner`
- `selfHealing`
- `scheduledSelfHealing`
- `scheduledOpportunityScanner`

### Step 3: Deploy Next.js Hosting

```bash
# Build Next.js
npm run build

# Deploy hosting
firebase deploy --only hosting
```

### Step 4: Deploy Firestore (if rules/indexes changed)

```bash
firebase deploy --only firestore
```

### Step 5: Full Deployment

```bash
# Deploy everything at once
firebase deploy
```

## Post-Deployment Verification

### 1. Check Function Deployment

```bash
# List deployed functions
firebase functions:list

# Check function logs
firebase functions:log
```

Or visit: https://console.cloud.google.com/functions?project=bespokeethos-analytics-475007

### 2. Verify Hosting

Visit: https://bespokeethos-analytics-475007.web.app

Check:
- [ ] Page loads correctly
- [ ] System status shows "Online"
- [ ] All buttons work
- [ ] Console shows no errors

### 3. Test Function Calls

From the deployed app:
- [ ] Click "Daily Brief" - should generate marketing brief
- [ ] Click "Competitors" - should check competitors
- [ ] Click "Content" - should draft content
- [ ] Click "Opportunities" - should find opportunities
- [ ] Click system status - should run self-healing

### 4. Verify Scheduled Functions

Check Cloud Scheduler: https://console.cloud.google.com/cloudscheduler?project=bespokeethos-analytics-475007

Should see:
- [ ] `scheduledSelfHealing` - runs every 15 minutes
- [ ] `scheduledOpportunityScanner` - runs daily at 9 AM EST

### 5. Check Firestore Data

Visit: https://console.cloud.google.com/firestore?project=bespokeethos-analytics-475007

Verify collections exist:
- [ ] `/system/health` - updated every 15 minutes
- [ ] `/opportunities/` - populated when high-priority opportunities found

### 6. Monitor Traces

Visit: https://console.cloud.google.com/traces?project=bespokeethos-analytics-475007

- [ ] Traces are being recorded
- [ ] No errors in traces
- [ ] Latency is acceptable (<3s for most calls)

## Rollback Procedure

If deployment fails or causes issues:

### Rollback Functions

```bash
# List previous versions
gcloud functions list --project=bespokeethos-analytics-475007

# Rollback specific function
gcloud functions deploy FUNCTION_NAME \
  --project=bespokeethos-analytics-475007 \
  --region=us-central1 \
  --source=PREVIOUS_SOURCE
```

### Rollback Hosting

```bash
# List previous hosting releases
firebase hosting:releases:list

# Rollback to previous release
firebase hosting:rollback
```

## Monitoring & Maintenance

### Daily Checks

- [ ] Check function logs for errors: `firebase functions:log`
- [ ] Verify scheduled tasks ran successfully
- [ ] Check system health in Firestore: `/system/health`

### Weekly Checks

- [ ] Review Vertex AI quota usage
- [ ] Check Cloud Functions billing
- [ ] Review error rates in Cloud Trace
- [ ] Update dependencies if needed

### Monthly Checks

- [ ] Review security rules
- [ ] Audit Secret Manager access
- [ ] Check for outdated dependencies
- [ ] Review and optimize function performance

## Common Issues & Solutions

### Issue: Functions Not Callable

**Cause**: CORS or authentication issues

**Solution**:
```bash
# Redeploy with proper CORS settings
firebase deploy --only functions
```

### Issue: Vertex AI Quota Exceeded

**Check quota**: https://console.cloud.google.com/iam-admin/quotas?project=bespokeethos-analytics-475007

**Solution**:
- Request quota increase
- Implement rate limiting
- Use caching more aggressively

### Issue: Function Timeout

**Solution**:
```typescript
// Increase timeout in function definition
export const myFunction = onCall(
  { 
    region: "us-central1",
    timeoutSeconds: 300,  // Increase from default 60s
    memory: "1GiB"        // Increase memory if needed
  },
  async (request) => { /* ... */ }
);
```

### Issue: Build Fails - Network Access

**Cause**: Trying to access external resources during build

**Solution**:
- Remove Google Fonts imports
- Use `@tailwind` directives (not `@import`)
- Ensure all plugins are in package.json
- Build must work offline

## Emergency Contacts

- **Project Owner**: contact@bespokeethos.com
- **Firebase Console**: https://console.firebase.google.com/project/bespokeethos-analytics-475007
- **Cloud Console**: https://console.cloud.google.com/?project=bespokeethos-analytics-475007

## Useful Commands

```bash
# Check what's deployed
firebase deploy --only hosting --dry-run
firebase deploy --only functions --dry-run

# View logs in real-time
firebase functions:log --only functionName --follow

# Test locally before deploying
firebase emulators:start

# Check function status
gcloud functions list --project=bespokeethos-analytics-475007

# Check billing
gcloud billing accounts list
gcloud billing projects describe bespokeethos-analytics-475007
```

## Success Criteria

Deployment is successful when:

✅ All functions deployed without errors
✅ Hosting site is accessible and loads correctly  
✅ All UI buttons trigger functions successfully
✅ Scheduled tasks appear in Cloud Scheduler
✅ No errors in function logs for 1 hour post-deployment
✅ System health check passes
✅ Traces show up in Cloud Trace
✅ Firestore collections are being updated
