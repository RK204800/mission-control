import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import DashboardLayout from "@/components/DashboardLayout";

export const metadata: Metadata = {
  title: "Mission Control | OpenClaw",
  description: "OpenClaw Mission Control Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            <DashboardLayout>
              {children}
            </DashboardLayout>
          </main>
        </div>
      </body>
    </html>
  );
}