"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Profile } from "@/lib/evaluation";
import { ConsultationDialog } from "./consultation-dialog";

const ConsultationContext = createContext<((source: string) => void) | null>(
  null,
);

export function ConsultationProvider({
  children,
  profile,
}: {
  children: ReactNode;
  profile: Profile;
}) {
  const [request, setRequest] = useState<{
    source: string;
    profile: Profile;
  } | null>(null);
  return (
    <ConsultationContext.Provider
      value={(source) => setRequest({ source, profile: { ...profile } })}
    >
      {children}
      {request && (
        <ConsultationDialog
          source={request.source}
          profile={request.profile}
          onClose={() => setRequest(null)}
        />
      )}
    </ConsultationContext.Provider>
  );
}

export function ConsultationTrigger({
  children,
  className,
  source,
}: {
  children: ReactNode;
  className?: string;
  source: string;
}) {
  const open = useContext(ConsultationContext);
  if (!open)
    throw new Error("ConsultationTrigger must be inside ConsultationProvider.");
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={() => open(source)}
    >
      {children}
    </button>
  );
}
