import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://callroom.md"),
  title: "CallRoom | Modern Medicine's Home Screen",
  description:
    "CallRoom is the clinical workflow and shift management app built for residents: schedules, task boards, AI-assisted notes, and case prep, all in one place.",
  openGraph: {
    title: "CallRoom | Modern Medicine's Home Screen",
    description:
      "The clinical workflow app built for residents: schedules, task boards, AI-assisted notes, and case prep, all in one place.",
    url: "https://callroom.md",
    siteName: "CallRoom",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CallRoom | Modern Medicine's Home Screen",
    description:
      "The clinical workflow app built for residents: schedules, task boards, AI-assisted notes, and case prep, all in one place.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
