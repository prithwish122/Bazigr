"use client"

import * as React from "react"
import { cn } from "@/app/lib/utils"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog"
import { useToast } from "../../toasts/use-toast"
import { ScratchCard } from "@/app/components/rewards/scratch-card"
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react"
import { useWriteContract, usePublicClient } from "wagmi"
import { ethers } from "ethers"
import propabi from "@/app/contract/abi.json"
import propabi2 from "@/app/contract/abi2.json"

const NETWORKS = [
  { id: "u2u", label: "U2U" },
  { id: "sepolia", label: "Sepolia ETH" },
]

export function BridgeBox() {
  const [fromNetwork, setFromNetwork] = React.useState<string>("u2u")
  const [toNetwork, setToNetwork] = React.useState<string>("sepolia")
  const [fromAmount, setFromAmount] = React.useState<string>("0")
  const [toAmount, setToAmount] = React.useState<string>("0")
  const [busy, setBusy] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const { toast } = useToast()
  const [reward, setReward] = React.useState<number>(() => Math.floor(Math.random() * 10) + 1)
    const [canClaim, setCanClaim] = React.useState(false)
    const [openCongrats, setOpenCongrats] = React.useState(false)

     const { address ,isConnected } = useAppKitAccount() // AppKit hook to get the address and check if the user is connected
        const { chainId } = useAppKitNetwork() // to get chainid
        const { writeContract, writeContractAsync, isSuccess } = useWriteContract() // to in
        const publicClient = usePublicClient()
    
        // const contract_address = "0xdCe18eF3f99F35F6cb93d1C408367f6B5C4790A7" 
        const contract_address = "0xC345f186C6337b8df46B19c8ED026e9d64ab9F80" 
        const contract_address2 = "0xD5e91C9ADB874601E5980521A9665962EaB950FB"

        const address1 = "0x10B6E5bB22D387AF4E9E2961a6183291337F76fc" // Replace with the actual connected address

  // 1:1 mirror amounts
  function handleFromAmount(v: string) {
    const sanitized = v.replace(/[^\d.]/g, "")
    setFromAmount(sanitized)
    setToAmount(sanitized || "0")
  }

  function handleFromNetworkChange(id: string) {
    setFromNetwork(id)
    if (id === toNetwork) setToNetwork(id === "u2u" ? "sepolia" : "u2u")
  }
  function handleToNetworkChange(id: string) {
    setToNetwork(id)
    if (id === fromNetwork) setFromNetwork(id === "u2u" ? "sepolia" : "u2u")
  }
function handleClaim() {
    setOpenCongrats(false)
    // optional: post-claim behavior
  }

  async function onBridge(fromAmount: string) {
    if (busy) return
    setBusy(true)
    try {
      // 1) First tx
      const hash1 = await writeContractAsync({
        abi: propabi,
        functionName: "send",
        address: contract_address,
        args: [address1, fromAmount],
      })
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: hash1 })
      }

      // 2) Second tx (after first is confirmed) using ethers.js on Base Sepolia
      const targetChainIdHex = "0x14A34" // Base Sepolia chainId 84532
      const eth = (globalThis as any).ethereum
      if (!eth) {
        throw new Error("Wallet provider not found")
      }
      // Switch wallet to Base Sepolia
      try {
        await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: targetChainIdHex }] })
      } catch (switchErr: any) {
        // If the chain is not added, prompt to add
        if (switchErr?.code === 4902) {
          await eth.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: targetChainIdHex,
                chainName: "Base Sepolia",
                nativeCurrency: { name: "sepoliaETH", symbol: "ETH", decimals: 18 },
                rpcUrls: ["https://sepolia-preconf.base.org"],
                blockExplorerUrls: ["https://base-sepolia.blockscout.com"],
              },
            ],
          })
        } else {
          throw switchErr
        }
      }
      const browserProvider = new ethers.BrowserProvider(eth)
      const signer = await browserProvider.getSigner()
      const contract2 = new ethers.Contract(contract_address2 as `0x${string}`, propabi2 as any, signer)
      const recipient = (address as `0x${string}`) || (await signer.getAddress())
      // Ensure whole-number string to align with token's 10**18 multiplication
      const amtStr = (fromAmount || "0").split(".")[0]
      if (!amtStr || amtStr === "0") {
        throw new Error("Invalid amount: enter a whole number greater than 0")
      }
      const tx2 = await contract2.mint(recipient, amtStr)
      await tx2.wait()

      // Success UI
      toast({ title: "Bridge successful", description: "Your assets have been bridged." })
      setOpen(true)
    } catch (err: any) {
      toast({ title: "Bridge failed", description: err?.shortMessage || err?.message || "Transaction failed" })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div
        className={cn(
          "w-full max-w-[560px] mx-auto",
          "rounded-3xl border border-border/50 bg-background/10 backdrop-blur-md",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_10px_40px_-12px_rgba(0,0,0,0.45)]",
        )}
      >
        {/* From */}
        <div className="p-5 md:p-6">
          <div className="text-sm font-medium text-foreground">From</div>
          <div className="mt-3 grid grid-cols-1 gap-3">
            <Input
              placeholder="From account (e.g., 0x...)"
              className="h-11 rounded-xl bg-background/30 border-border/40"
            />
            <div className="flex items-center justify-between gap-3">
              <Select value={fromNetwork} onValueChange={handleFromNetworkChange}>
                <SelectTrigger className="h-11 w-[180px] rounded-xl bg-background/30 border-border/40">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent align="start" className="bg-background/95 backdrop-blur-md">
                  {NETWORKS.map((n) => (
                    <SelectItem key={n.id} value={n.id}>
                      {n.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-1" />
              <Input
                value={fromAmount}
                onChange={(e) => handleFromAmount(e.target.value)}
                placeholder="0"
                className="h-11 w-[140px] text-right rounded-xl bg-background/30 border-border/40"
              />
            </div>
            <div className="text-xs text-muted-foreground">{fromAmount || "0"} BAZ</div>
          </div>
        </div>

        <div className="h-px w-full bg-border/40" />

        {/* To */}
        <div className="p-5 md:p-6">
          <div className="text-sm font-medium text-foreground">To</div>
          <div className="mt-3 grid grid-cols-1 gap-3">
            {/* <Input
              placeholder="To account (e.g., 0x...)"
              className="h-11 rounded-xl bg-background/30 border-border/40"
            /> */}
            <div className="flex items-center justify-between gap-3">
              <Select value={toNetwork} onValueChange={handleToNetworkChange}>
                <SelectTrigger className="h-11 w-[180px] rounded-xl bg-background/30 border-border/40">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent align="start" className="bg-background/95 backdrop-blur-md">
                  {NETWORKS.map((n) => (
                    <SelectItem key={n.id} value={n.id}>
                      {n.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-1" />
              <Input
                value={toAmount}
                onChange={(e) => handleFromAmount(e.target.value)}
                placeholder="0"
                className="h-11 w-[140px] text-right rounded-xl bg-background/30 border-border/40"
              />
            </div>
            <div className="text-xs text-muted-foreground">{toAmount || "0"} BAZ</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 p-5 md:p-6">
          <Button variant="secondary" className="rounded-xl bg-background/30 text-foreground">
            Cancel
          </Button>
          <Button
            onClick={() => onBridge(fromAmount)}
            disabled={busy}
            className={cn("rounded-xl", "bg-[oklch(var(--primary))] text-[oklch(var(--primary-foreground))]")}
          >
            {busy ? "Bridging..." : "Bridge"}
          </Button>
        </div>
      </div>

      {/* Scratch modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border border-border/50 bg-background/20 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Congratulations</DialogTitle>
            <DialogDescription className="text-muted-foreground">Scratch to reveal your BAZ reward</DialogDescription>
          </DialogHeader>
          <div className="flex w-full justify-center py-2">
            <ScratchCard
              rewardText={`${reward} BAZ`}
              width={360}
              height={200}
              onRevealComplete={() => setCanClaim(true)}
            />
            
          </div>
          <Button
                          className={cn(
                            "mt-2 w-full",
                            canClaim
                              ? "bg-pink-600 hover:bg-pink-500 text-white"
                              : "bg-muted text-muted-foreground cursor-not-allowed",
                          )}
                          disabled={!canClaim}
                          onClick={handleClaim}
                        >
                          Claim
                        </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default BridgeBox
