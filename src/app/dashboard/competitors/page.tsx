/**
 * Competitors Dashboard Page
 * Monitor competitor changes and insights
 */

'use client';

import { useState } from 'react';

interface CompetitorChange {
  competitor: string;
  changeType: 'pricing' | 'messaging' | 'features' | 'design' | 'content';
  description: string;
  severity: 'low' | 'medium' | 'high';
  detectedAt: string;
}

interface CompetitorWatchResult {
  changes: CompetitorChange[];
  summary: string;
  actionRequired: boolean;
  confidence: number;
}

export default function CompetitorsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompetitorWatchResult | null>(null);
  const [checkType, setCheckType] = useState<'quick' | 'full'>('quick');

  const runCompetitorWatch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/flows/competitor-watch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkType }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data.result);
      } else {
        console.error('Competitor watch failed');
      }
    } catch (error) {
      console.error('Competitor watch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: CompetitorChange['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getChangeTypeIcon = (type: CompetitorChange['changeType']) => {
    switch (type) {
      case 'pricing':
        return '💰';
      case 'messaging':
        return '📢';
      case 'features':
        return '✨';
      case 'design':
        return '🎨';
      case 'content':
        return '📝';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Competitor Watch</h1>
          <p className="text-sm text-gray-500">Monitor competitor websites for changes</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={checkType}
            onChange={(e) => setCheckType(e.target.value as 'quick' | 'full')}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            aria-label="Check type"
          >
            <option value="quick">Quick Check</option>
            <option value="full">Full Analysis</option>
          </select>
          <button
            onClick={runCompetitorWatch}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Scanning...' : 'Run Scan'}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Summary */}
          <div
            className={`rounded-xl p-6 ${result.actionRequired ? 'border border-red-200 bg-red-50' : 'border border-green-200 bg-green-50'}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{result.actionRequired ? '⚠️' : '✅'}</span>
              <div>
                <h3 className="font-semibold text-gray-900">Summary</h3>
                <p className="mt-1 text-gray-700">{result.summary}</p>
                <p className="mt-2 text-sm text-gray-500">
                  Confidence: {Math.round(result.confidence * 100)}%
                </p>
              </div>
            </div>
          </div>

          {/* Changes List */}
          {result.changes.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Detected Changes</h3>
              {result.changes.map((change, index) => (
                <div
                  key={index}
                  className={`rounded-xl border p-4 ${getSeverityColor(change.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getChangeTypeIcon(change.changeType)}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium capitalize">{change.changeType} Change</h4>
                        <span className="text-xs">
                          {new Date(change.detectedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{change.description}</p>
                      <p className="mt-2 text-xs opacity-75">{change.competitor}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-gray-50 p-8 text-center">
              <span className="text-4xl">🔍</span>
              <p className="mt-4 text-gray-600">No changes detected since last scan.</p>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="rounded-xl bg-gray-50 p-12 text-center">
          <span className="text-5xl">🔍</span>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Ready to Scan</h3>
          <p className="mt-2 text-gray-600">
            Click &quot;Run Scan&quot; to check competitor websites for changes.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Quick Check: Content hash comparison
            <br />
            Full Analysis: AI-powered messaging and pricing detection
          </p>
        </div>
      )}
    </div>
  );
}
