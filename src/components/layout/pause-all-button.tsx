'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function PauseAllButton() {
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);

  const handlePauseAll = async () => {
    setIsPending(true);
    try {
      // Simulate server action
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('All running campaigns have been paused.');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to pause campaigns.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="hidden sm:inline">Pause All</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Pause All Campaigns?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to pause ALL running campaigns? This will immediately stop all scheduled emails.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handlePauseAll} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Yes, Pause All
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
