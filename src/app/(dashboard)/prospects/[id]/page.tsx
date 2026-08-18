import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Search, Mail, Users, Ban, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProspectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Placeholder data
  const prospect = {
    id,
    companyName: "Acme Corp",
    contactName: "John Doe",
    priority: "A",
    score: 85,
    contactStatus: "NOT_CONTACTED"
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <Link href="/prospects" className="flex items-center hover:text-foreground transition-colors">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Prospects
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{prospect.companyName}</h2>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={prospect.priority} variant="priority" />
            <StatusBadge status={prospect.contactStatus} variant="contact" />
            <div className="flex items-center text-sm font-medium">
              Score: <span className="ml-1 text-green-600">{prospect.score}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Search className="mr-2 h-4 w-4" />
            Research
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Generate Email
          </Button>
          <Button variant="outline" size="sm">
            <Users className="mr-2 h-4 w-4" />
            Add to Campaign
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Ban className="mr-2 h-4 w-4" />
            DNC
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Company Info</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Name:</dt><dd className="font-medium">{prospect.companyName}</dd></div>
                </dl>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contact Info</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Name:</dt><dd className="font-medium">{prospect.contactName}</dd></div>
                </dl>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>AI Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Summary pending research.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="evidence" className="pt-4">
          <Card>
            <CardHeader><CardTitle>Evidence</CardTitle></CardHeader>
            <CardContent>No evidence gathered yet.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="emails" className="pt-4">
          <Card>
            <CardHeader><CardTitle>Emails</CardTitle></CardHeader>
            <CardContent>No emails generated yet.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="timeline" className="pt-4">
          <Card>
            <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
            <CardContent>No activity recorded.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks" className="pt-4">
          <Card>
            <CardHeader><CardTitle>Tasks</CardTitle></CardHeader>
            <CardContent>No pending tasks.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
