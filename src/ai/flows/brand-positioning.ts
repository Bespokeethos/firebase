/**
 * Brand Positioning Flow
 * Generates comprehensive brand strategy using Gemini Flash
 */

import { defineFlow } from '@genkit-ai/flow';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { z } from 'zod';
import { ai } from '../genkit';

// Input Schema
const BrandInputSchema = z.object({
  companyName: z.string().min(1),
  industry: z.string().min(1),
  targetAudience: z.string().min(1),
  currentPositioning: z.string().optional(),
  competitors: z.array(z.string()).optional(),
  uniqueStrengths: z.array(z.string()).optional(),
  businessGoals: z.string().optional(),
});

// Output Schema
const BrandPositioningSchema = z.object({
  positioningStatement: z.string(),
  valueProposition: z.string(),
  brandPillars: z.array(
    z.object({
      pillar: z.string(),
      description: z.string(),
      proofPoints: z.array(z.string()),
    })
  ),
  targetPersonas: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      painPoints: z.array(z.string()),
      motivations: z.array(z.string()),
    })
  ),
  competitiveDifferentiators: z.array(z.string()),
  messagingFramework: z.object({
    headline: z.string(),
    subheadline: z.string(),
    keyMessages: z.array(z.string()),
    callToAction: z.string(),
  }),
  toneOfVoice: z.object({
    attributes: z.array(z.string()),
    doExamples: z.array(z.string()),
    dontExamples: z.array(z.string()),
  }),
  confidence: z.number().min(0).max(1),
  generatedAt: z.string(),
});

type BrandInput = z.infer<typeof BrandInputSchema>;
type BrandPositioning = z.infer<typeof BrandPositioningSchema>;

