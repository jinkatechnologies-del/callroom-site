import Link from "next/link";
import Image from "next/image";

const legalLinks = [
  { href: "/security", label: "Security & Trust" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/hipaa", label: "HIPAA Compliance" },
];

const socialLinks = [
  { href: "https://www.tiktok.com/", label: "TikTok" },
  { href: "https://www.instagram.com/", label: "Instagram" },
  { href: "https://www.linkedin.com/", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-2.5">
            <Image
              src="/brand/logo-icon-transparent.png"
              alt="CallRoom"
              width={24}
              height={24}
              className="h-6 w-6 opacity-80"
            />
            <p className="text-sm font-semibold text-foreground">CallRoom</p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex gap-5">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://jinkatechnologies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground hover:underline"
            >
              Jinka Technologies, Inc.
            </a>{" "}
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
