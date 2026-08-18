'use client';

import { useState, useEffect } from 'react';
import { getWorkspaceSettings, updateScoringRules } from '../actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';

const DEFAULT_SCORING_RULES = [
  { id: '1', factor: 'Company Size > 1000', category: 'Firmographics', points: 20, active: true, requiresVerification: false },
  { id: '2', factor: 'Has matching job title', category: 'Role', points: 30, active: true, requiresVerification: true },
  { id: '3', factor: 'Recent funding round', category: 'Signals', points: 15, active: true, requiresVerification: false },
  { id: '4', factor: 'Tech stack match', category: 'Firmographics', points: 25, active: true, requiresVerification: false }
];

export default function ScoringSettingsPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getWorkspaceSettings().then((data) => {
      // scoringRules have been deprecated from the workspace model
      setRules(DEFAULT_SCORING_RULES);
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await updateScoringRules(rules);
    setIsSaving(false);
    alert('Scoring rules saved successfully');
  };

  const updateRule = (id: string, field: string, value: any) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleReset = () => {
    setRules(DEFAULT_SCORING_RULES);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Scoring Rules</h1>
          <p className="text-gray-500">Configure how prospects are evaluated and scored.</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleReset}>Reset to Defaults</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Factor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-24">Points</TableHead>
              <TableHead>Requires Verification</TableHead>
              <TableHead>Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.factor}</TableCell>
                <TableCell>{rule.category}</TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    value={rule.points} 
                    onChange={(e) => updateRule(rule.id, 'points', parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={rule.requiresVerification}
                    onCheckedChange={(c) => updateRule(rule.id, 'requiresVerification', c)}
                  />
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={rule.active}
                    onCheckedChange={(c) => updateRule(rule.id, 'active', c)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button variant="secondary">
        <Plus className="w-4 h-4 mr-2" />
        Add Custom Rule
      </Button>

      <div className="bg-gray-50 p-6 rounded-lg mt-8">
        <h3 className="font-semibold mb-2">Preview</h3>
        <p className="text-sm text-gray-600 mb-4">How a sample prospect would score with these rules:</p>
        <div className="flex justify-between items-center bg-white p-4 rounded border">
          <div>
            <div className="font-medium">Jane Doe - VP of Sales at BigCorp</div>
            <div className="text-sm text-gray-500">Matches: Role, Company Size</div>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {rules.filter(r => r.active && ['1', '2'].includes(r.id)).reduce((sum, r) => sum + r.points, 0)} pts
          </div>
        </div>
      </div>
    </div>
  );
}