export const brandPositioningFlow = defineFlow(
  {
    name: 'brandPositioning',
    inputSchema: BrandInputSchema,
    outputSchema: BrandPositioningSchema,
  },
  async (input: BrandInput): Promise<BrandPositioning> => {
    const db = getFirestore();
    const startTime = Date.now();

    try {
      // Check cache first (7 day TTL per cost rules)
      const cacheKey = `brand_${input.companyName.toLowerCase().replace(/\s+/g, '_')}`;
      const cacheRef = db.collection('cache').doc(cacheKey);
      const cached = await cacheRef.get();

      if (cached.exists) {
        const data = cached.data();
        const cachedAt = data?.cachedAt?.toDate?.() || new Date(0);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        if (cachedAt > sevenDaysAgo) {
          console.log('CACHE_HIT', { flow: 'brandPositioning', cacheKey });
          return data?.positioning as BrandPositioning;
        }
      }

      // Build the prompt
      const prompt = buildBrandPrompt(input);

      // Use gemini-2.0-flash (default per cost rules)
      const { text } = await ai.generate({
        model: 'vertexai/gemini-2.0-flash-exp',
        prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      });

      // Parse and validate response
      const positioning = parseAndValidateResponse(text, input);

      // Cache the result
      await cacheRef.set({
        positioning,
        cachedAt: FieldValue.serverTimestamp(),
        input,
      });

      // Log flow execution
      await db.collection('flows').add({
        name: 'brandPositioning',
        input,
        output: positioning,
        durationMs: Date.now() - startTime,
        success: true,
        timestamp: FieldValue.serverTimestamp(),
      });

      console.log('FLOW_SUCCESS', {
        flow: 'brandPositioning',
        company: input.companyName,
        durationMs: Date.now() - startTime,
      });

      return positioning;
    } catch (error) {
      // Log error
      await db.collection('flows').add({
        name: 'brandPositioning',
        input,
        error: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - startTime,
        success: false,
        timestamp: FieldValue.serverTimestamp(),
      });

      console.error('FLOW_ERROR', {
        flow: 'brandPositioning',
        step: 'generate',
        details: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }
);

function buildBrandPrompt(input: BrandInput): string {
  return `You are an expert brand strategist. Generate a comprehensive brand positioning for:

**Company:** ${input.companyName}
**Industry:** ${input.industry}
**Target Audience:** ${input.targetAudience}
${input.currentPositioning ? `**Current Positioning:** ${input.currentPositioning}` : ''}
${input.competitors?.length ? `**Competitors:** ${input.competitors.join(', ')}` : ''}
${input.uniqueStrengths?.length ? `**Unique Strengths:** ${input.uniqueStrengths.join(', ')}` : ''}
${input.businessGoals ? `**Business Goals:** ${input.businessGoals}` : ''}

Respond with a JSON object matching this exact structure:
{
  "positioningStatement": "For [target audience] who [need], [company] is the [category] that [key benefit] because [reason to believe].",
  "valueProposition": "Clear value prop in one sentence",
  "brandPillars": [
    {
      "pillar": "Pillar name",
      "description": "What this pillar means",
      "proofPoints": ["Evidence 1", "Evidence 2", "Evidence 3"]
    }
  ],
  "targetPersonas": [
    {
      "name": "Persona Name",
      "description": "Brief description",
      "painPoints": ["Pain 1", "Pain 2"],
      "motivations": ["Motivation 1", "Motivation 2"]
    }
  ],
  "competitiveDifferentiators": ["Differentiator 1", "Differentiator 2", "Differentiator 3"],
  "messagingFramework": {
    "headline": "Main headline",
    "subheadline": "Supporting message",
    "keyMessages": ["Message 1", "Message 2", "Message 3"],
    "callToAction": "Primary CTA"
  },
  "toneOfVoice": {
    "attributes": ["Attribute 1", "Attribute 2", "Attribute 3"],
    "doExamples": ["Do this", "And this"],
    "dontExamples": ["Don't do this", "Or this"]
  }
}

Provide 3 brand pillars, 2-3 target personas, and ensure all arrays have at least 2-3 items.
Return ONLY valid JSON, no markdown or explanation.`;
}

function parseAndValidateResponse(text: string, input: BrandInput): BrandPositioning {
  // Clean the response (remove markdown if present)
  let cleanText = text.trim();
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.slice(7);
  }
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.slice(3);
  }
  if (cleanText.endsWith('```')) {
    cleanText = cleanText.slice(0, -3);
  }
  cleanText = cleanText.trim();

  try {
    const parsed = JSON.parse(cleanText);

    // Add metadata
    return {
      ...parsed,
      confidence: 0.85, // Default confidence for Flash model
      generatedAt: new Date().toISOString(),
    };
  } catch {
    console.error('PARSE_ERROR', {
      flow: 'brandPositioning',
      rawText: text.substring(0, 500),
    });

    // Return fallback structure
    return {
      positioningStatement: `For ${input.targetAudience} in the ${input.industry} space, ${input.companyName} delivers exceptional value.`,
      valueProposition: `${input.companyName} helps ${input.targetAudience} achieve their goals.`,
      brandPillars: [
        {
          pillar: 'Quality',
          description: 'Commitment to excellence',
          proofPoints: ['Industry expertise', 'Proven results'],
        },
      ],
      targetPersonas: [
        {
          name: 'Primary Buyer',
          description: input.targetAudience,
          painPoints: ['Needs better solutions'],
          motivations: ['Business growth'],
        },
      ],
      competitiveDifferentiators: ['Unique approach', 'Expert team'],
      messagingFramework: {
        headline: `${input.companyName}: Your Partner in ${input.industry}`,
        subheadline: 'Delivering results that matter',
        keyMessages: ['Trusted expertise', 'Proven results'],
        callToAction: 'Get Started Today',
      },
      toneOfVoice: {
        attributes: ['Professional', 'Approachable', 'Confident'],
        doExamples: ['Be clear and direct', 'Show empathy'],
        dontExamples: ['Use jargon', 'Be condescending'],
      },
      confidence: 0.5, // Lower confidence for fallback
      generatedAt: new Date().toISOString(),
    };
  }
}
