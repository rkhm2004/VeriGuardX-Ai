"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Brain, Send, Bot, ShieldCheck, Scale, Zap, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function CouncilAgentPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Council Agent initialized. I can explain any audit decision, resolve conflicts between agents, or answer questions about counterfeit detection logic."
    }
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: "user", content: input }])
    setInput("")
    
    // Simulate thinking state
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: "Analysis complete. Based on the cross-agent data, the verdict is reinforced by the Identity Agent's cryptographic failure." }])
    }, 1000)
  }

  const verdictExample = {
    verdict: "COUNTERFEIT",
    confidence: 85,
    reasoning: "Multiple critical indicators detected: (1) Identity Agent reported invalid OEM signature - the cryptographic signature does not match Siemens' public key. (2) Anomaly Agent detected impossible travel - the part was scanned in Tokyo and Berlin within 2 hours. (3) Provenance Agent flagged sequence violation.",
    critical_findings: [
      "Invalid OEM cryptographic signature",
      "Impossible travel speed: 4,200 km/h",
      "Checkpoint sequence violation"
    ]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 flex justify-between items-center p-8 border-b border-slate-700/50"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <Scale className="w-10 h-10 text-purple-500" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              COUNCIL AGENT
            </h1>
            <p className="text-slate-400 text-sm">The Judge • LLM-Powered Reasoning & Conflict Resolution</p>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="flex items-center gap-4"
        >
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-sm font-bold text-purple-400">LLM ACTIVE</span>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-cyan-400">REASONING ENGINE</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 p-8 space-y-8">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Interface */}
        <Card className="lg:col-span-1 border-slate-200 shadow-xl overflow-hidden flex flex-col h-[600px]">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="flex items-center gap-2 text-slate-700">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Ask the Council
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className={`p-3 rounded-2xl max-w-[85%] shadow-sm ${
                      msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-white border border-slate-100 rounded-bl-none text-slate-700"
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex gap-2">
                <Input
                  className="rounded-full bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                  placeholder="Ask about audit decisions..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <Button onClick={handleSend} className="rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Why counterfeit?", "Risk calculation", "Next steps?"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reasoning Example */}
        <Card className="lg:col-span-1 border-slate-200 shadow-xl bg-gradient-to-b from-white to-slate-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-700">
              <Brain className="w-5 h-5 text-purple-600" />
              Verdict Synthesis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Badge className="bg-red-500 hover:bg-red-600 text-sm px-4 py-1.5 rounded-full">
                {verdictExample.verdict}
              </Badge>
              <div className="text-right">
                <p className="text-3xl font-black text-slate-800 leading-none">{verdictExample.confidence}%</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Confidence Score</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Scale className="w-3 h-3" /> Reasoning Chain
              </h4>
              <div className="bg-slate-900 text-slate-300 rounded-xl p-4 font-mono text-xs leading-relaxed border-l-4 border-blue-500">
                {verdictExample.reasoning}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3" /> Critical Findings
              </h4>
              <div className="grid gap-2">
                {verdictExample.critical_findings.map((finding, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 p-2 bg-red-50 rounded-lg border border-red-100 text-red-700 text-xs font-medium"
                  >
                    <ShieldCheck className="w-4 h-4" /> {finding}
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Synthesis Process Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { step: 1, title: "Collect", desc: "Gather multi-agent evidence", color: "bg-blue-500" },
          { step: 2, title: "Resolve", desc: "Weight conflicting inputs", color: "bg-purple-500" },
          { step: 3, title: "Synthesize", desc: "Generate final verdict", color: "bg-emerald-500" },
          { step: 4, title: "Explain", desc: "Human-readable reasoning", color: "bg-orange-500" },
        ].map((item) => (
          <Card key={item.step} className="border-none shadow-md bg-white/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className={`w-10 h-10 rounded-xl ${item.color} text-white flex items-center justify-center font-black mb-4 shadow-lg shadow-${item.color.split('-')[1]}-200`}>
                {item.step}
              </div>
              <h4 className="font-bold text-slate-800">{item.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </motion.div>
  )
}
