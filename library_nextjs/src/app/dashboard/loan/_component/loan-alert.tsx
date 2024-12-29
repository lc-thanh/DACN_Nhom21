import { AlertCircle } from "lucide-react";
import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function LoanAlert({ loanWarning }: { loanWarning: string[] }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AlertCircle className="text-red-500" size={20} />
        </TooltipTrigger>
        <TooltipContent>
          {loanWarning.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
