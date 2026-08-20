import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interview Handbook",
  description: "A living technical interview playbook for software, ML, research, and systems roles.",
  openGraph: {
    title: "Interview Handbook",
    description: "Prepare to reason, not recite.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Interview Handbook" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>;
}
