import { getApps, initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { NextResponse } from 'next/server';

// Initialize Firebase client SDK
if (getApps().length === 0) {
  initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const functions = getFunctions();
    const submitLead = httpsCallable(functions, 'submitLead');

    const result = await submitLead(body);

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit lead' }, { status: 500 });
  }
}
