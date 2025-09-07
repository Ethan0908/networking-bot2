"use client";
import React from "react";

export function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`border rounded px-2 py-1 ${className}`} {...props} />;
}
