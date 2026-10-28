import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://princelab.id"),
  title: {
    default: "PRINCE LAB — Learn. Build. Share.",
    template: "%s | PRINCE LAB",
  },
  description:
    "Personal tech brand & digital project studio untuk IT students dan pemula. Mempelajari teknologi, membangun produk digital, dan membagikan prosesnya.",
  keywords: [
    "PRINCE LAB",
    "Digital Project Studio",
    "Personal Tech Brand",
    "IT Students",
    "Web Development",
    "Belajar Koding",
  ],
  authors: [{ name: "PRINCE LAB" }],
  openGraph: {
    title: "PRINCE LAB — Learn. Build. Share.",
    description: "Digital project studio & personal tech brand untuk IT students dan pemula.",
    url: "https://princelab.id",
    siteName: "PRINCE LAB",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 800,
        alt: "Logo PRINCE LAB",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#101116",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${mono.variable} dark`}>
      <body className="bg-canvas text-text-primary antialiased selection:bg-primary/20 selection:text-primary min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
