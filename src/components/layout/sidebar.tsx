"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "Liquidity", href: "/liquidity" },
  { label: "Stablecoins", href: "/stablecoins" },
  { label: "Signals", href: "/signals" },
];

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-sm border-b border-border p-lg">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
          <span className="text-sm font-bold text-accent-foreground">SL</span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight text-foreground">
            Stablecoin
          </span>
          <span className="text-xs leading-tight text-foreground-muted">
            Liquidity Monitor
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-xs overflow-y-auto p-md">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={[
                "block rounded-md px-md py-sm text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-surface text-accent"
                  : "text-foreground-muted hover:bg-surface-muted hover:text-foreground",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-md">
        <p className="text-xs text-foreground-subtle">v0.1.0 • MVP</p>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-md top-md z-50 rounded-md border border-border bg-surface p-sm text-foreground transition-colors hover:bg-surface-muted lg:hidden"
        aria-label="Open menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-surface lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-surface transition-transform duration-200 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-end border-b border-border p-md">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md border border-border bg-surface p-sm text-foreground transition-colors hover:bg-surface-muted"
            aria-label="Close menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <SidebarContent pathname={pathname} onNavigate={() => setIsOpen(false)} />
      </aside>
    </>
  );
}