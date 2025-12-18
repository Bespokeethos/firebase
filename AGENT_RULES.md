# 🤖 AGENT RULES - FIREBASE REPOSITORY

## THIS IS THE WRITABLE REPOSITORY FOR AI AGENTS

| Permission | Status               |
| ---------- | -------------------- |
| READ       | ✅ ALLOWED           |
| WRITE      | ✅ ALLOWED           |
| COMMIT     | ✅ ALLOWED           |
| PUSH       | ✅ ALLOWED           |
| DELETE     | ⚠️ REQUIRES APPROVAL |

---

## REPOSITORY INFO

| Field          | Value                              |
| -------------- | ---------------------------------- |
| **Repo**       | `Bespokeethos/firebase`            |
| **Project ID** | `bespokeethos-analytics-475007`    |
| **Region**     | `us-central1`                      |
| **Billing**    | `01D82D-EE885B-C29459`             |
| **Deploy**     | Firebase Hosting + Cloud Functions |

---

## 🔴 READ-ONLY REPOSITORIES (NEVER MODIFY)

### bespoke-ethos

- **Purpose:** B2B consulting website
- **Deploy:** Vercel (NOT Firebase)
- **URL:** https://bespokeethos.com
- **Access:** READ ONLY for data/context

### GMFG (gaymensfieldguide)

- **Purpose:** Lifestyle website
- **Deploy:** Vercel (NOT Firebase)
- **URL:** https://gaymensfieldguide.com
- **Access:** READ ONLY for data/context

---

## TECH STACK (MANDATORY)

```yaml
Framework: Next.js 14 (App Router)
Language: TypeScript (strict mode)
AI Framework: Firebase Genkit
AI Provider: Vertex AI (NOT Google AI in production)
Database: Cloud Firestore + Vector Search
Functions: Cloud Functions 2nd Gen
Validation: Zod schemas
Styling: Tailwind CSS + Shadcn/UI
Secrets: Google Secret Manager (NEVER .env)
```

---

## AI MODELS

```typescript
DEFAULT: "gemini-2.5-flash"; // 90% of operations
ESCALATION: "gemini-2.5-pro"; // Complex decisions
EMBEDDINGS: "text-embedding-004";
```

---

## SAFETY PROTOCOLS

### Before Destructive Actions

```typescript
if (
  action.type === "DELETE" ||
  action.type === "PAYMENT" ||
  action.type === "PUBLISH"
) {
  await requireUserApproval(action);
}
```

### Confidence Thresholds

| Confidence | Action                      |
| ---------- | --------------------------- |
| >90%       | Execute autonomously        |
| 70-90%     | Execute with logging        |
| <70%       | HALT - Request human review |

### Hallucination Prevention

- NEVER invent data or metrics
- Ground all outputs in real API responses
- Cite sources for all claims
- If data unavailable, SAY SO

---

## VERIFICATION CHAIN

Before any action:

1. ✅ Am I in the correct repository? (`firebase`)
2. ✅ Is this action within my permissions?
3. ✅ Do I have real data to support this?
4. ✅ Is my confidence above 70%?

---

## DEPLOYMENT

```bash
# Full deploy
firebase deploy --project bespokeethos-analytics-475007

# Functions only
firebase deploy --only functions

# Hosting only
firebase deploy --only hosting
```

---

## BROWSER/ENVIRONMENT NOTES

- Use Chrome with `contact@bespokeethos.com`
- pnpm is installed globally
- Firebase Studio: https://studio.firebase.google.com

---

**BUILD FREELY HERE - THIS IS YOUR SANDBOX.**
