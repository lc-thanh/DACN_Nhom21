import Link from "next/link";
import { LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="sticky rounded-b-xl px-2 top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center">
        <SidebarTrigger className="me-2" />

        <Link href="/" className="mr-2 flex items-center md:mr-6 md:space-x-2">
          <LayoutGrid className="size-4" aria-hidden="true" />
          <span className="hidden font-bold md:inline-block whitespace-nowrap">
            Quản lý thư viện
          </span>
        </Link>
        <nav className="flex w-full items-center gap-6 text-sm">
          <Link
            href="https://www.sadmn.com/blog/shadcn-table"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 transition-colors hover:text-foreground"
          >
            Docs
          </Link>
        </nav>
        <nav className="flex flex-1 items-center md:justify-end">
          <Button variant="ghost" size="icon" className="size-8" asChild>
            Button
            {/* <Link
              aria-label="GitHub repo"
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.gitHub className="size-4" aria-hidden="true" />
            </Link> */}
          </Button>
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
