import { GitHubLogoIcon } from "@radix-ui/react-icons"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full py-6 px-4 border-t">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Priyanshu Singh. All rights reserved.
        </p>
        <Link 
          href="https://github.com/priyanshusingh305" 
          target="_blank" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <GitHubLogoIcon className="h-4 w-4" />
          <span>View Source</span>
        </Link>
      </div>
    </footer>
  )
} 