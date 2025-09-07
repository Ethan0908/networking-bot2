import * as React from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange?.(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

export function DialogTrigger({ children }: { children?: React.ReactNode; asChild?: boolean }) {
  return null;
}

export function DialogContent({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`bg-white p-4 rounded shadow ${className}`} {...props} />;
}

export function DialogHeader({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-4 ${className}`} {...props} />;
}

export function DialogFooter({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mt-4 text-right ${className}`} {...props} />;
}

export function DialogTitle({ className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-lg font-semibold ${className}`} {...props} />;
}
