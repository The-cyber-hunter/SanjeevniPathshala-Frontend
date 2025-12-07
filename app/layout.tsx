import "./globals.css";
import type { Metadata } from "next";
import ClientLayoutWrapper from "./clientlayoutwrapper";

export const metadata: Metadata = {
  title: "Sanjeevni Pathshala",
  description: "Best coaching institute guiding students to success",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased min-h-screen bg-gradient-to-b from-yellow-50 via-pink-50 to-purple-50 text-gray-900">
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
