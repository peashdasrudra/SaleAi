"use client";

import * as React from "react";
import { ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComplianceWarningProps {
  show?: boolean;
  context?: "import" | "campaign" | "general";
}

export function ComplianceWarning({ show = true, context = "general" }: ComplianceWarningProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      const dismissed = localStorage.getItem(`compliance-warning-dismissed-${context}`);
      if (!dismissed) {
        setIsVisible(true);
      }
    }
  }, [show, context]);

  const handleDismiss = () => {
    localStorage.setItem(`compliance-warning-dismissed-${context}`, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="mb-4 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm">
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      <div className="flex-1 text-sm">
        <p className="font-medium text-amber-800">Compliance Notice</p>
        <p className="mt-1 text-amber-700">
          Only contact business prospects where your outreach has a lawful basis. Verify applicable US, UK, platform, privacy, and email-marketing rules before sending.
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 text-amber-600 hover:bg-amber-100 hover:text-amber-900"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </Button>
    </div>
  );
}
