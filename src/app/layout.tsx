import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { Providers } from "@/components/providers";
import { baseMetadata } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = baseMetadata();

export const viewport: Viewport = { themeColor: "#0C1F3F" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
          <div className="h-16 md:hidden" aria-hidden />
          <BottomNav />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  );
}
