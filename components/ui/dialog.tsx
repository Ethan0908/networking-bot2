import * as React from "react";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContextValue {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined);

export function Dialog({ open = false, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {open ? <div>{children}</div> : null}
    </DialogContext.Provider>
  );
}

export const DialogTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, ...props }, ref) => {
    const ctx = React.useContext(DialogContext);
    return (
      <button
        ref={ref}
        {...props}
        onClick={(e) => {
          ctx?.onOpenChange?.(!ctx.open);
          onClick?.(e);
        }}
      />
    );
  }
);
DialogTrigger.displayName = "DialogTrigger";

export const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
);
DialogContent.displayName = "DialogContent";

export const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
);
DialogHeader.displayName = "DialogHeader";

export const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
);
DialogFooter.displayName = "DialogFooter";

export const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  (props, ref) => <h3 ref={ref} {...props} />
);
DialogTitle.displayName = "DialogTitle";
