"use client";

import React from "react";

interface TextRollProps {
  text: string;
  className?: string;
  active?: boolean;
}

export default function TextRoll({ text, className = "", active = false }: TextRollProps) {
  return (
    <span
      className={`relative inline-flex flex-col overflow-hidden leading-tight group ${className}`}
    >
      <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
        {text}
      </span>
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-full group-hover:translate-y-0 text-accent"
      >
        {text}
      </span>
    </span>
  );
}
