"use client"

import { useEffect, useRef, useState } from "react"
import AI_Input_Search from "@/app/components/agent/ai-input-search"
import { cn } from "@/app/lib/utils"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function AgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I’m your Agent. Ask me anything about Bazigr.",
    },
  ])
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages.length, loading])

  async function sendMessage(input: string) {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: input }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messages.concat(userMsg).map(({ role, content }) => ({ role, content })) }),
      })
      const data = await res.json()
      const botMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: data.text ?? "…" }
      setMessages((prev) => [...prev, botMsg])
    } catch (e) {
      const errMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I ran into an error. Please try again.",
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div
        className={cn("backdrop-blur-xl bg-black/30 border border-white/10 rounded-2xl", "min-h-[70vh] flex flex-col")}
      >
        {/* Heading */}
        <div className="px-5 py-4 border-b border-white/10">
          <h1 className="text-lg font-semibold text-center">Agent</h1>
        </div>

        {/* Messages */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-[80%] px-4 py-3 rounded-xl border border-white/10",
                m.role === "user" ? "ml-auto bg-white/20 text-white" : "mr-auto bg-white/10 text-white/90",
              )}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
            </div>
          ))}
          {loading && (
            <div className="mr-auto max-w-[60%] px-4 py-3 rounded-xl border border-white/10 bg-white/10 text-white/90">
              <p className="text-sm">Thinking…</p>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 pb-4">
          <AI_Input_Search onSubmit={sendMessage} placeholder="Type your question and press Enter…" />
        </div>
      </div>
    </div>
  )
}
