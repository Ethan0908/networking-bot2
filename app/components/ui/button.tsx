import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  size?: string;
}

export function Button({ variant, size, ...props }: ButtonProps) {
  return <button {...props} />;
}
