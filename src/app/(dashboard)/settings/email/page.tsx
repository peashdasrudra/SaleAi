'use client';

import { useState } from 'react';

export default function EmailSettingsPage() {
  const [apiKey, setApiKey] = useState('sk_resend_*******************');
  const [fromEmail, setFromEmail] = useState('hello@aixpertlabs.com');
  const [replyTo, setReplyTo] = useState('support@aixpertlabs.com');

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Email Provider Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4">Connection</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Provider Status</label>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <span className="h-2 w-2 bg-green-600 rounded-full mr-2"></span> Connected (Resend)
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">API Key</label>
            <div className="flex gap-2">
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="flex-1 border rounded-md px-3 py-2 text-sm" />
              <button className="px-4 py-2 bg-black text-white rounded-md text-sm">Test</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">From Email</label>
              <input type="text" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reply-To Email</label>
              <input type="text" value={replyTo} onChange={(e) => setReplyTo(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Webhook URL (for Resend)</label>
            <input type="text" readOnly value="https://app.leadpilot.com/api/webhooks/resend" className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4">Sending Limits & Schedule</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Daily Limit (Total)</label>
              <input type="number" defaultValue={500} className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Daily Limit (Per Domain)</label>
              <input type="number" defaultValue={50} className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sending Window</label>
            <div className="flex items-center gap-2">
              <input type="time" defaultValue="09:00" className="border rounded-md px-3 py-2 text-sm" />
              <span>to</span>
              <input type="time" defaultValue="17:00" className="border rounded-md px-3 py-2 text-sm" />
              <span className="text-gray-500 text-sm ml-2">UTC</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sending Days</label>
            <div className="flex gap-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <label key={day} className="flex items-center gap-1 text-sm">
                  <input type="checkbox" defaultChecked={['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(day)} />
                  {day}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4">Authentication Checklist</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2"><span className="text-green-500">✓</span> SPF Record valid</li>
          <li className="flex items-center gap-2"><span className="text-green-500">✓</span> DKIM Record valid</li>
          <li className="flex items-center gap-2"><span className="text-green-500">✓</span> DMARC Policy active</li>
        </ul>
      </div>

      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 border rounded-md text-sm">Cancel</button>
        <button className="px-4 py-2 bg-black text-white rounded-md text-sm">Save Settings</button>
      </div>
    </div>
  );
}
