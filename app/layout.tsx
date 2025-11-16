
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { ThemeToggler } from "./componentss/Theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Hinglish Support: Noto Sans for English and Noto Sans Devanagari for Hindi
const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-sans-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "capsify",
  description: "Capsify. An AI-Integrated web application used to generate and add captions using Assembly AI plus Roomable . ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSans.variable} ${notoSansDevanagari.variable} antialiased`}
      >
         <ThemeToggler/> 
        {children}
      </body>
    </html>
  );
}
