import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import { fontBody, fontDisplay } from "@/utils/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.meta.title,
  description: siteConfig.meta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
