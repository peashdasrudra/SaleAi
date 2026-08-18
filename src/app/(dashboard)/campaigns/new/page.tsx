'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, ArrowRight, ArrowLeft, Check, Play } from 'lucide-react';
import { createCampaign } from '../actions';

export default function NewCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    targetCountry: 'US',
    segmentDescription: '',
    offer: '',
    dailyLimit: 100,
    requireApproval: true,
  });

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));
  
  const handleSubmit = async () => {
    // Call server action to save
    const res = await createCampaign(formData);
    if (res.success) {
      router.push(`/campaigns/${res.id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Campaign</h1>
          <p className="text-muted-foreground mt-2">Build a new automated outreach sequence.</p>
        </div>
        <div className="flex gap-2 text-sm text-muted-foreground items-center">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`flex items-center ${step === s ? 'text-primary font-bold' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {step > s ? <Check className="w-3 h-3" /> : s}
              </div>
              <span className="hidden md:inline mr-2">
                {s === 1 ? 'Basics' : s === 2 ? 'Audience' : s === 3 ? 'Sequence' : s === 4 ? 'Settings' : 'Review'}
              </span>
              {s < 5 && <div className="w-4 h-[1px] bg-border mr-2" />}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <Label>Campaign Name</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g., Q3 Enterprise Tech Directors" 
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Target Country</Label>
                <Select value={formData.targetCountry} onValueChange={(v) => setFormData({...formData, targetCountry: v})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Target Segment Description</Label>
                <Textarea 
                  value={formData.segmentDescription} 
                  onChange={(e) => setFormData({...formData, segmentDescription: e.target.value})} 
                  placeholder="Describe your ideal prospect for this campaign..." 
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Core Offer</Label>
                <Textarea 
                  value={formData.offer} 
                  onChange={(e) => setFormData({...formData, offer: e.target.value})} 
                  placeholder="What is the primary value proposition?" 
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md flex gap-3">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm">Ensure your audience selection complies with local spam regulations (CAN-SPAM, GDPR). Always provide an opt-out mechanism.</p>
              </div>
              <div className="border border-dashed rounded-lg p-12 text-center text-muted-foreground">
                <p>Audience Filter Builder (Placeholder)</p>
                <p className="text-sm mt-2">Select prospects from your CRM matching specific criteria.</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              {[
                { title: 'Initial Email', delay: 'Send immediately' },
                { title: 'Follow-up 1', delay: 'Wait 3 business days' },
                { title: 'Follow-up 2', delay: 'Wait 4 business days' },
                { title: 'Breakup Email', delay: 'Wait 5 business days' }
              ].map((seq, i) => (
                <div key={i} className="flex gap-4 p-4 border rounded-md bg-card">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{seq.title}</h4>
                      <span className="text-xs text-muted-foreground">{seq.delay}</span>
                    </div>
                    <div className="bg-muted/50 p-3 rounded text-sm text-muted-foreground">
                      AI Generated Content Template Placeholder
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Daily Send Limit</Label>
                  <Input 
                    type="number" 
                    value={formData.dailyLimit} 
                    onChange={(e) => setFormData({...formData, dailyLimit: parseInt(e.target.value) || 0})}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Maximum emails sent per day.</p>
                </div>
                <div>
                  <Label>Per-Domain Limit</Label>
                  <Input type="number" defaultValue={2} className="mt-1" />
                  <p className="text-xs text-muted-foreground mt-1">Max emails per company domain per day.</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-4 border-t">
                <Checkbox 
                  id="approval" 
                  checked={formData.requireApproval}
                  onCheckedChange={(c) => setFormData({...formData, requireApproval: !!c})}
                />
                <label htmlFor="approval" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Require manual approval for each AI-generated email
                </label>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-lg font-semibold border-b pb-2">Review & Submit</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <div className="font-medium">{formData.name || 'Untitled'}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Daily Limit:</span>
                  <div className="font-medium">{formData.dailyLimit} emails/day</div>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Offer:</span>
                  <div className="font-medium">{formData.offer || 'None'}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <div className="px-6 py-4 border-t flex justify-between bg-muted/20">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          {step < 5 ? (
            <Button onClick={handleNext}>
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" /> Submit for Review
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
