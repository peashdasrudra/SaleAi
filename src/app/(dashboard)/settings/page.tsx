'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getWorkspaceSettings, updateWorkspaceSettings } from './actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function GeneralSettingsPage() {
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    getWorkspaceSettings().then((data) => {
      if (data) {
        reset({
          companyName: data.name,
          website: data.website || '',
          businessAddress: data.businessAddress || '',
          senderName: data.senderName || '',
          senderEmail: data.senderEmail || '',
          replyToEmail: data.replyToEmail || '',
          defaultSignature: data.defaultSignature || '',
          timezone: data.timezone || 'UTC',
          dailyLimit: data.dailyLimit || 100,
          domainLimit: data.domainLimit || 5
        });
      }
    });
  }, [reset]);

  const onSubmit = async (data: any) => {
    await updateWorkspaceSettings({
      name: data.companyName,
      website: data.website,
      businessAddress: data.businessAddress,
      senderName: data.senderName,
      senderEmail: data.senderEmail,
      replyToEmail: data.replyToEmail,
      defaultSignature: data.defaultSignature,
      timezone: data.timezone,
      dailyLimit: parseInt(data.dailyLimit, 10),
      domainLimit: parseInt(data.domainLimit, 10)
    });
    alert('Settings saved successfully');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">General Settings</h1>
        <p className="text-gray-500">Manage your workspace configuration and company details.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Details used in your email footers and compliance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <Input {...register('companyName')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <Input {...register('website')} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Address</label>
              <Textarea {...register('businessAddress')} placeholder="123 Main St..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sender Identity</CardTitle>
            <CardDescription>Default sender information for new campaigns.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sender Name</label>
                <Input {...register('senderName')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sender Email</label>
                <Input type="email" {...register('senderEmail')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reply-To Email</label>
                <Input type="email" {...register('replyToEmail')} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Signature</label>
              <Textarea {...register('defaultSignature')} className="min-h-[100px]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Daily Send Limit</label>
                <Input type="number" {...register('dailyLimit')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Per-Domain Limit</label>
                <Input type="number" {...register('domainLimit')} />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
