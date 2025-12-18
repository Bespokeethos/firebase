export default function Home() {
  return (
    <main className="min-h-screen safe-top safe-bottom p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Prometheus AI</h1>
        <p className="text-gray-400 text-sm">Executive Prosthetic</p>
      </header>

      <section className="space-y-4">
        {/* Status Card */}
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">System Status</span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <p className="text-lg font-medium">Online</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-zinc-900 hover:bg-zinc-800 rounded-xl p-4 border border-zinc-800 text-left transition-colors">
            <span className="text-2xl mb-2 block">📊</span>
            <span className="font-medium">Daily Brief</span>
          </button>
          <button className="bg-zinc-900 hover:bg-zinc-800 rounded-xl p-4 border border-zinc-800 text-left transition-colors">
            <span className="text-2xl mb-2 block">🔍</span>
            <span className="font-medium">Competitors</span>
          </button>
          <button className="bg-zinc-900 hover:bg-zinc-800 rounded-xl p-4 border border-zinc-800 text-left transition-colors">
            <span className="text-2xl mb-2 block">✍️</span>
            <span className="font-medium">Content</span>
          </button>
          <button className="bg-zinc-900 hover:bg-zinc-800 rounded-xl p-4 border border-zinc-800 text-left transition-colors">
            <span className="text-2xl mb-2 block">🎯</span>
            <span className="font-medium">Opportunities</span>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <h2 className="text-sm text-gray-400 mb-3">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center text-sm">
                ✓
              </span>
              <div>
                <p className="text-sm font-medium">Morning brief generated</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center text-sm">
                ⚡
              </span>
              <div>
                <p className="text-sm font-medium">Competitor scan complete</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
