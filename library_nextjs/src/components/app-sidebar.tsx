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
import {
  Calendar,
  LayoutDashboard,
  Book,
  SquareLibrary,
  Tag,
  Inbox,
  Search,
  Settings,
  LayoutList,
} from "lucide-react";
import Link from "next/link";

// Menu items.
const homeItems = [
  {
    title: "Tổng quát",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
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
    url: "#",
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
    url: "#",
    icon: Tag,
  },
];
const humanResourceItems = [
  {
    title: "Quản lý nhân viên",
    url: "#",
    icon: LayoutDashboard,
  },
  {
    title: "Quản lý người dùng",
    url: "#",
    icon: Inbox,
  },
];

export function AppSidebar() {
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
          <SidebarGroupLabel>Nhân sự</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {humanResourceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
