import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-bg-subtle border-t border-border py-6 mt-16">
      <div className="max-w-6xl mx-auto flex flex-wrap gap-6 justify-center text-sm">
        <Link href="/privacy-policy" className="hover:text-primary">
          Privacy Policy
        </Link>
        <Link href="/non-refund-policy" className="hover:text-primary">
          Non-Refund Policy
        </Link>
        <Link href="/confidentiality-policy" className="hover:text-primary">
          Confidentiality Policy
        </Link>
      </div>
    </footer>
  );
}
