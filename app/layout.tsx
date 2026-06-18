import type { Metadata } from "next";
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// 1. Configure the fonts
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter", // Creates a CSS variable for Tailwind
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-poppins",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const siteUrl = "https://nammarust-community.netlify.app/"; 

export const metadata: Metadata = {
  title: "NammaRust | The Premier Rust Programming Community in India",
  description: "Join NammaRust to learn, share, and build high-performance software with the Rust programming language. Connect with developers, engineers, and creators in Chennai and beyond.",
  keywords: ["Tamil", "Rust", "Rustlang", "Chennai", "Tamil Nadu", "India", "Programming Community", "Developers", "Software Engineering", "Systems Programming"],
  authors: [{ name: "NammaRust Community" }],
  metadataBase: new URL(siteUrl),
  
  // Open Graph (For LinkedIn, Discord, Facebook)
  openGraph: {
    title: "NammaRust | Where Rust Becomes Craft",
    description: "Join India's premier Rust programming community.",
    url: siteUrl,
    siteName: "NammaRust",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "NammaRust Community Banner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  

  // Twitter Card (For Twitter)
  twitter: {
    card: "summary_large_image",
    title: "NammaRust | Where Rust Becomes Craft",
    description: "Join India's premier Rust programming community.",
    images: ["/assets/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased font-inter" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
