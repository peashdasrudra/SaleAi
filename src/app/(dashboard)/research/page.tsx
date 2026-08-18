import { Suspense } from 'react';
import { getResearchQueue } from './actions';
import { EvidencePanel } from '@/components/prospects/evidence-panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Building2, Mail, Phone, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default async function ResearchQueuePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  const statusFilter = resolvedSearchParams.status as string | undefined;
  
  const prospects = await getResearchQueue({ status: statusFilter });

  const queueCounts = {
    NEW: prospects.filter(p => p.researchStatus === 'NEW').length,
    QUEUED: prospects.filter(p => p.researchStatus === 'QUEUED').length,
    IN_PROGRESS: prospects.filter(p => p.researchStatus === 'IN_PROGRESS').length,
    REVIEW_REQUIRED: prospects.filter(p => p.researchStatus === 'REVIEW_REQUIRED').length,
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Research Queue</h1>
          <p className="text-muted-foreground">Manage and review prospect evidence</p>
        </div>
        <div className="flex gap-4">
          <Select defaultValue={statusFilter || 'all'}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="NEW">New ({queueCounts.NEW})</SelectItem>
              <SelectItem value="QUEUED">Queued ({queueCounts.QUEUED})</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress ({queueCounts.IN_PROGRESS})</SelectItem>
              <SelectItem value="REVIEW_REQUIRED">Review Required ({queueCounts.REVIEW_REQUIRED})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Queue */}
        <div className="w-[40%] border-r overflow-y-auto p-4 space-y-4">
          {prospects.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No prospects in research queue.
            </div>
          ) : (
            prospects.map(prospect => (
              <Card key={prospect.id} className="cursor-pointer hover:border-primary transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-lg">{prospect.companyName || prospect.contactFullName}</div>
                    <Badge variant={
                      prospect.researchStatus === 'REVIEW_REQUIRED' ? 'destructive' : 
                      prospect.researchStatus === 'IN_PROGRESS' ? 'default' : 'secondary'
                    }>
                      {prospect.researchStatus}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {prospect.website && (
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" /> {prospect.website}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 text-xs">
                    <Badge variant="outline">Priority: {prospect.priority || 'MEDIUM'}</Badge>
                    <Badge variant="outline">Score: {prospect.totalScore || 0}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Right Panel - Details & Evidence */}
        <div className="w-[60%] overflow-y-auto p-4">
          {prospects.length > 0 ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{prospects[0].companyName || prospects[0].contactFullName}</span>
                    {prospects[0].website && (
                      <Link href={prospects[0].website.startsWith('http') ? prospects[0].website : `https://${prospects[0].website}`} target="_blank" className="text-primary hover:underline text-sm flex items-center gap-1">
                        Visit Website <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {prospects[0].businessEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{prospects[0].businessEmail}</span>
                      </div>
                    )}
                    {prospects[0].publicBusinessPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{prospects[0].publicBusinessPhone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="default" size="sm">Mark as Complete</Button>
                    <Button variant="outline" size="sm">Needs More Review</Button>
                    <Button variant="secondary" size="sm">Recalculate Score</Button>
                    <Button variant="secondary" size="sm">Generate Email Draft</Button>
                    <Button variant="destructive" size="sm">Mark Do Not Contact</Button>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-lg font-semibold mb-4">Evidence Collection</h3>
                <EvidencePanel prospectId={prospects[0].id} evidences={prospects[0].evidences || []} />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a prospect to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
