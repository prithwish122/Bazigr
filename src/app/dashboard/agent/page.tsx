"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import AI_Input_Search from "@/app/components/agent/ai-input-search"
import { cn } from "@/app/lib/utils"
import { useWriteContract, usePublicClient } from "wagmi"
import { useAppKitAccount } from "@reown/appkit/react"
import tokenAbi from "@/app/contract/abi.json"
import swapAbi from "@/app/contract/swap-abi.json"
import propabi2 from "@/app/contract/abi2.json"
import { ethers } from "ethers"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { ScratchCard } from "@/app/components/rewards/scratch-card"

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
  const [openCongrats, setOpenCongrats] = useState(false)
  const [reward, setReward] = useState<number>(() => Math.floor(Math.random() * 10) + 1)
  const [canClaim, setCanClaim] = useState(false)

  const { address, isConnected } = useAppKitAccount()
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient()

  const TOKEN_ADDRESS = useMemo(() => (
    "0xC345f186C6337b8df46B19c8ED026e9d64ab9F80" as `0x${string}`
  ), [])
  const SWAP_ADDRESS = useMemo(() => (
    "0xE396AeD3086E2Fd5B8Bc1f1622AD298A396A4470" as `0x${string}`
  ), [])
  // Bridge constants (same as manual bridge)
  const BRIDGE_U2U_TOKEN = useMemo(() => (
    "0xC345f186C6337b8df46B19c8ED026e9d64ab9F80" as `0x${string}`
  ), [])
  const BRIDGE_SEPOLIA_TOKEN = useMemo(() => (
    "0xD5e91C9ADB874601E5980521A9665962EaB950FB" as `0x${string}`
  ), [])
  const BRIDGE_INTERMEDIATE = useMemo(() => (
    "0x10B6E5bB22D387AF4E9E2961a6183291337F76fc" as `0x${string}`
  ), [])

  async function writeWithFallback(params: {
    abi: any
    address: `0x${string}`
    functionName: string
    args?: any[]
    value?: bigint
  }): Promise<`0x${string}`> {
    try {
      const hash = await writeContractAsync({
        abi: params.abi,
        functionName: params.functionName as any,
        address: params.address,
        args: (params.args || []) as any,
        value: params.value,
      })
      return hash as `0x${string}`
    } catch (e: any) {
      // Fallback for any write error: call via ethers directly to avoid viem circuit breaker/coalesce issues
      const eth = (globalThis as any).ethereum
      if (!eth) throw e
      const provider = new ethers.BrowserProvider(eth)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(params.address, params.abi as any, signer)
      const method = (contract as any)[params.functionName]
      const tx = params.value !== undefined
        ? await method(...(params.args || []), { value: params.value })
        : await method(...(params.args || []))
      await tx.wait()
      return tx.hash as `0x${string}`
    }
  }

  function parseAmountToWei(amt: string): bigint {
    const cleaned = (amt || "0").trim()
    const parts = cleaned.split(".")
    const whole = BigInt(parts[0] || "0")
    const frac = (parts[1] || "").replace(/[^0-9]/g, "").padEnd(18, "0").slice(0, 18)
    return whole * 10n ** 18n + BigInt(frac || "0")
  }

  async function handleClaim(currentReward: number) {
    try {
      const eth = (globalThis as any).ethereum
      if (!eth) throw new Error("Wallet not found")
      const targetChainIdHex = "0x27" // U2U Mainnet chainId 39
      try {
        await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: targetChainIdHex }] })
      } catch (switchErr: any) {
        if (switchErr?.code === 4902) {
          await eth.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: targetChainIdHex,
                chainName: "U2U Solaris Mainnet",
                nativeCurrency: { name: "U2U", symbol: "U2U", decimals: 18 },
                rpcUrls: ["https://rpc-mainnet.u2u.xyz"],
                blockExplorerUrls: ["https://u2uscan.xyz/"],
              },
            ],
          })
        } else {
          throw switchErr
        }
      }
      const provider = new ethers.BrowserProvider(eth)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi as any, signer)
      const to = (address as `0x${string}`) || (await signer.getAddress())
      const tx = await contract.mint(to, String(currentReward))
      await tx.wait()
      setOpenCongrats(false)
      setCanClaim(false)
    } catch (err) {
      // keep modal open on failure
    }
  }

  function parseIntent(input: string):
    | { kind: "swap"; from: "U2U" | "BAZ"; toToken: "U2U" | "BAZ"; amount?: string }
    | { kind: "send"; token?: "BAZ" | "U2U"; to?: `0x${string}`; amount?: string }
    | { kind: "bridge"; to?: `0x${string}`; amount?: string; fromNet?: "u2u" | "sepolia"; toNet?: "u2u" | "sepolia" }
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
      const fromNet: "u2u" | "sepolia" | undefined = /from\s+u2u/.test(text) ? "u2u" : /from\s+sepolia/.test(text) ? "sepolia" : undefined
      const toNet: "u2u" | "sepolia" | undefined = /to\s+u2u/.test(text) ? "u2u" : /to\s+sepolia/.test(text) ? "sepolia" : undefined
      return { kind: "bridge", to, amount, fromNet, toNet }
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
          const hash = await writeWithFallback({
            abi: (swapAbi as any).abi || (swapAbi as any),
            functionName: "swapNativeForBaz",
            address: SWAP_ADDRESS,
            args: [],
            value: wei,
          })
          await publicClient?.waitForTransactionReceipt({ hash })
          setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: `Swap successful: ${intent.amount} U2U → ${Number(intent.amount) * 20} BAZ` }])
          setReward(Math.floor(Math.random() * 10) + 1)
          setOpenCongrats(true)
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
          const approveHash = await writeWithFallback({
            abi: tokenAbi as any,
            functionName: "approve",
            address: TOKEN_ADDRESS,
            args: [SWAP_ADDRESS, wei],
          })
          await publicClient?.waitForTransactionReceipt({ hash: approveHash })
          const swapHash = await writeWithFallback({
            abi: (swapAbi as any).abi || (swapAbi as any),
            functionName: "swapBazForNative",
            address: SWAP_ADDRESS,
            args: [wei],
          })
          await publicClient?.waitForTransactionReceipt({ hash: swapHash })
          setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: `Swap successful: ${intent.amount} BAZ → ${(Number(intent.amount) / 20).toString()} U2U` }])
          setReward(Math.floor(Math.random() * 10) + 1)
          setOpenCongrats(true)
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
          const txHash = await writeWithFallback({
            abi: tokenAbi as any,
            functionName: "send",
            address: TOKEN_ADDRESS,
            args: [intent.to, intent.amount],
          })
          await publicClient?.waitForTransactionReceipt({ hash: txHash })
          setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: `Sent ${intent.amount} BAZ to ${intent.to}` }])
          setReward(Math.floor(Math.random() * 10) + 1)
          setOpenCongrats(true)
        } else {
          // Native U2U send
          const wei = parseAmountToWei(intent.amount)
          const hash = await publicClient!.sendTransaction({ account: address as `0x${string}`, to: intent.to, value: wei })
          await publicClient?.waitForTransactionReceipt({ hash })
          setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: `Sent ${intent.amount} U2U to ${intent.to}` }])
          setReward(Math.floor(Math.random() * 10) + 1)
          setOpenCongrats(true)
        }
      } catch (e: any) {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: e?.message || "Send failed" }])
      }
      return
    }

    if (intent.kind === "bridge" && intent.amount) {
      const performing: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: "Performing bridge…" }
      setMessages((prev) => [...prev, performing])
      try {
        if (!isConnected || !address) throw new Error("Wallet not connected")
        const amtStr = (intent.amount || "0").split(".")[0]
        if (!amtStr || amtStr === "0") throw new Error("Enter a whole-number amount")

        if (intent.fromNet === "u2u" && intent.toNet === "sepolia") {
          // Step 1: on U2U, call send to bridge intermediate
          const hash1 = await writeWithFallback({
            abi: tokenAbi as any,
            functionName: "send",
            address: BRIDGE_U2U_TOKEN,
            args: [BRIDGE_INTERMEDIATE, amtStr],
          })
          await publicClient?.waitForTransactionReceipt({ hash: hash1 })

          // Step 2: switch to Sepolia and mint to user
          const eth = (globalThis as any).ethereum
          if (!eth) throw new Error("Wallet provider not found")
          const targetChainIdHex = "0xaa36a7" // Sepolia 11155111
          try {
            await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: targetChainIdHex }] })
          } catch (switchErr: any) {
            if (switchErr?.code === 4902) {
              await eth.request({
                method: "wallet_addEthereumChain",
                params: [{
                  chainId: targetChainIdHex,
                  chainName: "Sepolia",
                  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                  rpcUrls: ["https://rpc.sepolia.org"],
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                }],
              })
            } else throw switchErr
          }
          const browserProvider = new ethers.BrowserProvider(eth)
          const signer = await browserProvider.getSigner()
          const recipient = (address as `0x${string}`) || (await signer.getAddress())
          const contract2 = new ethers.Contract(BRIDGE_SEPOLIA_TOKEN, propabi2 as any, signer)
          const tx2 = await contract2.mint(recipient, amtStr)
          await tx2.wait()
          setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: `Bridged ${amtStr} BAZ from U2U → Sepolia` }])
          setReward(Math.floor(Math.random() * 10) + 1)
          setOpenCongrats(true)
        } else if (intent.fromNet === "sepolia" && intent.toNet === "u2u") {
          // Reverse: on Sepolia, send to intermediate, then switch to U2U and mint
          const eth = (globalThis as any).ethereum
          if (!eth) throw new Error("Wallet provider not found")
          // Ensure Sepolia
          const sepoliaHex = "0xaa36a7"
          try {
            await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: sepoliaHex }] })
          } catch {}
          const browserProvider = new ethers.BrowserProvider(eth)
          const signer = await browserProvider.getSigner()
          const token2 = new ethers.Contract(BRIDGE_SEPOLIA_TOKEN, propabi2 as any, signer)
          const txA = await token2.send(BRIDGE_INTERMEDIATE, amtStr)
          await txA.wait()
          // Switch to U2U (chainId 39 -> 0x27)
          const u2uHex = "0x27"
          try {
            await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: u2uHex }] })
          } catch (switchErr: any) {
            if (switchErr?.code === 4902) {
              await eth.request({
                method: "wallet_addEthereumChain",
                params: [{
                  chainId: u2uHex,
                  chainName: "U2U Solaris Mainnet",
                  nativeCurrency: { name: "U2U", symbol: "U2U", decimals: 18 },
                  rpcUrls: ["https://rpc-mainnet.u2u.xyz"],
                  blockExplorerUrls: ["https://u2uscan.xyz/"],
                }],
              })
            } else throw switchErr
          }
          const providerU = new ethers.BrowserProvider(eth)
          const signerU = await providerU.getSigner()
          const tokenU = new ethers.Contract(BRIDGE_U2U_TOKEN, tokenAbi as any, signerU)
          const recipientU = await signerU.getAddress()
          const txU = await tokenU.mint(recipientU, amtStr)
          await txU.wait()
          setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: `Bridged ${amtStr} BAZ from Sepolia → U2U` }])
          setReward(Math.floor(Math.random() * 10) + 1)
          setOpenCongrats(true)
        } else {
          setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: "Specify networks like: bridge 10 baz from u2u to sepolia" }])
        }
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
      {/* Scratch modal after successful actions */}
      <Dialog open={openCongrats} onOpenChange={setOpenCongrats}>
        <DialogContent className="bg-card/20 backdrop-blur-xl border border-border/60 max-w-lg text-foreground">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Congratulations!</DialogTitle>
            <DialogDescription className="text-center">Scratch to reveal your bonus</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <ScratchCard
              rewardText={`${reward} BAZ`}
              width={360}
              height={200}
              onRevealComplete={() => setCanClaim(true)}
            />
            <Button
              className={cn(
                "mt-2 w-full",
                canClaim ? "bg-pink-600 hover:bg-pink-500 text-white" : "bg-muted text-muted-foreground cursor-not-allowed",
              )}
              disabled={!canClaim}
              onClick={() => handleClaim(reward)}
            >
              Claim
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
