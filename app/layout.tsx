import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jonner Villapando — Software Developer",
    template: "%s | Jonner Villapando",
  },
  description:
    "Portfolio of Jonner D. Villapando — Computer Science graduate from FEU Institute of Technology with Ruby on Rails, Next.js, and machine learning experience.",
  keywords: [
    "Jonner Villapando",
    "software developer",
    "full stack developer",
    "Ruby on Rails",
    "Next.js",
    "portfolio",
  ],
  authors: [{ name: "Jonner D. Villapando" }],
  openGraph: {
    title: "Jonner Villapando — Software Developer",
    description:
      "Computer Science graduate building practical software. Ruby on Rails, Next.js, and applied machine learning.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jonner Villapando — Software Developer",
    description:
      "Computer Science graduate building practical software. Ruby on Rails, Next.js, and applied machine learning.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}