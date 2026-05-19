import type { Metadata, Viewport } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "ولد أم بنت — اختر",
  description: "صوّت بين ولد وبنت — صفحة واحدة، صوت واحد.",
};

export const viewport: Viewport = {
  themeColor: "#FAFAF7",
  width: "device-width",
  initialScale: 1,
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
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800&family=Tajawal:wght@400;500;700&family=Amiri:wght@400;700&family=Reem+Kufi:wght@400;700&family=Fraunces:opsz,wght@9..144,400;9..144,600&family=DM+Sans:wght@400;500;700&display=swap"
        />
      </head>
      <body className="font-ar" style={{ ["--font-ar" as never]: "Cairo, system-ui" }}>
        <a href="#main" className="skip-link">
          تخطّ إلى المحتوى
        </a>
        <main id="main" className="h-dvh w-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
