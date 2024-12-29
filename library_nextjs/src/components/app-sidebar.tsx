import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { decodeJWT } from "@/lib/utils";
import {
  LayoutDashboard,
  Book,
  SquareLibrary,
  Tag,
  LayoutList,
  BriefcaseBusiness,
  Users,
} from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

// Menu items.
const homeItems = [
  {
    title: "Tổng quát",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
];
const bookManagementItems = [
  {
    title: "Quản lý sách",
    url: "/dashboard/book",
    icon: Book,
  },
  {
    title: "Quản lý tủ/ngăn sách",
    url: "/dashboard/cabinets_bookshelves",
    icon: SquareLibrary,
  },
  {
    title: "Quản lý danh mục",
    url: "/dashboard/category",
    icon: LayoutList,
  },
];
const loanManagementItems = [
  {
    title: "Quản lý phiếu mượn",
    url: "/dashboard/loan",
    icon: Tag,
  },
];

export async function AppSidebar() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const jwtPayload = accessToken ? decodeJWT(accessToken) : null;
  const isAdmin = jwtPayload?.role === "Admin";

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Hệ thống</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {homeItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Quản lý mượn/trả</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {loanManagementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Sách</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {bookManagementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Tài khoản</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isAdmin && (
                <SidebarMenuItem key="Quản lý nhân sự">
                  <SidebarMenuButton asChild>
                    <a href="/dashboard/staff">
                      <BriefcaseBusiness />
                      <span>Quản lý nhân sự</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem key="Quản lý thành viên">
                <SidebarMenuButton asChild>
                  <a href="/dashboard/member">
                    <Users />
                    <span>Quản lý thành viên</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
