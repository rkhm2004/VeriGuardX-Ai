"use client"

import { useState } from "react"
import { sendChatMessage } from "@/lib/api"
import { ChatMessage } from "@/lib/types"
import { MessageSquare, Send, Bot, User, Loader2, Terminal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function CouncilSupervisor() {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date().toISOString(),
      isUser: true,
    }

    setChatHistory(prev => [...prev, userMessage])
    setMessage("")
    setLoading(true)

    try {
      const response = await sendChatMessage(message)
      setChatHistory(prev => [...prev, response])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + "-error",
        content: "SYSTEM_ERROR: Unable to process request.",
        timestamp: new Date().toISOString(),
        isUser: false,
      }
      setChatHistory(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions = [
    "What is the current status?",
    "Show me the journey",
    "Why did this fail?",
    "Are there any anomalies?"
  ]

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-fuchsia-900/20 via-purple-900/20 to-black text-gray-300 font-sans overflow-hidden">
      <div className="w-full min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 pb-4"
        >
          <div className="containment-unit p-6 border-fuchsia-500 shadow-glow-council">
            <h1 className="flex items-center gap-3 text-2xl font-header font-bold text-fuchsia-400">
              <MessageSquare className="w-6 h-6" />
              COUNCIL_SUPERVISOR - DIGITAL_TWIN
            </h1>
            <p className="text-fuchsia-300 mt-2">Ask questions about your shipment status and get intelligent responses</p>
          </div>
        </motion.div>

        {/* Chat Interface - Full Screen */}
        <div className="flex-1 flex flex-col p-8 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 flex flex-col"
          >
            {/* Chat Messages Container */}
            <div className="containment-unit flex-1 p-6 mb-6 border-fuchsia-500/30 shadow-[0_0_15px_rgba(255,0,255,0.2)] bg-black/40 backdrop-blur-xl overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <Terminal className="w-5 h-5 text-fuchsia-400" />
                <h2 className="text-lg font-header font-bold text-fuchsia-400">COMMUNICATION_CHANNEL</h2>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-4 font-mono">
                <AnimatePresence>
                  {chatHistory.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-fuchsia-300 py-12"
                    >
                      <Bot className="w-16 h-16 mx-auto mb-6 opacity-50" />
                      <p className="font-mono text-lg">Digital Twin communication channel established</p>
                      <p className="text-sm mt-2">Select a query below or enter your own message</p>
                    </motion.div>
                  ) : (
                    chatHistory.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!msg.isUser && (
                          <div className="w-8 h-8 border border-fuchsia-400 rounded flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="w-4 h-4 text-fuchsia-400" />
                          </div>
                        )}
                        <div
                          className={`max-w-[70%] p-4 rounded-lg ${
                            msg.isUser
                              ? 'bg-fuchsia-500/20 border border-fuchsia-400/50 text-fuchsia-300 shadow-glow-council'
                              : 'bg-fuchsia-500/10 border border-fuchsia-400/30 text-foreground shadow-[0_0_15px_rgba(255,0,255,0.2)]'
                          }`}
                        >
                          <div className="text-xs text-fuchsia-300 mb-2 font-mono">
                            {msg.isUser ? 'OPERATOR_INPUT' : 'SYSTEM_RESPONSE'}
                          </div>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <p className="text-xs text-fuchsia-300 mt-3 font-mono">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        {msg.isUser && (
                          <div className="w-8 h-8 border border-fuchsia-400 rounded flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="w-4 h-4 text-fuchsia-400" />
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="w-8 h-8 border border-fuchsia-400 rounded flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-fuchsia-400" />
                    </div>
                    <div className="bg-fuchsia-500/10 border border-fuchsia-400/30 p-4 rounded-lg shadow-[0_0_15px_rgba(255,0,255,0.2)]">
                      <div className="text-xs text-fuchsia-300 mb-2 font-mono">SYSTEM_PROCESSING</div>
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-fuchsia-400" />
                        <span className="text-sm text-fuchsia-300">Analyzing query...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Quick Questions */}
            <div className="containment-unit p-6 mb-6 border-fuchsia-500/30 shadow-[0_0_15px_rgba(255,0,255,0.2)]">
              <h3 className="text-lg font-header font-bold text-fuchsia-400 mb-4">QUICK_QUERIES</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(question)}
                    className="cyber-button text-left text-sm border-fuchsia-400/50 text-fuchsia-300 hover:shadow-glow-council"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area - Fixed at Bottom */}
            <div className="containment-unit p-6 border-fuchsia-500/30 shadow-[0_0_15px_rgba(255,0,255,0.2)] bg-black/60 backdrop-blur-xl">
              <div className="flex gap-3">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your query about shipment status..."
                  className="flex-1 bg-black/60 border border-fuchsia-400/50 text-fuchsia-300 placeholder-fuchsia-500 px-4 py-3 font-mono focus:border-fuchsia-400 focus:outline-none"
                  disabled={loading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !message.trim()}
                  className={`cyber-button px-6 flex items-center justify-center border-fuchsia-400 text-fuchsia-300 hover:shadow-glow-council ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="text-center mt-4">
                <p className="text-fuchsia-300 text-xs font-mono">
                  Council Supervisor will explain failures and provide status updates
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Background holographic effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 border border-fuchsia-400/10 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 border border-purple-400/10 rounded-full"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.05, 0.15, 0.05],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-fuchsia-400/5 rounded-full"
            animate={{
              scale: [0.8, 1.1, 0.8],
              opacity: [0.03, 0.08, 0.03],
            }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  )
}
