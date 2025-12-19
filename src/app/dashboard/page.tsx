/**
 * Dashboard Overview Page
 * Shows key metrics and recent activity with live data
 */

'use client';

import { useEffect, useState } from 'react';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  highValueLeads: number;
  conversionRate: string;
  sessionsToday: number;
  pageviewsToday: number;
  lastGA4Sync: string | null;
  ga4SyncStatus: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  score: number;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, leadsRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/leads?limit=5'),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.data);
        }

        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          setLeads(leadsData.data?.leads || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const runFlow = async (flowName: string, endpoint: string) => {
    setActionLoading(flowName);
    try {
      const res = await fetch(endpoint, { method: 'POST' });
      if (res.ok) {
        alert(`${flowName} completed successfully!`);
      } else {
        alert(`${flowName} failed. Check console for details.`);
      }
    } catch (error) {
      console.error(`${flowName} error:`, error);
      alert(`${flowName} failed.`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={loading ? '--' : String(stats?.totalLeads || 0)}
          change={`+${stats?.newLeads || 0} new`}
          icon="👥"
        />
        <StatCard
          title="Sessions Today"
          value={loading ? '--' : String(stats?.sessionsToday || 0)}
          change={`${stats?.pageviewsToday || 0} views`}
          icon="📊"
        />
        <StatCard
          title="Conversion Rate"
          value={loading ? '--%' : stats?.conversionRate || '0%'}
          change="all time"
          icon="📈"
        />
        <StatCard
          title="High Value Leads"
          value={loading ? '--' : String(stats?.highValueLeads || 0)}
          change="score 75+"
          icon="⭐"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Recent Leads</h3>
            <a href="/dashboard/leads" className="text-sm text-blue-600 hover:underline">
              View all
            </a>
          </div>
          {loading ? (
            <LoadingSkeleton />
          ) : leads.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No leads yet</p>
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    <p className="text-sm text-gray-500">{lead.email}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                        lead.score >= 75
                          ? 'bg-green-100 text-green-700'
                          : lead.score >= 50
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {lead.score}
                    </span>
                    <p className="mt-1 text-xs capitalize text-gray-500">{lead.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">System Status</h3>
          <div className="space-y-4">
            <StatusItem
              label="GA4 Sync"
              status={stats?.ga4SyncStatus === 'success' ? 'healthy' : 'unknown'}
              detail={
                stats?.lastGA4Sync
                  ? `Last: ${new Date(stats.lastGA4Sync).toLocaleString()}`
                  : 'Not synced yet'
              }
            />
            <StatusItem label="Email Processor" status="healthy" detail="Every 15 min" />
            <StatusItem label="Competitor Watch" status="healthy" detail="Every 6 hours" />
            <StatusItem label="Firestore Backup" status="healthy" detail="Daily 2 AM UTC" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Quick Actions</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionButton
            label="Marketing Brief"
            description="Daily executive summary"
            icon="📝"
            loading={actionLoading === 'Marketing Brief'}
            onClick={() => runFlow('Marketing Brief', '/api/flows/marketing-brief')}
          />
          <ActionButton
            label="Competitor Watch"
            description="Check for changes"
            icon="🔎"
            loading={actionLoading === 'Competitor Watch'}
            onClick={() => runFlow('Competitor Watch', '/api/flows/competitor-watch')}
          />
          <ActionButton
            label="Draft Content"
            description="AI content generation"
            icon="📄"
            loading={actionLoading === 'Content Drafter'}
            onClick={() => runFlow('Content Drafter', '/api/flows/content-drafter')}
          />
          <ActionButton
            label="Scan Opportunities"
            description="Find new leads"
            icon="🎯"
            loading={actionLoading === 'Opportunity Scanner'}
            onClick={() => runFlow('Opportunity Scanner', '/api/flows/opportunity-scanner')}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm text-gray-500">{change}</span>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  description,
  icon,
  loading,
  onClick,
}: {
  label: string;
  description: string;
  icon: string;
  loading?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex flex-col items-start rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="text-2xl">{loading ? '⏳' : icon}</span>
      <span className="mt-2 font-medium text-gray-900">{label}</span>
      <span className="text-sm text-gray-500">{description}</span>
    </button>
  );
}

function StatusItem({
  label,
  status,
  detail,
}: {
  label: string;
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  detail: string;
}) {
  const colors = {
    healthy: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    unknown: 'bg-gray-400',
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className={`h-2 w-2 rounded-full ${colors[status]}`} />
        <span className="font-medium text-gray-700">{label}</span>
      </div>
      <span className="text-sm text-gray-500">{detail}</span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-12 rounded-lg bg-gray-200" />
      <div className="h-12 rounded-lg bg-gray-200" />
      <div className="h-12 rounded-lg bg-gray-200" />
    </div>
  );
}
