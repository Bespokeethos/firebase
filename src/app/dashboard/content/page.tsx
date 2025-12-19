/**
 * Content Dashboard Page
 * Generate and manage AI-powered content
 */

'use client';

import { useState } from 'react';

interface ContentResult {
  drafts: Array<{
    platform: string;
    content: string;
    hashtags?: string[];
    characterCount: number;
  }>;
  brief: {
    headline: string;
    keyMessages: string[];
    targetAudience: string;
    callToAction: string;
  };
  confidence: number;
}

export default function ContentPage() {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<ContentResult | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'linkedin',
    'twitter',
    'email',
  ]);

  const platforms = [
    { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { id: 'twitter', label: 'Twitter/X', icon: '🐦' },
    { id: 'email', label: 'Email', icon: '📧' },
    { id: 'blog', label: 'Blog', icon: '📝' },
    { id: 'instagram', label: 'Instagram', icon: '📸' },
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((p) => p !== platformId) : [...prev, platformId]
    );
  };

  const generateContent = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/flows/content-drafter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          platforms: selectedPlatforms,
          tone: 'professional',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data.result);
      }
    } catch (error) {
      console.error('Content generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Generator</h1>
        <p className="text-sm text-gray-500">Generate AI-powered content for multiple platforms</p>
      </div>

      {/* Input Form */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Topic or Theme
            </label>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Describe the content you want to create..."
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Platforms</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedPlatforms.includes(platform.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{platform.icon}</span>
                  <span>{platform.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateContent}
            disabled={loading || !topic.trim() || selectedPlatforms.length === 0}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Content'}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Brief */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <h3 className="text-lg font-semibold text-gray-900">Content Brief</h3>
            <div className="mt-4 space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Headline:</span>
                <p className="text-gray-900">{result.brief.headline}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Target Audience:</span>
                <p className="text-gray-900">{result.brief.targetAudience}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Key Messages:</span>
                <ul className="mt-1 list-inside list-disc text-gray-900">
                  {result.brief.keyMessages.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Call to Action:</span>
                <p className="text-gray-900">{result.brief.callToAction}</p>
              </div>
            </div>
          </div>

          {/* Drafts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Platform Drafts</h3>
            {result.drafts.map((draft, index) => (
              <div key={index} className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium capitalize text-gray-900">{draft.platform}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{draft.characterCount} chars</span>
                    <button
                      onClick={() => copyToClipboard(draft.content)}
                      className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-gray-700">{draft.content}</p>
                {draft.hashtags && draft.hashtags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {draft.hashtags.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="rounded-xl bg-gray-50 p-12 text-center">
          <span className="text-5xl">✍️</span>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Ready to Create</h3>
          <p className="mt-2 text-gray-600">
            Enter a topic and select platforms to generate AI-powered content.
          </p>
        </div>
      )}
    </div>
  );
}
