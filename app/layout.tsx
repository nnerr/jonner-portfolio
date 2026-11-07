import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { SITE_URL, profile } from "@/lib/content";
import "./globals.css";

// Names and headings: an elegant serif.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

// Labels, buttons and reading text: a clean geometric sans.
const jost = Jost({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-jost",
  display: "swap",
});

const description =
  "Software developer from Manila. Explore a map of my work: a Ruby on Rails internship, SmishX (an SMS phishing detector), and the teams I've led.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.shortName} · ${profile.role}`,
    template: `%s · ${profile.shortName}`,
  },
  description,
  keywords: [
    "Jonner Villapando",
    "software developer",
    "full stack developer",
    "Ruby on Rails",
    "Next.js",
    "machine learning",
    "portfolio",
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.shortName} · ${profile.role}`,
    description,
    type: "website",
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.shortName} · ${profile.role}`,
    description,
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
      className={`${cormorant.variable} ${jost.variable} antialiased`}
    >
      <body className="min-h-svh">{children}</body>
    </html>
  );
}
