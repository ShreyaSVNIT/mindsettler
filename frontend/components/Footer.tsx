import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-bg-subtle border-t border-border pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
        
        {/* Branding Section */}
        <div className="flex flex-col gap-4">
          <h3 className="font-title text-2xl text-primary">MindSettler</h3>
          <p className="text-text-body opacity-80 leading-relaxed max-w-xs">
            Your digital sanctuary for mental well-being. Connecting you with 
            professional support for a clearer, more compassionate life.
          </p>
        </div>

        {/* Policies Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-text-body uppercase tracking-widest text-xs">Legal & Policies</h4>
          <nav className="flex flex-col gap-3">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/non-refund-policy" className="hover:text-primary transition-colors">
              Non-Refund Policy
            </Link>
            <Link href="/confidentiality-policy" className="hover:text-primary transition-colors">
              Confidentiality Policy
            </Link>
          </nav>
        </div>

        {/* Quick Links / Contact Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-text-body uppercase tracking-widest text-xs">Connect</h4>
          <nav className="flex flex-col gap-3">
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <a href="mailto:hello@mindsettler.com" className="hover:text-primary transition-colors">
              hello@mindsettler.com
            </a>
          </nav>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-border/50 text-xs text-center opacity-60">
        <p>© {new Date().getFullYear()} MindSettler. All rights reserved.</p>
      </div>
    </footer>
  );
}