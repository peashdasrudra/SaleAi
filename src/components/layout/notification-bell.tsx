'use client';

import { useState } from 'react';
import { Bell, Check, Info, AlertCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Dummy data
const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'info', message: 'Campaign "Q3 Tech Outreach" started.', timestamp: new Date(Date.now() - 1000 * 60 * 30), read: false },
  { id: '2', type: 'success', message: '15 emails await your approval.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), read: false },
  { id: '3', type: 'alert', message: 'High bounce rate detected on Campaign X.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), read: true },
];

const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <Check className="h-4 w-4 text-green-500" />;
      case 'alert': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5 text-slate-600" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-0 text-[10px] text-white hover:bg-red-600"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="font-semibold text-slate-900">Notifications</h4>
          <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 border-b p-4 text-sm transition-colors hover:bg-slate-50",
                  !notification.read && "bg-blue-50/50"
                )}
              >
                <div className="mt-0.5 shrink-0 rounded-full bg-white p-1 shadow-sm">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className={cn("text-slate-900", !notification.read && "font-medium")}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {timeAgo(notification.timestamp)}
                  </p>
                </div>
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 shrink-0" 
                    onClick={() => markAsRead(notification.id)}
                    title="Mark as read"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
        <div className="border-t p-2">
          <Link href="/notifications" className="block w-full">
            <Button variant="ghost" className="w-full text-xs" size="sm">
              View all notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
