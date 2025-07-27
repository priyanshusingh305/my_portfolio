import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import { Spotlight } from "@/components/ui/Spotlight";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Priyanshu Singh | Full Stack Developer",
  description: "Portfolio website of Priyanshu Singh, a Full Stack Developer specializing in modern web technologies.",
  keywords: ["developer", "full stack", "react", "next.js", "portfolio", "Priyanshu Singh"],
  authors: [{ name: "Priyanshu Singh" }],
  creator: "Priyanshu Singh",
  metadataBase: new URL("https://www.priyanshu.xyz"),
  alternates: {
    canonical: "/",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  icons: {
    icon: "/pfp.jpg",
    shortcut: "/pfp.jpg",
    apple: "/pfp.jpg",
  },
  appleWebApp: {
    capable: true,
    title: "Priyanshu Singh | Full Stack Developer",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Priyanshu Singh | Full Stack Developer",
    description: "Portfolio website of Priyanshu Singh, a Full Stack Developer specializing in modern web technologies.",
    url: "https://www.priyanshu.xyz",
    siteName: "Priyanshu Singh | Full Stack Developer",
    locale: "en-US",
    type: "website",
    images: [
      {
        url: "/pfp.jpg",
        width: 800,
        height: 600,
        alt: "Priyanshu Singh | Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Priyanshu Singh | Full Stack Developer",
    description: "Portfolio website of Priyanshu Singh, a Full Stack Developer specializing in modern web technologies.",
    images: ["/pfp.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Priyanshu Singh",
  "jobTitle": "Full Stack Developer",
  "url": "https://www.priyanshu.xyz",
  "sameAs": [
    "https://www.priyanshu.xyz"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "Freelance"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem 
          disableTransitionOnChange
        >
          <Navbar />
          
          {/* Background Elements */}
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          
          <div className="relative w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2]">
            <Spotlight 
              className="-top-[25rem] left-0 md:left-60 md:-top-20" 
              fill="white" 
            />
            
            <main>
              {children}
            </main>
            
            <Footer />
          </div>
          
          <Toaster />
        </ThemeProvider>

        {/* Analytics Script */}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="1184f271-099b-44fb-a3cb-d6021382a74d"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}