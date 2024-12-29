import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AccountMenu from "@/components/account-menu";
import accountApiRequests from "@/apiRequests/account";
import { cookies } from "next/headers";
import Image from "next/image";

export async function AppHeader() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  const { payload } = await accountApiRequests.me(accessToken?.value);

  return (
    <header className="sticky rounded-b-xl px-2 top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center gap-2 justify-between">
        <SidebarTrigger className="px-2" />

        <Link href="/" className="mr-2 flex items-center md:mr-6 md:space-x-2">
          <Image src="/logo.png" width={20} height={20} alt="AppLogo" />
          <span className="hidden font-bold md:inline-block whitespace-nowrap">
            Quản lý thư viện
          </span>
        </Link>
        <nav className="sm:flex items-center ms-4 gap-6 text-sm hidden">
          <Link
            href="https://www.haui.edu.vn/vn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 transition-colors hover:text-foreground"
          >
            Trường ĐHCN Hà Nội
          </Link>
          <Link
            href="https://fit.haui.edu.vn/vn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 transition-colors hover:text-foreground"
          >
            Khoa CNTT
          </Link>
        </nav>
        <nav className="flex flex-1 w-fit items-center justify-end">
          <ModeToggle />
          <AccountMenu accountName={payload.fullName} />
        </nav>
      </div>
    </header>
  );
}
