import { Metadata } from 'next';
import { Users, Star, Clock, MessageSquare, Flame, ListTodo, Send, Shield } from 'lucide-react';
import { StatsCard } from '@/components/analytics/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Dashboard | LeadPilot',
  description: 'LeadPilot dashboard overview',
};

// Dummy activity data
const RECENT_ACTIVITY = [
  { id: '1', action: 'New reply received', detail: 'John Doe from Acme Corp replied to "Q3 Tech Outreach"', time: '10 minutes ago' },
  { id: '2', action: 'Campaign completed', detail: '"Enterprise Leaders" campaign finished sending', time: '1 hour ago' },
  { id: '3', action: 'Prospects added', detail: '250 new prospects imported from CSV', time: '3 hours ago' },
  { id: '4', action: 'Emails approved', detail: 'You approved 45 emails for sending', time: '5 hours ago' },
  { id: '5', action: 'Task completed', detail: 'Follow up with priority leads', time: 'Yesterday' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your campaigns today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Prospects"
          value="12,405"
          icon={Users}
          trend={12.5}
          color="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="A-Priority Leads"
          value="84"
          icon={Star}
          trend={5.2}
          color="bg-amber-100 text-amber-600"
        />
        <StatsCard
          title="Awaiting Approval"
          value="156"
          icon={Clock}
          color="bg-purple-100 text-purple-600"
        />
        <StatsCard
          title="Replies Today"
          value="24"
          icon={MessageSquare}
          trend={-2.4}
          color="bg-green-100 text-green-600"
        />
        <StatsCard
          title="Hot Leads"
          value="12"
          icon={Flame}
          trend={18.0}
          color="bg-red-100 text-red-600"
        />
        <StatsCard
          title="Next Tasks"
          value="8"
          icon={ListTodo}
          color="bg-orange-100 text-orange-600"
        />
        <StatsCard
          title="Running Campaigns"
          value="3"
          icon={Send}
          trend={0}
          color="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Deliverability"
          value="99.2%"
          icon={Shield}
          trend={0.1}
          color="bg-green-100 text-green-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {RECENT_ACTIVITY.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.detail}</p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions placeholder */}
        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-slate-50 p-4 hover:bg-slate-100 cursor-pointer transition-colors">
              <h4 className="font-semibold text-sm">Create New Campaign</h4>
              <p className="text-xs text-muted-foreground mt-1">Set up a new automated email sequence.</p>
            </div>
            <div className="rounded-lg border bg-slate-50 p-4 hover:bg-slate-100 cursor-pointer transition-colors">
              <h4 className="font-semibold text-sm">Review Pending Emails</h4>
              <p className="text-xs text-muted-foreground mt-1">You have 156 emails waiting for your approval.</p>
            </div>
            <div className="rounded-lg border bg-slate-50 p-4 hover:bg-slate-100 cursor-pointer transition-colors">
              <h4 className="font-semibold text-sm">Import Prospects</h4>
              <p className="text-xs text-muted-foreground mt-1">Upload a CSV or sync from CRM.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
