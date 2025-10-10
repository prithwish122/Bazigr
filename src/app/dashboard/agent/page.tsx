"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import AI_Input_Search from "@/app/components/agent/ai-input-search"
import { cn } from "@/app/lib/utils"
import { useWriteContract, usePublicClient } from "wagmi"
import { useAppKitAccount } from "@reown/appkit/react"
import tokenAbi from "@/app/contract/abi.json"
import swapAbi from "@/app/contract/swap-abi.json"

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

  const { address, isConnected } = useAppKitAccount()
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient()

  const TOKEN_ADDRESS = useMemo(() => (
    "0xC345f186C6337b8df46B19c8ED026e9d64ab9F80" as `0x${string}`
  ), [])
  const SWAP_ADDRESS = useMemo(() => (
    "0xE396AeD3086E2Fd5B8Bc1f1622AD298A396A4470" as `0x${string}`
  ), [])

  function parseAmountToWei(amt: string): bigint {
    const cleaned = (amt || "0").trim()
    const parts = cleaned.split(".")
    const whole = BigInt(parts[0] || "0")
    const frac = (parts[1] || "").replace(/[^0-9]/g, "").padEnd(18, "0").slice(0, 18)
    return whole * 10n ** 18n + BigInt(frac || "0")
  }

  function parseIntent(input: string):
    | { kind: "swap"; from: "U2U" | "BAZ"; toToken: "U2U" | "BAZ"; amount?: string }
    | { kind: "send"; token?: "BAZ" | "U2U"; to?: `0x${string}`; amount?: string }
    | { kind: "bridge"; to?: `0x${string}`; amount?: string }
    | { kind: "unknown" } {
    const text = input.toLowerCase()
    const amountMatch = input.match(/(\d+\.?\d*)/)
    const addrMatch = input.match(/0x[a-fA-F0-9]{40}/)
    const hasSwap = /(\bswap\b|\bexchange\b)/.test(text)
    const hasSend = /(\bsend\b|\btransfer\b)/.test(text)
    const hasBridge = /(\bbridge\b)/.test(text)
    const toBaz = /(to\s+baz|for\s+baz|\sbaz\b)/.test(text)
    const toU2U = /(to\s+u2u|for\s+u2u|\bu2u\b)/.test(text)
    const fromBaz = /(from\s+baz)/.test(text)
    const fromU2U = /(from\s+u2u)/.test(text)
    const bazToU2U = /(baz\s*(->|to)\s*u2u)/.test(text)
    const u2uToBaz = /(u2u\s*(->|to)\s*baz)/.test(text)
    const amount = amountMatch ? amountMatch[1] : undefined
    const to = (addrMatch ? (addrMatch[0] as `0x${string}`) : undefined)
    if (hasSwap) {
      let from: "U2U" | "BAZ" | undefined
      if (fromBaz || bazToU2U || (toU2U && !toBaz)) from = "BAZ"
      else if (fromU2U || u2uToBaz || (toBaz && !toU2U)) from = "U2U"
      else if (toU2U && toBaz) from = undefined
      if (!from) from = "U2U" // sensible default
      const dest = from === "U2U" ? "BAZ" : "U2U"
      return { kind: "swap", from, toToken: dest, amount }
    }
    if (hasSend) {
      const token: "BAZ" | "U2U" | undefined = toBaz ? "BAZ" : toU2U ? "U2U" : undefined
      return { kind: "send", token, to, amount }
    }
    if (hasBridge) {
      return { kind: "bridge", to, amount }
    }
    return { kind: "unknown" }
  }

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
    const intent = parseIntent(input)
    if (intent.kind === "swap" && intent.amount) {
      const performing: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: "Performing swap…" }
      setMessages((prev) => [...prev, performing])
      try {
        if (!isConnected || !address) throw new Error("Wallet not connected")
        const wei = parseAmountToWei(intent.amount)
        if (intent.from === "U2U") {
          // Native -> BAZ
          try {
            await publicClient?.estimateContractGas({
              abi: (swapAbi as any).abi || (swapAbi as any),
              functionName: "swapNativeForBaz",
              address: SWAP_ADDRESS,
              args: [],
              value: wei,
              account: address as `0x${string}`,
            })
          } catch {}
          const hash = await writeContractAsync({
            abi: (swapAbi as any).abi || (swapAbi as any),
            functionName: "swapNativeForBaz",
            address: SWAP_ADDRESS,
            args: [],
            value: wei,
          })
          await publicClient?.waitForTransactionReceipt({ hash })
          setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: `Swap successful: ${intent.amount} U2U → ${Number(intent.amount) * 20} BAZ` }])
        } else {
          // BAZ -> U2U
          try {
            await publicClient?.estimateContractGas({
              abi: tokenAbi as any,
              functionName: "approve",
              address: TOKEN_ADDRESS,
              args: [SWAP_ADDRESS, wei],
              account: address as `0x${string}`,
            })
          } catch {}
          const approveHash = await writeContractAsync({
            abi: tokenAbi as any,
            functionName: "approve",
            address: TOKEN_ADDRESS,
            args: [SWAP_ADDRESS, wei],
          })
          await publicClient?.waitForTransactionReceipt({ hash: approveHash })
          const swapHash = await writeContractAsync({
            abi: (swapAbi as any).abi || (swapAbi as any),
            functionName: "swapBazForNative",
            address: SWAP_ADDRESS,
            args: [wei],
          })
          await publicClient?.waitForTransactionReceipt({ hash: swapHash })
          setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: `Swap successful: ${intent.amount} BAZ → ${(Number(intent.amount) / 20).toString()} U2U` }])
        }
      } catch (e: any) {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: e?.message || "Swap failed" }])
      }
      return
    }

    if (intent.kind === "send" && intent.amount && intent.to) {
      const performing: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: "Performing send…" }
      setMessages((prev) => [...prev, performing])
      try {
        if (!isConnected || !address) throw new Error("Wallet not connected")
        if (intent.token === "BAZ") {
          // Bazigr.send expects whole tokens (mints 1e18 internally)
          const txHash = await writeContractAsync({
            abi: tokenAbi as any,
            functionName: "send",
            address: TOKEN_ADDRESS,
            args: [intent.to, intent.amount],
          })
          await publicClient?.waitForTransactionReceipt({ hash: txHash })
          setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: `Sent ${intent.amount} BAZ to ${intent.to}` }])
        } else {
          // Native U2U send
          const wei = parseAmountToWei(intent.amount)
          const hash = await publicClient!.sendTransaction({ account: address as `0x${string}`, to: intent.to, value: wei })
          await publicClient?.waitForTransactionReceipt({ hash })
          setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: `Sent ${intent.amount} U2U to ${intent.to}` }])
        }
      } catch (e: any) {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: e?.message || "Send failed" }])
      }
      return
    }

    if (intent.kind === "bridge" && intent.amount && intent.to) {
      const performing: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: "Performing bridge…" }
      setMessages((prev) => [...prev, performing])
      try {
        if (!isConnected || !address) throw new Error("Wallet not connected")
        // Bazigr.bridge expects whole tokens
        const txHash = await writeContractAsync({
          abi: tokenAbi as any,
          functionName: "bridge",
          address: TOKEN_ADDRESS,
          args: [intent.to, intent.amount],
        })
        await publicClient?.waitForTransactionReceipt({ hash: txHash })
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: `Bridged ${intent.amount} BAZ to ${intent.to}` }])
      } catch (e: any) {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: e?.message || "Bridge failed" }])
      }
      return
    }

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
