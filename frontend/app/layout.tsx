import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import "./globals.css"
import { Shield, LayoutDashboard, QrCode, Fingerprint, Map, Activity, Users, AlertTriangle, MessageSquare } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Trust & Safety Command Center",
  description: "Multi-Agent Counterfeit Detection System",
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Scan Agent", href: "/agents/scan", icon: QrCode },
  { name: "Identity Agent", href: "/agents/identity", icon: Fingerprint },
  { name: "Provenance Agent", href: "/agents/provenance", icon: Map },
  { name: "Anomaly Agent", href: "/agents/anomaly", icon: Activity },
  { name: "Courier Agent", href: "/agents/courier", icon: Users },
  { name: "Risk Agent", href: "/agents/risk", icon: AlertTriangle },
  { name: "Council Agent", href: "/agents/council", icon: MessageSquare },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Main Content - Full Width */}
          <main className="w-full overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
