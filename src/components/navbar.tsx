"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, X, User, LogOut, Settings, Image as ImageIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home", icon: ImageIcon },
    { href: "/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/categories", label: "Categories", icon: ImageIcon },
    { href: "/about", label: "About", icon: ImageIcon },
  ]

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  if (!mounted) {
    return (
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-playfair font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Gallery Hub
              </span>
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  const isAdmin = session?.user?.role === "admin"

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`border-b sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-sm shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 group"
          >
            <span className="text-2xl font-playfair font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent transition-all duration-300 group-hover:from-primary/80 group-hover:to-primary/40">
              Gallery Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden md:flex relative overflow-hidden hover:bg-primary/10"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-5 h-5"
              >
                <Sun className="absolute w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </motion.div>
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Menu */}
            {status === "authenticated" ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="hidden md:flex relative overflow-hidden hover:bg-primary/10"
                >
                  <User className="w-5 h-5" />
                  <span className="sr-only">Open user menu</span>
                </Button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 rounded-lg bg-background shadow-lg ring-1 ring-black/5"
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 text-sm font-medium border-b">
                          {session.user?.email}
                        </div>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-primary/10 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center px-3 py-2 text-sm rounded-md hover:bg-primary/10 transition-colors text-red-500 hover:text-red-600"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : status === "unauthenticated" ? (
              <div className="hidden md:flex md:items-center md:space-x-2">
                <Link href="/login">
                  <Button variant="ghost" className="hover:bg-primary/10">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary hover:bg-primary/90">
                    Sign up
                  </Button>
                </Link>
              </div>
            ) : null}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative overflow-hidden hover:bg-primary/10"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors ${
                        pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5 mr-2" />
                      {link.label}
                    </Link>
                  )
                })}
                {status === "authenticated" ? (
                  <>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-5 h-5 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center rounded-md px-3 py-2 text-base font-medium text-red-500 hover:bg-red-500/10 hover:text-red-600"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Sign out
                    </button>
                  </>
                ) : status === "unauthenticated" ? (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center rounded-md px-3 py-2 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                ) : null}
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-base font-medium"
                  onClick={() => {
                    setTheme(theme === "dark" ? "light" : "dark")
                    setIsMenuOpen(false)
                  }}
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="mr-2 h-5 w-5" />
                      Light mode
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-5 w-5" />
                      Dark mode
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
} 