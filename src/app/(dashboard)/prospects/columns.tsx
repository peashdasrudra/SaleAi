"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { deleteProspect } from "./actions";

export type Prospect = {
  id: string;
  companyName: string;
  contactName: string;
  jobTitle: string;
  email: string;
  country: string;
  city: string;
  priority: string;
  score: number;
  contactStatus: string;
  researchStatus: string;
  sourceType: string;
  lastActivityAt: Date;
};

export const columns: ColumnDef<Prospect>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Link href={`/prospects/${row.original.id}`} className="font-medium hover:underline">
        {row.getValue("companyName")}
      </Link>
    ),
  },
  {
    accessorKey: "contactName",
    header: "Contact",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("contactName")}</div>
        <div className="text-xs text-muted-foreground">{row.original.jobTitle}</div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const country = row.original.country;
      const city = row.original.city;
      return (
        <div className="text-sm">
          {city ? `${city}, ` : ""}{country}
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => <StatusBadge status={row.getValue("priority")} variant="priority" />,
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const score = parseFloat(row.getValue("score"));
      const color = score >= 80 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-600";
      return <div className={`font-semibold ${color}`}>{score}</div>;
    },
  },
  {
    accessorKey: "contactStatus",
    header: "Contact Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("contactStatus")} variant="contact" />,
  },
  {
    accessorKey: "researchStatus",
    header: "Research",
    cell: ({ row }) => <StatusBadge status={row.getValue("researchStatus")} variant="research" />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const prospect = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/prospects/${prospect.id}`}>View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Research</DropdownMenuItem>
            <DropdownMenuItem>Generate Email</DropdownMenuItem>
            <DropdownMenuItem>Add to Campaign</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Pause</DropdownMenuItem>
            <DropdownMenuItem>Disqualify</DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10"
              onClick={async () => {
                if (confirm("Are you sure you want to delete this prospect?")) {
                  await deleteProspect(prospect.id);
                }
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
