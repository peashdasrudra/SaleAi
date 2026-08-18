'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, XCircle, Edit, ExternalLink, Plus, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { addEvidence, updateEvidence, deleteEvidence } from '@/app/(dashboard)/research/actions';

export interface EvidenceItem {
  id: string;
  type: string;
  text: string;
  url?: string | null;
  observedAt: Date;
  confidence: number;
  verified: boolean;
}

interface EvidencePanelProps {
  prospectId: string;
  evidences: EvidenceItem[];
}

export function EvidencePanel({ prospectId, evidences }: EvidencePanelProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newType, setNewType] = useState('TECHNOLOGY');
  const [newText, setNewText] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newConfidence, setNewConfidence] = useState(80);

  const handleAdd = async () => {
    if (!newText) return;
    await addEvidence({
      prospectId,
      type: newType,
      text: newText,
      url: newUrl,
      confidence: newConfidence
    });
    setShowAdd(false);
    setNewText('');
    setNewUrl('');
  };

  const handleVerify = async (id: string, verified: boolean) => {
    await updateEvidence(id, { verified });
  };

  const handleDelete = async (id: string) => {
    await deleteEvidence(id);
  };

  return (
    <div className="space-y-4">
      {evidences.map(item => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <Badge variant="outline" className="bg-secondary/20">{item.type}</Badge>
              {item.verified ? (
                <Badge variant="outline" className="border-green-500 text-green-600 flex gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="border-yellow-500 text-yellow-600 flex gap-1">
                  <AlertCircle className="h-3 w-3" /> Needs Verification
                </Badge>
              )}
            </div>
            <p className="text-sm mb-2">{item.text}</p>
            {item.url && (
              <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mb-3">
                Source <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span suppressHydrationWarning>{format(new Date(item.observedAt), 'MMM d, yyyy')}</span>
              <div className="flex items-center gap-2 w-32">
                <span>Conf: {item.confidence}%</span>
                <Progress 
                  value={item.confidence} 
                  className={`h-1.5 flex-1 ${item.confidence > 70 ? '[&>div]:bg-green-500' : item.confidence >= 40 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`} 
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button variant="ghost" size="sm" onClick={() => handleVerify(item.id, true)} className="text-green-600 hover:text-green-700 hover:bg-green-50">
                <CheckCircle2 className="h-4 w-4 mr-1" /> Verify
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleVerify(item.id, false)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <XCircle className="h-4 w-4 mr-1" /> Reject
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                <Edit className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {showAdd ? (
        <Card className="border-primary">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-semibold text-sm">Add New Evidence</h4>
            <div className="space-y-2">
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger><SelectValue placeholder="Evidence Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TECHNOLOGY">Technology Stack</SelectItem>
                  <SelectItem value="HIRING">Hiring Intent</SelectItem>
                  <SelectItem value="NEWS">Recent News</SelectItem>
                  <SelectItem value="FUNDING">Funding Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Textarea 
                placeholder="Evidence description..." 
                value={newText} 
                onChange={(e) => setNewText(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Input 
                placeholder="Source URL (optional)" 
                type="url" 
                value={newUrl} 
                onChange={(e) => setNewUrl(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Confidence ({newConfidence}%)</label>
              <input 
                type="range" 
                min="0" max="100" 
                value={newConfidence} 
                onChange={(e) => setNewConfidence(parseInt(e.target.value))} 
                className="w-full"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleAdd}>Save Evidence</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" className="w-full border-dashed" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Evidence
        </Button>
      )}
    </div>
  );
}
