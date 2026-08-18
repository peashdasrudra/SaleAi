'use client';

export default function ComplianceSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Compliance & Legal</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Email Footer Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Unsubscribe Text</label>
                <textarea 
                  className="w-full border rounded-md px-3 py-2 text-sm" 
                  rows={2} 
                  defaultValue="If you no longer wish to receive these emails, please reply with 'unsubscribe' or click the link below."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Business Address (Required by CAN-SPAM)</label>
                <textarea 
                  className="w-full border rounded-md px-3 py-2 text-sm" 
                  rows={3} 
                  placeholder="e.g. 123 Business St, Suite 100, City, State, ZIP"
                  defaultValue="AiXpertLabs, 123 Tech Lane, San Francisco, CA 94105"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Default Lawful Basis Note (GDPR/PECR)</label>
                <textarea 
                  className="w-full border rounded-md px-3 py-2 text-sm" 
                  rows={2} 
                  defaultValue="We are contacting you because we believe our services align with your business interests."
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-red-200">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Data Management</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Data Retention Policy</label>
                <select className="w-full border rounded-md px-3 py-2 text-sm max-w-xs">
                  <option value="forever">Keep data indefinitely</option>
                  <option value="365">Delete prospects inactive for 1 year</option>
                  <option value="180">Delete prospects inactive for 6 months</option>
                  <option value="90">Delete prospects inactive for 3 months</option>
                </select>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t">
                <button className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50">
                  Export All Workspace Data (CSV)
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">
                  Delete All Workspace Data
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button className="px-4 py-2 border rounded-md text-sm">Cancel</button>
            <button className="px-4 py-2 bg-black text-white rounded-md text-sm">Save Changes</button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Compliance Checklist</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✅</span> 
                <span>Business address configured</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✅</span> 
                <span>Unsubscribe mechanism configured</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✅</span> 
                <span>Sender identity configured</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✅</span> 
                <span>Email authentication (SPF/DKIM/DMARC)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✅</span> 
                <span>Suppression list active</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✅</span> 
                <span>Sending limits configured</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-4 border-t pt-4">
              Disclaimer: Meeting these technical requirements does not guarantee full legal compliance. Please consult your legal team regarding your specific obligations under CAN-SPAM, GDPR, PECR, and other relevant regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
