import { ReactNode } from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react'; // Placeholder for logo

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">LeadPilot</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
