import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import { SwRegister } from "@/components/SwRegister";

export const metadata: Metadata = {
  title: "ولد أم بنت — اختر",
  description: "صوّت بين ولد وبنت — صفحة واحدة، صوت واحد.",
  manifest: "/manifest.webmanifest",
  applicationName: "ولد أم بنت",
  appleWebApp: {
    capable: true,
    title: "ولد أم بنت",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#FAFAF7" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800&family=Tajawal:wght@400;500;700&family=Amiri:wght@400;700&family=Reem+Kufi:wght@400;700&display=swap"
        />
      </head>
      <body className="font-ar" style={{ ["--font-ar" as never]: "Cairo, system-ui" }}>
        <a href="#main" className="skip-link">
          تخطّ إلى المحتوى
        </a>
        <main id="main" className="h-dvh w-screen">
          {children}
        </main>
        <SwRegister />
      </body>
    </html>
  );
}
