import { getTasks } from './actions';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, ArrowUpCircle, CheckCircle2, Clock, MoreHorizontal, Plus } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import Link from 'next/link';

export default async function TasksPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams.status as string || 'OPEN';
  
  const tasks = await getTasks({ status: statusFilter });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'URGENT': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'HIGH': return <ArrowUpCircle className="h-4 w-4 text-orange-500" />;
      case 'MEDIUM': return <ArrowUpCircle className="h-4 w-4 text-blue-500 rotate-45" />;
      default: return <ArrowUpCircle className="h-4 w-4 text-gray-500 rotate-90" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage your follow-ups and actions</p>
        </div>
        <div className="flex gap-4 items-center">
          <Select defaultValue={statusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPEN">Open Tasks</SelectItem>
              <SelectItem value="DONE">Completed</SelectItem>
              <SelectItem value="SNOOZED">Snoozed</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Add Task
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Title & Description</TableHead>
                <TableHead>Prospect</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    No tasks found.
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => {
                  const t = task as any;
                  const isOverdue = isPast(new Date(t.dueAt)) && !isToday(new Date(t.dueAt)) && t.status !== 'DONE';
                  
                  return (
                    <TableRow key={task.id} className={isOverdue ? 'bg-red-50/50 dark:bg-red-950/20' : ''}>
                      <TableCell>{getPriorityIcon(task.priority)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                          {task.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        {t.prospect ? (
                          <Link href={`/prospects/${t.prospect.id}`} className="text-sm text-primary hover:underline">
                            {t.prospect.companyName || t.prospect.contactFullName}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1.5 text-sm ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                          <Clock className="h-3.5 w-3.5" />
                          <span suppressHydrationWarning>
                            {t.dueAt ? (isToday(new Date(t.dueAt)) ? 'Today' : format(new Date(t.dueAt), 'MMM d, yyyy')) : 'No due date'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={task.status === 'DONE' ? 'outline' : 'secondary'} className={task.status === 'DONE' ? 'text-green-600 border-green-200' : ''}>
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {task.status !== 'DONE' && (
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
