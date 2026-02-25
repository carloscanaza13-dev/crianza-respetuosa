import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Asistente IA en Crianza Respetuosa",
  description: "Herramienta psicoeducativa para padres de niños de 3 a 10 años. Orientación basada en disciplina positiva, psicología adleriana y neurociencia del desarrollo.",
  keywords: ["crianza respetuosa", "disciplina positiva", "padres", "educación", "psicología infantil", "TDAH", "berrinches", "límites"],
  authors: [{ name: "Proyecto de Investigación en Crianza" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/logo.svg", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" }
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Crianza Respetuosa"
  },
  openGraph: {
    title: "Asistente IA en Crianza Respetuosa",
    description: "Orientación práctica basada en disciplina positiva para padres de niños de 3-10 años",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#5B8C5A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('SW registered: ', registration);
                    },
                    function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    }
                  );
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
