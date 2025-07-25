import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-6">Sorry, the page you are looking for does not exist.</p>
      <Link href="/" className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors">
        Go to Homepage
      </Link>
    </main>
  );
} 