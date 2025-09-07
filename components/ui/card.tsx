import * as React from "react";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  (props, ref) => <h3 ref={ref} {...props} />
);
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
);
CardContent.displayName = "CardContent";
