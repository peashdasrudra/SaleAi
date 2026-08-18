'use client';

import { useState } from 'react';

export default function AISettingsPage() {
  const [model, setModel] = useState('gpt-4o');
  const [temperature, setTemperature] = useState(0.7);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">AI Configuration</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4">Provider Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Provider</label>
            <p className="text-sm text-gray-700">OpenAI</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">API Key</label>
            <input type="password" value="sk-proj-***********************************" readOnly className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Base URL (Custom Endpoints)</label>
            <input type="text" placeholder="https://api.openai.com/v1" className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Model Selection</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm">
              <option value="gpt-4o">GPT-4o (Recommended)</option>
              <option value="gpt-4o-mini">GPT-4o Mini (Faster, cheaper)</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Temperature ({temperature})</label>
            <input 
              type="range" 
              min="0" max="1" step="0.1" 
              value={temperature} 
              onChange={(e) => setTemperature(parseFloat(e.target.value))} 
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Higher values make output more creative, lower values make it more focused and deterministic.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4">System Prompts</h2>
        <p className="text-sm text-gray-500 mb-4">Prompt Version: <strong>v1.2.0</strong></p>
        
        <div className="p-4 border rounded-md bg-gray-50 mb-4">
          <p className="text-sm font-mono text-gray-700">You are an expert sales development representative. Your goal is to write a short, highly personalized cold email to the prospect based on their provided context...</p>
        </div>
        
        <button className="px-4 py-2 border rounded-md text-sm font-medium w-full hover:bg-gray-50">Test Generation</button>
      </div>

      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 border rounded-md text-sm">Cancel</button>
        <button className="px-4 py-2 bg-black text-white rounded-md text-sm">Save Configurations</button>
      </div>
    </div>
  );
}
