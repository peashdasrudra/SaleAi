'use client';

export default function NotificationsSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Notifications & Alerts</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4">Channels Configuration</h2>
        
        <div className="space-y-6">
          {/* Email Channel */}
          <div>
            <h3 className="text-md font-medium mb-2">Email Notifications</h3>
            <input type="email" placeholder="alerts@yourdomain.com" className="w-full border rounded-md px-3 py-2 text-sm" defaultValue="admin@aixpertlabs.com" />
          </div>

          <hr />

          {/* Telegram Channel */}
          <div>
            <h3 className="text-md font-medium mb-2">Telegram Integration</h3>
            <div className="space-y-3">
              <input type="password" placeholder="Bot Token (e.g. 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11)" className="w-full border rounded-md px-3 py-2 text-sm" />
              <input type="text" placeholder="Chat ID" className="w-full border rounded-md px-3 py-2 text-sm" />
              <button className="px-3 py-1.5 border rounded-md text-sm">Test Telegram</button>
            </div>
          </div>

          <hr />

          {/* Slack Channel */}
          <div>
            <h3 className="text-md font-medium mb-2">Slack Integration</h3>
            <div className="space-y-3">
              <input type="url" placeholder="Slack Webhook URL (https://hooks.slack.com/...)" className="w-full border rounded-md px-3 py-2 text-sm" />
              <button className="px-3 py-1.5 border rounded-md text-sm">Test Slack</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 font-medium text-gray-600">Event</th>
                <th className="py-2 text-center font-medium text-gray-600">In-App</th>
                <th className="py-2 text-center font-medium text-gray-600">Email</th>
                <th className="py-2 text-center font-medium text-gray-600">Telegram</th>
                <th className="py-2 text-center font-medium text-gray-600">Slack</th>
              </tr>
            </thead>
            <tbody>
              {[
                { event: 'Reply Received', inApp: true, email: true, tg: true, slack: true },
                { event: 'Hot Lead Detected', inApp: true, email: true, tg: true, slack: true },
                { event: 'Unsubscribe', inApp: true, email: true, tg: false, slack: false },
                { event: 'Bounce', inApp: true, email: true, tg: false, slack: false },
                { event: 'Campaign Error', inApp: true, email: true, tg: true, slack: false },
                { event: 'Daily Report', inApp: false, email: true, tg: false, slack: false },
              ].map((row, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="py-3 font-medium text-gray-800">{row.event}</td>
                  <td className="py-3 text-center"><input type="checkbox" defaultChecked={row.inApp} /></td>
                  <td className="py-3 text-center"><input type="checkbox" defaultChecked={row.email} /></td>
                  <td className="py-3 text-center"><input type="checkbox" defaultChecked={row.tg} /></td>
                  <td className="py-3 text-center"><input type="checkbox" defaultChecked={row.slack} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 border rounded-md text-sm">Test All Channels</button>
        <button className="px-4 py-2 bg-black text-white rounded-md text-sm">Save Preferences</button>
      </div>
    </div>
  );
}
