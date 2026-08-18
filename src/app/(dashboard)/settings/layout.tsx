import Link from 'next/link';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full max-w-6xl mx-auto py-8">
      <aside className="w-64 pr-8">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        <nav className="space-y-1">
          <Link href="/settings" className="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium">
            General
          </Link>
          <Link href="/settings/scoring" className="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium">
            Scoring Rules
          </Link>
          <div className="block px-3 py-2 rounded-md text-gray-400 text-sm font-medium">
            Email Provider (Coming Soon)
          </div>
          <div className="block px-3 py-2 rounded-md text-gray-400 text-sm font-medium">
            AI Provider (Coming Soon)
          </div>
          <div className="block px-3 py-2 rounded-md text-gray-400 text-sm font-medium">
            Notifications (Coming Soon)
          </div>
          <div className="block px-3 py-2 rounded-md text-gray-400 text-sm font-medium">
            Compliance (Coming Soon)
          </div>
        </nav>
      </aside>
      <main className="flex-1 pl-8 border-l border-gray-200">
        {children}
      </main>
    </div>
  );
}
