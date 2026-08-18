'use client';

import { useState, useEffect } from 'react';
import { getSuppressions, addSuppression, bulkDeleteSuppressions } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, Trash2 } from 'lucide-react';

export default function SuppressionPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({ email: '', domain: '', reason: 'MANUAL', source: 'MANUAL' });

  const loadData = async () => {
    const data = await getSuppressions(1, 50, search);
    setItems(data.items);
    setTotal(data.total);
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleAdd = async () => {
    await addSuppression(newEntry);
    setIsDialogOpen(false);
    setNewEntry({ email: '', domain: '', reason: 'MANUAL', source: 'MANUAL' });
    loadData();
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    await bulkDeleteSuppressions(selected);
    setSelected([]);
    loadData();
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Suppression List</h1>
        <div className="flex gap-4">
          <Button 
            variant="destructive" 
            disabled={selected.length === 0}
            onClick={handleBulkDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Suppression
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add to Suppression List</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    placeholder="user@example.com" 
                    value={newEntry.email}
                    onChange={(e) => setNewEntry({...newEntry, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Domain (Optional)</label>
                  <Input 
                    placeholder="example.com"
                    value={newEntry.domain}
                    onChange={(e) => setNewEntry({...newEntry, domain: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason</label>
                  <Select value={newEntry.reason} onValueChange={(v) => setNewEntry({...newEntry, reason: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNSUBSCRIBE">Unsubscribe</SelectItem>
                      <SelectItem value="HARD_BOUNCE">Hard Bounce</SelectItem>
                      <SelectItem value="COMPLAINT">Complaint</SelectItem>
                      <SelectItem value="MANUAL">Manual</SelectItem>
                      <SelectItem value="DUPLICATE">Duplicate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAdd} className="w-full">Add Entry</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="w-4 h-4 text-gray-500" />
        <Input 
          placeholder="Search emails or domains..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selected.length === items.length && items.length > 0}
                  onCheckedChange={(c) => setSelected(c ? items.map(i => i.id) : [])}
                />
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Date Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox 
                    checked={selected.includes(item.id)}
                    onCheckedChange={() => toggleSelect(item.id)}
                  />
                </TableCell>
                <TableCell>{item.email || '-'}</TableCell>
                <TableCell>{item.domain || '-'}</TableCell>
                <TableCell><Badge variant="secondary">{item.reason}</Badge></TableCell>
                <TableCell>{item.source}</TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No suppression entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
