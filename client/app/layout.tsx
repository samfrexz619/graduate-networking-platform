import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-jetBrainsMono'
});


export const metadata: Metadata = {
  title: "CareerConnect",
  description: "AI-powered professional networking for students and graduates in the UK.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, "font-sans", inter.variable, jetBrainsMono.variable, "font-jetBrainsMono")}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
