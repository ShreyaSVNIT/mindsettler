import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-bg-app border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="text-2xl font-title text-primary">
          MindSettler
        </Link>

        {/* Navigation */}
        <nav className="flex gap-6 text-sm">
          <Link
            href="/"
            className="hover:text-primary transition"
          >
            Home
          </Link>
          <Link
            href="/privacy-policy"
            className="hover:text-primary transition"
          >
            Privacy
          </Link>
          <Link
            href="/contact"
            className="hover:text-primary transition"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
