/**
 * Settings Dashboard Page
 * Configure AI flows and integrations
 */

'use client';

import { useState } from 'react';

interface FlowConfig {
  name: string;
  description: string;
  enabled: boolean;
  schedule?: string;
  lastRun?: string;
}

export default function SettingsPage() {
  const [flows, setFlows] = useState<FlowConfig[]>([
    {
      name: 'Marketing Brief Generator',
      description: 'Generate weekly marketing briefs with AI insights',
      enabled: true,
      schedule: 'Daily at 9:00 AM',
      lastRun: new Date().toISOString(),
    },
    {
      name: 'Competitor Watch',
      description: 'Monitor competitor websites for changes',
      enabled: true,
      schedule: 'Every 6 hours',
      lastRun: new Date().toISOString(),
    },
    {
      name: 'Self-Healing System',
      description: 'Automatic error detection and recovery',
      enabled: true,
      schedule: 'Every 15 minutes',
      lastRun: new Date().toISOString(),
    },
    {
      name: 'GA4 Data Sync',
      description: 'Sync analytics data from Google Analytics',
      enabled: true,
      schedule: 'Hourly',
      lastRun: new Date().toISOString(),
    },
    {
      name: 'Lead Nurture Emails',
      description: 'Automated email sequences for leads',
      enabled: true,
      schedule: 'Daily at 10:00 AM',
      lastRun: new Date().toISOString(),
    },
  ]);

  const toggleFlow = (index: number) => {
    setFlows((prev) =>
      prev.map((flow, i) => (i === index ? { ...flow, enabled: !flow.enabled } : flow))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Configure AI flows and system settings</p>
      </div>

      {/* AI Flows */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">AI Flows</h2>
        <p className="mt-1 text-sm text-gray-500">Manage automated AI workflows</p>

        <div className="mt-6 divide-y">
          {flows.map((flow, index) => (
            <div key={flow.name} className="flex items-center justify-between py-4">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{flow.name}</h3>
                <p className="text-sm text-gray-500">{flow.description}</p>
                {flow.schedule && (
                  <p className="mt-1 text-xs text-gray-400">Schedule: {flow.schedule}</p>
                )}
              </div>
              <button
                onClick={() => toggleFlow(index)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  flow.enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                aria-label={`Toggle ${flow.name}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    flow.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
        <p className="mt-1 text-sm text-gray-500">Connected services and APIs</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <IntegrationCard
            name="Google Analytics 4"
            status="connected"
            icon="📊"
            description="bespokeethos-analytics-475007"
          />
          <IntegrationCard
            name="Firebase"
            status="connected"
            icon="🔥"
            description="Firestore, Functions, Hosting"
          />
          <IntegrationCard
            name="Vertex AI"
            status="connected"
            icon="🤖"
            description="Gemini 2.5 Flash & Pro"
          />
          <IntegrationCard
            name="Slack"
            status="configured"
            icon="💬"
            description="Alerts and notifications"
          />
          <IntegrationCard
            name="Sentry"
            status="configured"
            icon="🐛"
            description="Error tracking"
          />
          <IntegrationCard
            name="SendGrid"
            status="pending"
            icon="📧"
            description="Email delivery"
          />
        </div>
      </div>

      {/* System Info */}
      <div className="rounded-xl bg-gray-50 p-6">
        <h2 className="text-lg font-semibold text-gray-900">System Information</h2>
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <span className="text-gray-500">Project ID:</span>
            <span className="ml-2 font-mono text-gray-900">bespokeethos-analytics-475007</span>
          </div>
          <div>
            <span className="text-gray-500">Region:</span>
            <span className="ml-2 text-gray-900">us-central1</span>
          </div>
          <div>
            <span className="text-gray-500">Framework:</span>
            <span className="ml-2 text-gray-900">Next.js 14 + Firebase</span>
          </div>
          <div>
            <span className="text-gray-500">AI Engine:</span>
            <span className="ml-2 text-gray-900">Firebase Genkit + Vertex AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationCard({
  name,
  status,
  icon,
  description,
}: {
  name: string;
  status: 'connected' | 'configured' | 'pending';
  icon: string;
  description: string;
}) {
  const statusColors = {
    connected: 'bg-green-100 text-green-700',
    configured: 'bg-blue-100 text-blue-700',
    pending: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">{name}</h3>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[status]}`}
          >
            {status}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
