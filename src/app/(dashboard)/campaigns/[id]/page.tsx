import { Suspense } from 'react';
import Link from 'next/link';
import { getCampaignById } from '../actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Archive, ArrowLeft, Mail, Users, Inbox, Settings } from 'lucide-react';

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await getCampaignById(id);

  if (!campaign) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-semibold mb-2">Campaign not found</h2>
        <Button asChild className="mt-4">
          <Link href="/campaigns">Back to Campaigns</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/campaigns"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
            <Badge variant={campaign.status === 'RUNNING' ? 'default' : 'secondary'}>
              {campaign.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Created on {new Date(campaign.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          {campaign.status === 'RUNNING' ? (
            <form action={async () => { 'use server'; /* await pauseCampaign(id) */ }}>
              <Button variant="outline" className="gap-2">
                <Pause className="h-4 w-4" /> Pause
              </Button>
            </form>
          ) : (
            <form action={async () => { 'use server'; /* await launchCampaign(id) */ }}>
              <Button variant="default" className="gap-2">
                <Play className="h-4 w-4" /> Launch
              </Button>
            </form>
          )}
          <Button variant="ghost" size="icon">
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: 'Prospects', value: campaign.stats.prospects },
          { label: 'Sent', value: campaign.stats.sent },
          { label: 'Delivered', value: campaign.stats.delivered },
          { label: 'Opened', value: campaign.stats.opened },
          { label: 'Clicked', value: campaign.stats.clicked },
          { label: 'Replied', value: campaign.stats.replied, highlight: true },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${stat.highlight ? 'text-green-600' : ''}`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="prospects" className="mt-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="prospects"><Users className="h-4 w-4 mr-2" /> Prospects</TabsTrigger>
          <TabsTrigger value="emails"><Mail className="h-4 w-4 mr-2" /> Emails</TabsTrigger>
          <TabsTrigger value="replies"><Inbox className="h-4 w-4 mr-2" /> Replies</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="h-4 w-4 mr-2" /> Settings</TabsTrigger>
        </TabsList>
        <div className="mt-6 border rounded-lg bg-card min-h-[400px] p-6">
          <TabsContent value="prospects">
            <h3 className="text-lg font-semibold mb-4">Enrolled Prospects</h3>
            <p className="text-sm text-muted-foreground">Prospect list placeholder.</p>
          </TabsContent>
          <TabsContent value="emails">
            <h3 className="text-lg font-semibold mb-4">Email Delivery Log</h3>
            <p className="text-sm text-muted-foreground">Sent emails placeholder.</p>
          </TabsContent>
          <TabsContent value="replies">
            <h3 className="text-lg font-semibold mb-4">Campaign Replies</h3>
            <p className="text-sm text-muted-foreground">Replies list placeholder.</p>
          </TabsContent>
          <TabsContent value="settings">
            <h3 className="text-lg font-semibold mb-4">Campaign Settings</h3>
            <p className="text-sm text-muted-foreground">Settings form placeholder.</p>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
