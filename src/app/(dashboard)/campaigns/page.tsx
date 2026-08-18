import { Suspense } from 'react';
import Link from 'next/link';
import { getCampaigns } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Settings, Archive, Plus } from 'lucide-react';

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const campaigns = await getCampaigns({ status });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your outbound email campaigns.
          </p>
        </div>
        <Button asChild>
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Link>
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <div className="p-12 text-center border rounded-lg border-dashed">
          <h2 className="text-xl font-semibold mb-2">No campaigns found</h2>
          <p className="text-muted-foreground mb-4">Start by creating your first outreach campaign.</p>
          <Button asChild>
            <Link href="/campaigns/new">Create Campaign</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="flex flex-col">
              <CardHeader className="pb-4 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      <Link href={`/campaigns/${campaign.id}`} className="hover:underline">
                        {campaign.name}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                      <span title={campaign.targetCountry}>{campaign.targetCountry === 'US' ? '🇺🇸' : '🇬🇧'}</span>
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={campaign.status === 'RUNNING' ? 'default' : 'secondary'}>
                    {campaign.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-4">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {campaign.offer}
                </p>
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="font-semibold text-lg">{campaign.prospectCount}</div>
                    <div className="text-muted-foreground text-xs">Prospects</div>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{campaign.sentCount}</div>
                    <div className="text-muted-foreground text-xs">Sent</div>
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-green-600">{campaign.repliedCount}</div>
                    <div className="text-muted-foreground text-xs">Replies</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4 flex justify-between bg-muted/10">
                <div className="flex gap-2">
                  {campaign.status === 'RUNNING' ? (
                    <Button variant="outline" size="icon" title="Pause">
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="icon" title="Launch/Resume">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="icon" title="Settings">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon" title="Archive">
                  <Archive className="h-4 w-4 text-muted-foreground" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
