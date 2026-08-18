import { Suspense } from 'react';
import { getPendingEmails, bulkApproveEmails } from './actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ShieldAlert, CheckCircle, XCircle, Edit3, RefreshCw } from 'lucide-react';

export default async function EmailApprovalPage({
  searchParams,
}: {
  searchParams: Promise<{ campaign?: string; risk?: string }>;
}) {
  const { campaign, risk } = await searchParams;
  const emails = await getPendingEmails({ campaign, risk });

  if (emails.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">No pending emails</h2>
        <p className="text-muted-foreground">All generated emails have been reviewed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Approval Queue</h1>
          <p className="text-muted-foreground mt-2">
            Review and approve AI-generated emails before they are sent.
          </p>
        </div>
        <form action={bulkApproveEmails.bind(null, emails.filter(e => !e.riskFlags?.length).map(e => e.id))}>
          <Button type="submit" variant="default" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Bulk Approve Safe
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {emails.map((email) => (
          <Card key={email.id} className="flex flex-col">
            <CardHeader className="border-b bg-muted/40 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {email.prospect.firstName} {email.prospect.lastName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{email.prospect.company}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={email.priority === 'HIGH' ? 'destructive' : 'secondary'}>
                    {email.priority} Priority
                  </Badge>
                  <Badge variant="outline">Score: {email.score}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">Subject</label>
                <div className="mt-1 font-medium">{email.subject}</div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">Body Preview</label>
                <div 
                  className="mt-1 p-4 border rounded-md bg-white text-sm prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: email.bodyHtml }}
                />
              </div>
              
              {(email.personalizationFacts?.length > 0 || email.riskFlags?.length > 0) && (
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                  {email.personalizationFacts?.length > 0 && (
                    <div>
                      <label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">
                        Facts Used
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {email.personalizationFacts.map((fact: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">{fact}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {email.riskFlags?.length > 0 && (
                    <div>
                      <label className="text-xs font-semibold uppercase text-destructive mb-2 block flex items-center gap-1">
                        <ShieldAlert className="h-3 w-3" /> Risk Flags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {email.riskFlags.map((flag: string, i: number) => (
                          <Badge key={i} variant="destructive" className="text-xs">{flag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t p-4 flex justify-between bg-muted/20">
              <div className="flex gap-2">
                <form action={async () => { 'use server'; /* implement approve action */ }}>
                  <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-1" /> Approve
                  </Button>
                </form>
                <form action={async () => { 'use server'; /* implement reject action */ }}>
                  <Button variant="destructive" size="sm">
                    <XCircle className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </form>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit3 className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="secondary" size="sm">
                  <RefreshCw className="h-4 w-4 mr-1" /> Regenerate
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
