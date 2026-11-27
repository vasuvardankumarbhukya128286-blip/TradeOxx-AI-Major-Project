"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/register" || pathname?.startsWith("/auth");
  const isAppRoute = pathname?.startsWith("/dashboard") || 
                     pathname?.startsWith("/profile") || 
                     pathname?.startsWith("/settings");

  const hideNavbarFooter = isAppRoute || isAuthRoute;

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!hideNavbarFooter && <Footer />}
    </>
  );
}
