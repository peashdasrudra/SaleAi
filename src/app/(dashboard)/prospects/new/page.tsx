"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ComplianceWarning } from "@/components/shared/compliance-warning";
import { createProspect } from "./actions";

export default function NewProspectPage() {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      await createProspect(data);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <Link href="/prospects" className="flex items-center hover:text-foreground transition-colors">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Prospects
        </Link>
      </div>

      <ComplianceWarning context="general" />

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add New Prospect</h2>
        <p className="text-muted-foreground mt-2">Enter the details of your new prospect manually.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Company Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="companyName" className="text-sm font-medium">Company Name *</label>
              <Input id="companyName" name="companyName" required placeholder="Acme Corp" />
            </div>
            <div className="space-y-2">
              <label htmlFor="website" className="text-sm font-medium">Website</label>
              <Input id="website" name="website" placeholder="https://acme.com" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
              <Input id="firstName" name="firstName" placeholder="John" />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
              <Input id="lastName" name="lastName" placeholder="Doe" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Business Email</label>
              <Input id="email" name="email" type="email" placeholder="john@acme.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="jobTitle" className="text-sm font-medium">Job Title</label>
              <Input id="jobTitle" name="jobTitle" placeholder="CEO" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Prospect"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/prospects">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
