import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: "Pop Series — รวมข่าวสาร ซีรีส์ หนัง และศิลปินเกาหลี",
    template: "%s · Pop Series",
  },
  description:
    "เว็บไซต์รวมข่าวสารวงการบันเทิงเกาหลี K-POP ซีรีส์ หนัง และศิลปิน อัปเดตทุกวัน",
  metadataBase: new URL("https://www.popseries.co"),
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Google+Sans:400,500,700&display=swap"
        />
        <link rel="stylesheet" href="https://use.typekit.net/znv5ilf.css" />
      </head>
      <body className="min-h-screen flex flex-col bg-cream text-ink-900">
        <SiteHeader />
        <main className="flex-1 flex flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
