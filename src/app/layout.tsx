import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme/ThemeProvider";
import { BottomDockBar } from "@/components/BottomDockBar";
import { PageTransition } from "@/components/PageTransition";
import { GlobalChatButton } from "@/components/GlobalChatButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MJBlog",
  description: "Blog de viajes en pareja",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider><PageTransition>{children}</PageTransition><BottomDockBar /><GlobalChatButton /></ThemeProvider>

      </body>
    </html>
  );
}
