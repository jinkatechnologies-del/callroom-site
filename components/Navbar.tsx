import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/our-story", label: "Our Story" },
  { href: "/faq", label: "FAQ" },
  { href: "/support", label: "Support" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/brand/logo-icon-transparent.png"
            alt="CallRoom"
            width={28}
            height={28}
            className="h-7 w-7"
            priority
          />
          <span className="text-[17px] font-extrabold tracking-tight">
            <span className="font-medium text-foreground">Call</span>
            <span className="text-accent">Room</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden text-sm font-medium text-muted transition-colors hover:text-foreground sm:block"
          >
            Sign In
          </Link>
          <Link
            href="/get-started"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
