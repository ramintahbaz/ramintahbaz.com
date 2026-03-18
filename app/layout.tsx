import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import Navigation from "@/components/Navigation";
import TopBar from "@/components/TopBar";
import HiddenMetadata from "@/components/HiddenMetadata";
import { CategoryFilterProvider } from "@/contexts/CategoryFilterContext";
import { SplashProvider } from "@/contexts/SplashContext";
import NeuralPortfolioLayer from "@/app/NeuralPortfolioLayer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ramin Tahbaz - Design Engineer",
  description:
    "Designer who codes, working across product, film, hardware, and writing. Self-taught, learning by doing.",
  themeColor: "#000000",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Ramin Tahbaz - Design Engineer",
    description:
      "Designer who codes, working across product, film, hardware, and writing. Self-taught, learning by doing.",
    url: "https://ramintahbaz.com",
    siteName: "Ramin Tahbaz - Design Engineer",
    images: [
      {
        url: "/images/share-og.png",
        width: 1200,
        height: 630,
        alt: "Ramin Tahbaz - Design Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ramin Tahbaz - Design Engineer",
    description:
      "Designer who codes, working across product, film, hardware, and writing. Self-taught, learning by doing.",
    images: ["/images/share-og.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ramin",
    "jobTitle": "Designer",
    "description": "Designer who codes, working across product, film, hardware, and writing. Self-taught, learning by doing.",
    "url": "https://ramintahbaz.com",
    "sameAs": [
      "https://x.com/ramintahbaz"
    ]
  };

  return (
    <html lang="en" style={{ backgroundColor: '#000' }}>
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  var isMobile = window.innerWidth < 768;
  var leftForWork = localStorage.getItem('leftForWork') === 'true';
  if (isMobile && !leftForWork) {
    document.head.insertAdjacentHTML('beforeend', '<style>.splash-hidden{display:none}</style>');
  }
})();
`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexMono.variable} font-sans antialiased bg-black`}
        style={{ backgroundColor: '#000', minHeight: '100dvh' }}
      >
        <Script
          id="bfcache-detect"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
  window.__fromBFCache = false;
  window.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      window.__fromBFCache = true;
      sessionStorage.setItem('splashDone', 'true');
    }
  });
`,
          }}
        />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <CategoryFilterProvider>
          <SplashProvider>
            <Suspense fallback={<div className="h-12 shrink-0" />}>
              <TopBar />
            </Suspense>
            <div
              className="pt-12 bg-black"
              style={{ height: '100dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <Suspense fallback={null}>
              <NeuralPortfolioLayer />
            </Suspense>
              <div id="main-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', position: 'relative', zIndex: 1 }}>
                {children}
              </div>
            </div>
          </SplashProvider>
        </CategoryFilterProvider>

        {/* Bottom Navbar (global, non-animated) — hidden for now */}
        {/* <Navigation /> */}
        
        {/* Hidden metadata for AI crawlers and search tools */}
        <HiddenMetadata />
      </body>
    </html>
  );
}
