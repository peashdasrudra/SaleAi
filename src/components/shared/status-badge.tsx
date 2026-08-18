"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "priority" | "contact" | "research" | "classification";
  className?: string;
}

export function StatusBadge({ status, variant = "default", className }: StatusBadgeProps) {
  const normalizedStatus = status.toUpperCase().replace(/\s+/g, "_");

  let colorClass = "bg-gray-100 text-gray-800 border-gray-200";
  
  if (variant === "priority") {
    switch (normalizedStatus) {
      case "A":
        colorClass = "bg-green-100 text-green-800 border-green-200";
        break;
      case "B":
        colorClass = "bg-blue-100 text-blue-800 border-blue-200";
        break;
      case "C":
        colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
        break;
      case "DISQUALIFIED":
        colorClass = "bg-red-100 text-red-800 border-red-200";
        break;
    }
  } else if (variant === "contact") {
    switch (normalizedStatus) {
      case "NOT_CONTACTED":
        colorClass = "bg-gray-100 text-gray-800 border-gray-200";
        break;
      case "APPROVED":
        colorClass = "bg-blue-100 text-blue-800 border-blue-200";
        break;
      case "SENT":
        colorClass = "bg-indigo-100 text-indigo-800 border-indigo-200";
        break;
      case "REPLIED":
        colorClass = "bg-green-100 text-green-800 border-green-200";
        break;
      case "QUALIFIED":
        colorClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
        break;
      case "NOT_INTERESTED":
      case "UNSUBSCRIBED":
      case "BOUNCED":
        colorClass = "bg-red-100 text-red-800 border-red-200";
        break;
      case "CONVERTED":
        colorClass = "bg-green-100 text-green-800 border-green-200";
        break;
    }
  } else if (variant === "research") {
    switch (normalizedStatus) {
      case "NEW":
        colorClass = "bg-gray-100 text-gray-800 border-gray-200";
        break;
      case "QUEUED":
        colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
        break;
      case "IN_PROGRESS":
        colorClass = "bg-blue-100 text-blue-800 border-blue-200";
        break;
      case "REVIEW_REQUIRED":
        colorClass = "bg-orange-100 text-orange-800 border-orange-200";
        break;
      case "COMPLETE":
        colorClass = "bg-green-100 text-green-800 border-green-200";
        break;
      case "FAILED":
        colorClass = "bg-red-100 text-red-800 border-red-200";
        break;
    }
  } else if (variant === "classification") {
    switch (normalizedStatus) {
      case "HOT":
        colorClass = "bg-red-100 text-red-800 border-red-200";
        break;
      case "WARM":
        colorClass = "bg-orange-100 text-orange-800 border-orange-200";
        break;
      case "CURIOUS":
        colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
        break;
      case "NEUTRAL":
        colorClass = "bg-gray-100 text-gray-800 border-gray-200";
        break;
      case "OBJECTION":
        colorClass = "bg-purple-100 text-purple-800 border-purple-200";
        break;
      case "NOT_INTERESTED":
      case "UNSUBSCRIBE":
        colorClass = "bg-red-100 text-red-800 border-red-200";
        break;
      case "OUT_OF_OFFICE":
        colorClass = "bg-blue-100 text-blue-800 border-blue-200";
        break;
    }
  }

  // Get color for the dot indicator
  const dotColorClass = colorClass.split(" ")[1].replace("text-", "bg-");

  return (
    <Badge variant="outline" className={cn("flex w-fit items-center gap-1.5 px-2 py-0.5", colorClass, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColorClass)} />
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
