import * as React from "react";
import Link from "next/link";
import { Plus, Upload, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { ComplianceWarning } from "@/components/shared/compliance-warning";
import { columns } from "./columns";
import { getProspects } from "./actions";

export default async function ProspectsPage() {
  const data = await getProspects();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ComplianceWarning context="general" />
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Prospects</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/prospects/import">
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Link>
          </Button>
          <Button asChild>
            <Link href="/prospects/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Prospect
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={data}
          searchKey="companyName"
          searchPlaceholder="Search company name..."
          filterableColumns={[
            {
              id: "priority",
              title: "Priority",
              options: [
                { label: "A", value: "A" },
                { label: "B", value: "B" },
                { label: "C", value: "C" },
                { label: "Disqualified", value: "DISQUALIFIED" },
              ],
            },
            {
              id: "contactStatus",
              title: "Contact Status",
              options: [
                { label: "Not Contacted", value: "NOT_CONTACTED" },
                { label: "Approved", value: "APPROVED" },
                { label: "Sent", value: "SENT" },
                { label: "Replied", value: "REPLIED" },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}
