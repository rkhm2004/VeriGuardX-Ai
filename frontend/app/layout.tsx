"use client"

import "./globals.css"
import { VerificationProvider } from "@/lib/contexts/VerificationContext"
import CouncilChatWidget from "@/components/council-chat"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <body className="font-body">
        <div className="min-h-screen bg-background">
          {/* Main Content - Full Width */}
          <main className="w-full min-h-screen overflow-y-auto">
            <VerificationProvider>
              {children}
              <CouncilChatWidget />
            </VerificationProvider>
          </main>
        </div>
      </body>
    </html>
  )
}
