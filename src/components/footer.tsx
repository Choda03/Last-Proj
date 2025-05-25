"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Github, Twitter, Instagram, Linkedin } from "lucide-react"

const footerLinks = [
  {
    title: "Gallery",
    links: [
      { name: "Artworks", href: "/gallery" },
      { name: "Categories", href: "/categories" },
      { name: "About", href: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
]

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com",
    icon: Github,
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: Twitter,
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: Instagram,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: Linkedin,
  },
]

export function Footer() {
  const pathname = usePathname()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-playfair font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Gallery Hub
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Discover and share beautiful artwork in our modern digital gallery platform.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold">{group.title}</h3>
                <ul className="mt-4 space-y-2">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-sm font-semibold">Connect with us</h3>
            <div className="mt-4 flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">{link.name}</span>
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Gallery Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 