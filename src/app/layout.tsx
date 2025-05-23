import type React from "react"
import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { NavbarDemo } from "@/components/Navbar"
import { Spotlight } from "@/components/ui/Spotlight"
import { Footer } from "@/components/Footer"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Priyanshu Singh | Full Stack Developer",
  viewport: "width=device-width, initial-scale=1",
  appleWebApp: {
    capable: true,
    title: "Priyanshu Singh | Full Stack Developer",
    statusBarStyle: "black-translucent",
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
  openGraph: {
    title: "Priyanshu Singh | Full Stack Developer",
    description: "Portfolio website of Priyanshu Singh, a Full Stack Developer specializing in modern web technologies.",
    url: "https://my-portfolio-chi-two-59.vercel.app",
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
  description: "Portfolio website of Priyanshu Singh, a Full Stack Developer specializing in modern web technologies.",
  keywords: ["developer", "full stack", "react", "next.js", "portfolio", "Priyanshu Singh"],
  authors: [{ name: "Priyanshu Singh" }],
  creator: "Priyanshu Singh",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <NavbarDemo />
          <div className="fixed md:top-4 md:right-4 z-10 bottom-4 right-4">
            {/* <ModeToggle /> */}
          </div>
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          <div className="relative w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2]">
            <Spotlight className="-top-[25rem] left-0 md:left-60 md:-top-20" fill="white" />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
