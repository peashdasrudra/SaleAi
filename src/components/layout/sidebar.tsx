'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Search,
  Send,
  CheckCircle,
  Inbox,
  ListTodo,
  BarChart3,
  ShieldBan,
  Settings,
  Rocket,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Prospects', href: '/prospects' },
  { icon: Search, label: 'Research', href: '/research' },
  { icon: Send, label: 'Campaigns', href: '/campaigns' },
  { icon: CheckCircle, label: 'Email Approval', href: '/email-approval' },
  { icon: Inbox, label: 'Inbox', href: '/inbox' },
  { icon: ListTodo, label: 'Tasks', href: '/tasks' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: ShieldBan, label: 'Suppression', href: '/suppression' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 text-ink">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">LeadPilot</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="mx-auto flex h-full items-center justify-center">
            <Rocket className="h-6 w-6 text-primary" />
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
            isCollapsed && "hidden"
          )}
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="mx-auto mt-2 rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <Separator className="bg-border" />

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                  <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive ? "bg-white shadow-[0_1px_2px_rgba(15,15,15,0.05)] text-primary font-semibold" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    isCollapsed && "justify-center px-0"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator className="bg-border" />

      <div className="p-4">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-sidebar-foreground">
                {user?.name || "User"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user?.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
