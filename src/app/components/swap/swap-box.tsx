"use client"

import * as React from "react"
import { ArrowDown } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/app/components/ui/select"
import { cn } from "@/app/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import ScratchCard from "@/app/components/rewards/scratch-card"
import { toast } from "../../toasts/use-toast"

type Token = "U2U" | "BAZ"
const TOKENS: Token[] = ["U2U", "BAZ"]

function TokenSelect({
  value,
  onChange,
  className,
  placeholder,
}: {
  value: Token
  onChange: (v: Token) => void
  className?: string
  placeholder?: string
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as Token)}>
      <SelectTrigger className={cn("min-w-[140px]", className)}>
        <SelectValue placeholder={placeholder ?? "Select token"} />
      </SelectTrigger>
      <SelectContent>
        {TOKENS.map((t) => (
          <SelectItem key={t} value={t}>
            {t}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function SwapBox() {
  const [fromToken, setFromToken] = React.useState<Token>("U2U")
  const [toToken, setToToken] = React.useState<Token>("BAZ")
  const [fromAmount, setFromAmount] = React.useState<string>("0")
  const [toAmount, setToAmount] = React.useState<string>("0")
  const [isSwapping, setIsSwapping] = React.useState(false)
  const [openCongrats, setOpenCongrats] = React.useState(false)
  const [reward, setReward] = React.useState<number>(() => Math.floor(Math.random() * 10) + 1)
  const [canClaim, setCanClaim] = React.useState(false)

  // keep different tokens selected
  React.useEffect(() => {
    if (fromToken === toToken) {
      const alt = TOKENS.find((t) => t !== fromToken)!
      setToToken(alt)
    }
  }, [fromToken, toToken])

  React.useEffect(() => {
    setToAmount(fromAmount || "0")
  }, [fromAmount])

  function handleSwapClick() {
    if (isSwapping) return
    setIsSwapping(true)
    setCanClaim(false)
    // simulate processing
    setTimeout(() => {
      toast({
        title: "Swap successful",
        description: `${fromAmount || 0} ${fromToken} → ${toAmount || 0} ${toToken} completed.`,
      })
      // open scratch card
      setReward(Math.floor(Math.random() * 10) + 1)
      setOpenCongrats(true)
      setIsSwapping(false)
    }, 5000)
  }

  function handleClaim() {
    setOpenCongrats(false)
    // optional: post-claim behavior
  }

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-xl">
        <div className={cn("rounded-xl border border-border/60 bg-card/20 backdrop-blur-md shadow-lg", "p-4")}>
          {/* Top panel - Sell */}
          <div className="rounded-xl border border-border/50 bg-card/20 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm text-muted-foreground">Sell</div>
                <input
                  type="number"
                  inputMode="decimal"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className={cn("bg-transparent outline-none", "text-4xl font-medium leading-none", "w-full")}
                  aria-label="Sell amount"
                />
                <div className="mt-1 text-xs text-muted-foreground">$0</div>
              </div>
              <TokenSelect value={fromToken} onChange={setFromToken} className="shrink-0" />
            </div>
          </div>

          {/* Arrow between panels */}
          <div className="flex justify-center">
            <div className="relative -mt-4 mb-2">
              <div className="rounded-full border border-border/50 bg-card/40 backdrop-blur-md p-2 shadow-md">
                <ArrowDown className="size-4" />
              </div>
            </div>
          </div>

          {/* Bottom panel - Buy */}
          <div className="rounded-xl border border-border/50 bg-card/20 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm text-muted-foreground">Buy</div>
                <input
                  type="number"
                  inputMode="decimal"
                  value={toAmount}
                  onChange={(e) => setToAmount(e.target.value)}
                  className={cn("bg-transparent outline-none", "text-4xl font-medium leading-none", "w-full")}
                  aria-label="Buy amount"
                />
              </div>
              <TokenSelect value={toToken} onChange={setToToken} className="shrink-0" />
            </div>
          </div>

          {/* CTA - Swap */}
          <Button className="mt-4 h-12 w-full text-base" onClick={handleSwapClick} disabled={isSwapping}>
            {isSwapping ? "Swapping..." : "Swap"}
          </Button>
        </div>
      </div>

      <Dialog open={openCongrats} onOpenChange={setOpenCongrats}>
        <DialogContent className="bg-card/20 backdrop-blur-xl border border-border/60 max-w-lg text-foreground">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Congratulations!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="text-sm text-muted-foreground">Scratch to reveal your bonus</div>
            <ScratchCard
              rewardText={`${reward} BAZ`}
              width={360}
              height={200}
              onRevealComplete={() => setCanClaim(true)}
            />
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SwapBox
