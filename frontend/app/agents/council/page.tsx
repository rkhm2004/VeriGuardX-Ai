"use client"

import { useState } from "react"
import { Bot } from "lucide-react"

export default function CouncilAgentPage() {
  const [activeTab, setActiveTab] = useState("Council Agent")

  const navLinks = [
    "Dashboard",
    "Scan Agent",
    "Identity Agent",
    "Provenance Agent",
    "Anomaly Agent",
    "LogiGuard Agent",
    "Risk Agent"
  ]

  const handleQuickQuery = (query: string) => {
    console.log(`Quick query clicked: ${query}`)
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-purple-500/30">
        <h1 className="text-xl font-bold text-purple-400">AI Trust Command Center</h1>
        <div className="flex space-x-6">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => setActiveTab(link)}
              className={`px-3 py-2 rounded transition-colors ${
                activeTab === link
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/50"
                  : "text-gray-400 hover:text-purple-300"
              }`}
            >
              {link}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* Header Card */}
        <div className="p-6 border-b border-purple-500/30">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900/50 border border-purple-500/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-2">
                🤖 COUNCIL_SUPERVISOR - DIGITAL_TWIN
              </h2>
              <p className="text-gray-300">
                Ask questions about your shipment status and get intelligent responses
              </p>
            </div>
          </div>
        </div>

        {/* Chat Display Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="w-full max-w-4xl h-full bg-gray-900/30 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-lg font-bold text-purple-400 mb-4">{'>'}_ COMMUNICATION_CHANNEL</h3>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="w-16 h-16 text-purple-400 mb-4" />
              <p className="text-gray-300 mb-2">Digital Twin communication channel established</p>
              <p className="text-gray-500">Select a query below or enter your own message</p>
            </div>
          </div>
        </div>

        {/* Quick Queries Section */}
        <div className="p-6 border-t border-purple-500/30">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-bold text-purple-400 mb-4">QUICK_QUERIES</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => handleQuickQuery("What is the current status?")}
                className="bg-gray-900/50 border border-purple-500/30 rounded-lg p-4 text-left hover:bg-purple-500/10 transition-colors"
              >
                What is the current status?
              </button>
              <button
                onClick={() => handleQuickQuery("Show me the journey")}
                className="bg-gray-900/50 border border-purple-500/30 rounded-lg p-4 text-left hover:bg-purple-500/10 transition-colors"
              >
                Show me the journey
              </button>
              <button
                onClick={() => handleQuickQuery("Why did this fail?")}
                className="bg-gray-900/50 border border-purple-500/30 rounded-lg p-4 text-left hover:bg-purple-500/10 transition-colors"
              >
                Why did this fail?
              </button>
              <button
                onClick={() => handleQuickQuery("Are there any anomalies?")}
                className="bg-gray-900/50 border border-purple-500/30 rounded-lg p-4 text-left hover:bg-purple-500/10 transition-colors"
              >
                Are there any anomalies?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
