"use client"

import { usePathname } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { DesktopNav } from "@/components/desktop-nav"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <DesktopNav pathname={pathname} />
      <div className="md:ml-64">
        <AppHeader />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}