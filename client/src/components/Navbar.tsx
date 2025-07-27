"use client"
import { useState, useEffect } from "react"
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu"
import { cn } from "@/lib/utils"
import { ModeToggle } from "./ui/toggle-mode"
import { MenuIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import Link from "next/link"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full">
      <div
        className={cn(
          "w-full transition-all duration-300 ",
          isScrolled ? "md:bg-transparent md:backdrop-blur-none md:shadow-none bg-background/80 backdrop-blur-md shadow-sm py-2" : "py-4",
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          {/* Logo */}
          <Link href="/#home" className="text-xl font-bold z-50">
            Priyanshu Singh
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <DesktopNav />
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <MobileNav />
            <ModeToggle />
          </div>

          {/* Mode Toggle (Desktop) */}
          <div className="hidden md:block">
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}

function DesktopNav() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className="relative z-50">
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Home">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/#home">Home</HoveredLink>
            <HoveredLink href="/#about">About</HoveredLink>
            <HoveredLink href="/#tech-stack">Tech Stack</HoveredLink>
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Experience">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/#education">Education</HoveredLink>
            <HoveredLink href="/#experience">Work Experience</HoveredLink>
          </div>
        </MenuItem>

        {/* Projects - Simple link without dropdown */}
        <Link href="/#projects" className="text-sm font-medium hover:text-primary transition-colors px-4 py-2">
          Projects
        </Link>

        {/* Blogs - Simple link without dropdown */}
        <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors px-4 py-2">
          Blogs
        </Link>

        <MenuItem setActive={setActive} active={active} item="Contact">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/#contact">Get in Touch</HoveredLink>
            <HoveredLink href="https://github.com/priyanshusingh305" target="_blank">
              GitHub
            </HoveredLink>
            <HoveredLink href="https://www.linkedin.com/in/akapriyanshudev" target="_blank">
              LinkedIn
            </HoveredLink>
            <HoveredLink href="https://twitter.com/akapriyanshudev" target="_blank">
              Twitter
            </HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  )
}

function MobileNav() {
  const navItems = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "Tech Stack", href: "/#tech-stack" },
    { name: "Education", href: "/#education" },
    { name: "Experience", href: "/#experience" },
    { name: "Projects", href: "/#projects" },
    { name: "Blogs", href: "/blog" },
    { name: "Contact", href: "/#contact" },
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu">
          <MenuIcon className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-8 mt-2">
            <h2 className="text-lg font-bold">Navigation</h2>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <SheetTrigger key={item.name} asChild>
                <Link
                  href={item.href}
                  className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-accent transition-colors"
                >
                  {item.name}
                </Link>
              </SheetTrigger>
            ))}
          </nav>
          <div className="mt-auto mb-8">
            <div className="flex flex-col gap-4 mt-8">
              <h3 className="text-sm font-semibold text-muted-foreground px-4">Social Links</h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="https://github.com/priyanshusingh305"
                  target="_blank"
                  className="flex items-center px-4 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                >
                  GitHub
                </Link>
                <Link
                  href="https://www.linkedin.com/in/akapriyanshudev"
                  target="_blank"
                  className="flex items-center px-4 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                >
                  LinkedIn
                </Link>
                <Link
                  href="https://twitter.com/akapriyanshudev"
                  target="_blank"
                  className="flex items-center px-4 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                >
                  Twitter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
