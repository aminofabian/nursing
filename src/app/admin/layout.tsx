import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Users,
  Package,
  ArrowLeft,
} from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login?redirect=/admin")
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/resources", label: "Resources", icon: FileText },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/bundles", label: "Bundles", icon: Package },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - full on desktop, collapsible on mobile via sheet or top nav */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white hidden md:block">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Link href="/admin" className="font-semibold text-lg">
            NurseHub Admin
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 min-h-[44px]"
            >
              <item.icon className="h-5 w-5 text-gray-500 shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 min-h-[44px]"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            Back to site
          </Link>
        </div>
      </aside>

      {/* Mobile: top bar with link to dashboard */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4">
        <Link href="/admin" className="font-semibold">
          NurseHub Admin
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 min-h-[44px] min-w-[44px] items-center justify-center"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Main content - full width on mobile with top padding for bar */}
      <main className="md:pl-64 pt-14 md:pt-0">
        <div className="min-h-screen p-4 md:p-8">{children}</div>
      </main>

      {/* Mobile bottom nav for admin sections */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white safe-area-pb flex items-center justify-around min-h-[56px]">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[64px] min-h-[48px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-xs font-medium"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Spacer so content isn't hidden behind bottom nav on mobile */}
      <div className="md:hidden h-20" />
    </div>
  )
}
