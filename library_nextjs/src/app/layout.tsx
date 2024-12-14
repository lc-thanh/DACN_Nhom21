import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AppProvider from "@/app/AppProvider";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Quản lý thư viện",
  description: "Website Quản lý thư viện Trường Đại học Công nghiệp Hà Nội",
};

const inter = Inter({
  subsets: ["vietnamese"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const refreshToken = cookieStore.get("refreshToken");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider
            initTokens={{
              accessToken: accessToken?.value,
              refreshToken: refreshToken?.value,
            }}
          >
            {children}
          </AppProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
