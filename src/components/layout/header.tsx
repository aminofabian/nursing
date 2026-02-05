"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {
  Menu,
  Stethoscope,
  X,
  Settings,
  Bookmark,
  Download,
  LogOut,
  LayoutDashboard,
  Crown,
} from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const navLinks = [
  { href: "/resources", label: "Resources" },
  { href: "/resources/nclex", label: "NCLEX Prep" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export function Header() {
  const { data: session, status } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U"

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main navigation bar */}
      <div className="glass border-b border-white/10">
        <div className="container flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-lg"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/25">
              <Stethoscope className="size-5" />
            </div>
            <span className="hidden sm:inline-block">
              <span className="text-foreground/70 font-medium">nurse</span>
              <span className="text-primary">hub</span>
            </span>
          </Link>

          {/* Desktop navigation - center */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors rounded-lg hover:bg-foreground/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop - right side buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {status === "loading" ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : session?.user ? (
              <>
                {session.user.hasActiveSubscription && (
                  <Badge
                    variant="secondary"
                    className="gap-1 bg-primary/10 text-primary"
                  >
                    <Crown className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage
                          src={session.user.image || undefined}
                          alt={session.user.name || "User"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/library" className="cursor-pointer">
                        <Bookmark className="mr-2 h-4 w-4" />
                        My Library
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/downloads" className="cursor-pointer">
                        <Download className="mr-2 h-4 w-4" />
                        Downloads
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-foreground/70 hover:text-foreground"
                >
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  <Link href="/pricing">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex items-center justify-center size-10 rounded-lg hover:bg-foreground/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-50 bg-background/98 backdrop-blur-sm animate-fade-in">
          <nav className="container py-8 flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-4 px-4 text-lg font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
              </Link>
            ))}

            {session?.user ? (
              <>
                <div className="mt-4 pt-4 border-t space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="py-4 px-4 text-lg font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all flex items-center gap-3"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/library"
                    onClick={() => setMobileOpen(false)}
                    className="py-4 px-4 text-lg font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all flex items-center gap-3"
                  >
                    <Bookmark className="h-5 w-5" />
                    My Library
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="py-4 px-4 text-lg font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all flex items-center gap-3"
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="px-4 py-3 flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={session.user.image || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{session.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="lg"
                    className="w-full mt-4 text-destructive hover:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-6 pt-6 border-t">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full animate-slide-up"
                  style={{ animationDelay: "250ms" }}
                >
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="w-full shadow-lg shadow-primary/25 animate-slide-up"
                  style={{ animationDelay: "300ms" }}
                >
                  <Link href="/pricing" onClick={() => setMobileOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
