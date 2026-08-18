import { getNotifications } from './actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Flame, MessageSquare, UserX, AlertTriangle, FileBarChart, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default async function NotificationsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const typeFilter = resolvedParams.type as string | undefined;
  
  const notifications = await getNotifications({ type: typeFilter });

  const getIcon = (type: string) => {
    switch (type) {
      case 'REPLY': return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'HOT_LEAD': return <Flame className="h-5 w-5 text-orange-500" />;
      case 'UNSUBSCRIBE': return <UserX className="h-5 w-5 text-gray-500" />;
      case 'BOUNCE': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'CAMPAIGN_ERROR': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'DAILY_REPORT': return <FileBarChart className="h-5 w-5 text-purple-500" />;
      default: return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="default" className="rounded-full">{unreadCount} new</Badge>
          )}
        </div>
        <Button variant="outline" size="sm">
          <CheckCheck className="h-4 w-4 mr-2" /> Mark all as read
        </Button>
      </div>

      <div className="flex gap-2 pb-4 border-b overflow-x-auto">
        <Link href="/notifications"><Badge variant={!typeFilter ? 'default' : 'secondary'}>All</Badge></Link>
        <Link href="/notifications?type=REPLY"><Badge variant={typeFilter === 'REPLY' ? 'default' : 'secondary'}>Replies</Badge></Link>
        <Link href="/notifications?type=HOT_LEAD"><Badge variant={typeFilter === 'HOT_LEAD' ? 'default' : 'secondary'}>Hot Leads</Badge></Link>
        <Link href="/notifications?type=UNSUBSCRIBE"><Badge variant={typeFilter === 'UNSUBSCRIBE' ? 'default' : 'secondary'}>Unsubscribes</Badge></Link>
        <Link href="/notifications?type=DAILY_REPORT"><Badge variant={typeFilter === 'DAILY_REPORT' ? 'default' : 'secondary'}>Reports</Badge></Link>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center p-12 text-muted-foreground border rounded-lg border-dashed">
            <Bell className="h-8 w-8 mx-auto mb-4 opacity-20" />
            <p>No notifications found.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <Link key={notif.id} href={notif.linkUrl || '#'} className="block">
              <Card className={`transition-colors hover:bg-muted/50 ${!notif.read ? 'border-l-4 border-l-blue-500 shadow-sm' : 'opacity-75'}`}>
                <CardContent className="p-4 flex gap-4">
                  <div className="mt-1 flex-shrink-0 bg-background rounded-full p-2 border">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <p className={`text-sm ${!notif.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                        {notif.message}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4" suppressHydrationWarning>
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    {notif.prospect && (
                      <p className="text-xs text-primary">
                        Related: {notif.prospect.companyName || notif.prospect.name}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
