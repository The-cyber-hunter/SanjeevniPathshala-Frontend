"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface Props {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({ children }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/Bosspannel");

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? "" : "pt-20"}>{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
