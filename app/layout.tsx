import type { Metadata } from "next";
import { Fraunces, IM_Fell_English_SC, Literata } from "next/font/google";
import { SITE_URL, profile } from "@/lib/content";
import "./globals.css";

// Engraved small caps for map labels, kickers and the legend.
const fell = IM_Fell_English_SC({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fell",
  display: "swap",
});

// Headings and the name.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

// Body text.
const literata = Literata({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-literata",
  axes: ["opsz"],
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
      className={`${fell.variable} ${fraunces.variable} ${literata.variable} antialiased`}
    >
      <body className="min-h-svh">{children}</body>
    </html>
  );
}
