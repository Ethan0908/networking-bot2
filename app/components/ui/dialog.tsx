"use client";
import React from "react";

interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, children }: DialogProps) {
  if (!open) return null;
  return <div className="fixed inset-0 flex items-center justify-center bg-black/50">{children}</div>;
}

export function DialogTrigger({ children }: { children: React.ReactNode; asChild?: boolean }) {
  return <>{children}</>;
}

export function DialogContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`bg-white p-4 rounded shadow-md ${className}`} {...props} />;
}

export function DialogHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />;
}

export function DialogFooter({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />;
}

export function DialogTitle({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={`text-lg font-semibold ${className}`} {...props} />;
}
