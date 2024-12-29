import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { AppHeader } from "@/components/app-header";
import { MemberSidebar } from "@/components/member-sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <MemberSidebar />
      <main className="pe-2 ps-2 md:ps-0 pb-2 w-full">
        <AppHeader />
        {children}
      </main>
    </SidebarProvider>
  );
}
