import { ReactNode } from "react";
import { Sidebar } from "./sidebar";

interface AppShellProps {
  children: ReactNode;
}

/**
 * Main application shell
 * Provides the overall layout structure with sidebar and content area
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main content area - offset by sidebar width on desktop */}
      <main className="lg:pl-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
