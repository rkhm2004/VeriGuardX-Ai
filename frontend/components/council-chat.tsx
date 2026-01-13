 "use client"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useVerification } from "@/lib/contexts/VerificationContext"

interface Message {
  id: string
  text: string
  sender: 'user' | 'council'
  timestamp: Date
}

export default function CouncilChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { state } = useVerification()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-greeting when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      sendAutoGreeting()
    }
  }, [isOpen])

  const sendAutoGreeting = () => {
    const greetingMessage: Message = {
      id: 'greeting',
      text: "Council online. Risk levels nominal. Awaiting query.",
      sender: 'council',
      timestamp: new Date()
    }
    setMessages([greetingMessage])
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      console.log('🎯 COUNCIL CHAT: Sending message to backend...', { message: inputMessage, sessionId: state.productId })

      // Create AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch('http://localhost:5000/api/council/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          session_id: state.productId || 'default-session'
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      console.log('📡 COUNCIL CHAT: Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ COUNCIL CHAT: Backend error response:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ COUNCIL CHAT: Received response from backend:', data)

      const councilMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Council communication error.',
        sender: 'council',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, councilMessage])

      // Check if this is demo mode response
      if (data.response && data.response.includes('Simulation Mode')) {
        console.log('🎭 COUNCIL CHAT: Demo mode activated - OpenAI quota exceeded')
      }
    } catch (error) {
      console.error('❌ COUNCIL CHAT: Network/API error:', error)

      let errorText = 'Communication error. Council unavailable.'
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorText = 'Request timed out. Council took too long to respond.'
        } else if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          errorText = 'Cannot connect to Council backend. Check if server is running on port 5000.'
        } else if (error.message.includes('500')) {
          errorText = 'Council backend error. Check server logs for details.'
        } else if (error.message.includes('Invalid OpenAI API key')) {
          errorText = 'Council authentication error. Check OpenAI API key.'
        } else {
          errorText = `Council error: ${error.message}`
        }
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        sender: 'council',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      // CRITICAL: This MUST run no matter what to prevent infinite loading
      console.log('🔄 COUNCIL CHAT: Setting loading to false')
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-cyan-500 hover:bg-cyan-400 text-black rounded-full shadow-lg flex items-center justify-center transition-colors"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-black/90 border border-cyan-500/30 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-cyan-500/30 bg-black/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-cyan-400 font-mono font-bold text-sm">COUNCIL_AGENT</h3>
                  <p className="text-cyan-300/60 text-xs">Supply Chain Supervisor</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex-1 overflow-hidden flex flex-col"
                >
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.sender === 'council' && (
                          <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-cyan-400" />
                          </div>
                        )}
                        <div
                          className={`max-w-[280px] p-3 rounded-lg font-mono text-sm ${
                            message.sender === 'user'
                              ? 'bg-cyan-500 text-black ml-auto'
                              : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
                          }`}
                        >
                          {message.text}
                        </div>
                        {message.sender === 'user' && (
                          <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-black" />
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3 justify-start"
                      >
                        <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="bg-cyan-500/10 border border-cyan-500/30 p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-cyan-500/30 bg-black/60">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Query Council Agent..."
                        disabled={isLoading}
                        className="flex-1 bg-black/50 border border-cyan-500/30 text-cyan-300 placeholder-cyan-600/50 px-3 py-2 font-mono text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none rounded"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 text-black rounded font-mono text-sm transition-colors flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
