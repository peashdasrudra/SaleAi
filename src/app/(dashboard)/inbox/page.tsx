import { Suspense } from 'react';
import { getReplies } from './actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, CheckCircle, PauseCircle, PlayCircle, ExternalLink, Flame } from 'lucide-react';

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ replyId?: string }>;
}) {
  const { replyId } = await searchParams;
  const replies = await getReplies();
  
  const selectedReply = replyId ? replies.find((r) => r.id === replyId) : replies[0];

  return (
    <div className="flex h-[calc(100vh-4rem)] border-t -m-6 mt-0">
      {/* Left Pane: Reply List */}
      <div className="w-1/3 border-r bg-muted/10 overflow-y-auto">
        <div className="p-4 border-b bg-card sticky top-0 z-10 flex justify-between items-center">
          <h2 className="font-semibold">Inbox ({replies.length})</h2>
          <Button variant="outline" size="sm">Filter</Button>
        </div>
        <div className="divide-y">
          {replies.map((reply) => (
            <a
              key={reply.id}
              href={`/inbox?replyId=${reply.id}`}
              className={`block p-4 hover:bg-muted/50 transition-colors ${
                selectedReply?.id === reply.id ? 'bg-muted/50' : ''
              } ${reply.classification === 'HOT' ? 'border-l-4 border-l-red-500' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm">
                  {reply.prospectName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(reply.receivedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mb-2">{reply.company}</div>
              <div className="text-sm font-medium truncate mb-2">{reply.subject}</div>
              <div className="flex gap-2">
                <Badge variant={reply.classification === 'HOT' ? 'destructive' : 'secondary'} className="text-[10px]">
                  {reply.classification}
                </Badge>
                {reply.sentiment && (
                  <Badge variant="outline" className="text-[10px]">{reply.sentiment}</Badge>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Right Pane: Thread View */}
      <div className="flex-1 flex flex-col bg-card">
        {selectedReply ? (
          <>
            <div className="p-6 border-b flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{selectedReply.subject}</h2>
                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  From: {selectedReply.prospectName} &lt;{selectedReply.prospectEmail}&gt;
                  <Button variant="ghost" size="icon" className="h-6 w-6"><ExternalLink className="h-3 w-3" /></Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <PauseCircle className="h-4 w-4" /> Pause Campaign
                </Button>
                <form action={async () => { 'use server'; /* await markAsReviewed(selectedReply.id) */ }}>
                  <Button variant="default" size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4" /> Mark Reviewed
                  </Button>
                </form>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Classification Banner */}
              <div className={`p-4 rounded-md border ${
                selectedReply.classification === 'HOT' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-muted/30'
              }`}>
                <div className="flex items-center gap-2 font-semibold mb-2">
                  {selectedReply.classification === 'HOT' ? <Flame className="h-4 w-4 text-red-600" /> : <MessageSquare className="h-4 w-4" />}
                  AI Classification: {selectedReply.classification}
                </div>
                <p className="text-sm">Confidence: {selectedReply.confidence}%</p>
                <p className="text-sm mt-1 font-medium">Suggested Action: {selectedReply.suggestedAction}</p>
              </div>

              {/* Thread Content */}
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="text-xs text-muted-foreground mb-4 border-b pb-2">
                    Received: {new Date(selectedReply.receivedAt).toLocaleString()}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{selectedReply.content}</div>
                </div>

                <div className="border rounded-lg p-4 bg-muted/20 ml-8">
                  <div className="text-xs text-muted-foreground mb-4 border-b pb-2">
                    Original Email (Sent: {new Date(selectedReply.originalSentAt).toLocaleString()})
                  </div>
                  <div className="text-sm opacity-70" dangerouslySetInnerHTML={{ __html: selectedReply.originalEmailHtml }} />
                </div>
              </div>
            </div>

            {/* Internal Notes / Quick Actions Footer */}
            <div className="p-4 border-t bg-muted/10">
              <label className="text-xs font-semibold mb-2 block">Internal Notes / Next Steps</label>
              <div className="flex gap-2">
                <Textarea placeholder="Add a note or draft a reply..." className="min-h-[80px]" />
                <Button className="h-auto">Save Note</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a reply to view the thread.
          </div>
        )}
      </div>
    </div>
  );
}
