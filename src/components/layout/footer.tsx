import Link from "next/link"
import { Stethoscope, Mail, Twitter, Linkedin, Instagram, Youtube, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { APP_NAME } from "@/lib/constants"

const footerLinks = {
  resources: [
    { href: "/resources/notes", label: "Study Notes" },
    { href: "/resources/practice-exams", label: "Practice Exams" },
    { href: "/resources/care-plans", label: "Care Plans" },
    { href: "/resources/nclex", label: "NCLEX Prep" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
    { href: "/resources", label: "All Resources" },
  ],
  support: [
    { href: "/contact", label: "Help Center" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/#faq", label: "FAQ" },
  ],
}

const socialLinks = [
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter section */}
      <div className="border-b border-background/10">
        <div className="container py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold">Stay updated</h3>
              <p className="mt-2 text-background/60 max-w-md">
                Get notified about new resources, study tips, and exclusive offers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 px-4 rounded-lg bg-background/10 border border-background/20 text-background placeholder:text-background/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="lg" className="h-12 px-6 whitespace-nowrap">
                Subscribe
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
              <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
                <Stethoscope className="size-5 text-primary-foreground" />
              </div>
              <span>
                <span className="text-background/60 font-medium">nurse</span>
                <span className="text-primary">hub</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-background/60 max-w-xs leading-relaxed">
              The #1 study platform for nursing students. Curated resources to help you study smarter and pass faster.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 rounded-lg bg-background/10 flex items-center justify-center text-background/60 hover:bg-primary hover:text-primary-foreground transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-background/90 mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background/90 mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background/90 mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background/90 mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@nursehub.com"
                  className="flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors"
                >
                  <Mail className="size-4" />
                  hello@nursehub.com
                </a>
              </li>
              <li className="text-sm text-background/60">
                Mon - Fri: 9am - 6pm EST
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/50">
              © {currentYear} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-sm text-background/50 hover:text-background/80 transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-background/50 hover:text-background/80 transition-colors">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-background/50 hover:text-background/80 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
