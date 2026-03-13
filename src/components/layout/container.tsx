import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Main content container
 * Provides consistent max-width and padding
 */
export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[1600px] px-xl ${className}`}>
      {children}
    </div>
  );
}
