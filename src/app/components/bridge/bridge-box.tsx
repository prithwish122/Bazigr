"use client"

import * as React from "react"
import { cn } from "@/app/lib/utils"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog"
import { useToast } from "../../toasts/use-toast"
import { ScratchCard } from "@/app/components/rewards/scratch-card"

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

  async function onBridge() {
    
    if (busy) return
    setBusy(true)
    await new Promise((res) => setTimeout(res, 10_000)) // 10s timeout
    toast({ title: "Bridge successful", description: "Your assets have been bridged." })
    setOpen(true)
    setBusy(false)
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
            onClick={onBridge}
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
