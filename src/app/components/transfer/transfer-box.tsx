"use client"

import * as React from "react"
import { Button } from "@/app/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/app/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import { cn } from "@/app/lib/utils"
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
      <SelectTrigger className={cn("min-w-[120px]", className)}>
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

export function TransferBox() {
  const [fromAccount, setFromAccount] = React.useState("")
  const [toAccount, setToAccount] = React.useState("")
  const [fromToken, setFromToken] = React.useState<Token>("U2U")
  const [toToken, setToToken] = React.useState<Token>("U2U")
  const [amount, setAmount] = React.useState<string>("0")
  const [isTransferring, setIsTransferring] = React.useState(false)

  // scratch reward modal
  const [openCongrats, setOpenCongrats] = React.useState(false)
  const [reward, setReward] = React.useState<number>(() => Math.floor(Math.random() * 10) + 1)
  const [canClaim, setCanClaim] = React.useState(false)

  // keep tokens independent but default equal; no enforced difference needed on transfer
  React.useEffect(() => {
    // optional token sync logic could go here if needed
  }, [fromToken, toToken])

  function handleCancel() {
    setFromAccount("")
    setToAccount("")
    setFromToken("U2U")
    setToToken("U2U")
    setAmount("0")
    setIsTransferring(false)
  }

  function handleTransfer() {
    if (isTransferring) return
    setIsTransferring(true)
    setCanClaim(false)

    // simulate processing delay
    setTimeout(() => {
      toast({
        title: "Transfer successful",
        description: `${amount || 0} ${fromToken} sent from ${fromAccount || "From"} to ${toAccount || "To"}.`,
      })
      setReward(Math.floor(Math.random() * 10) + 1)
      setOpenCongrats(true)
      setIsTransferring(false)
    }, 5000)
  }

  function handleClaim() {
    setOpenCongrats(false)
  }

  const isTransferDisabled = !fromAccount || !toAccount || Number(amount) <= 0 || isTransferring

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className={cn("rounded-2xl border border-border/60 bg-card/20 backdrop-blur-md shadow-lg", "p-5")}>
        {/* From section */}
        <div className="space-y-3">
          <div className="text-sm font-medium">From</div>
          <input
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            placeholder="From account (e.g., 0x...)"
            className={cn(
              "w-full rounded-lg border border-border/50 bg-card/20 px-4 py-3",
              "text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring",
            )}
            aria-label="From account address"
          />
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/20 px-4 py-3">
            <TokenSelect value={fromToken} onChange={setFromToken} />
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-28 bg-transparent text-right text-lg font-semibold outline-none"
                aria-label="Amount"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 h-px w-full bg-border/60" />

        {/* To section */}
        <div className="space-y-3">
          <div className="text-sm font-medium">To</div>
          <input
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            placeholder="To account (e.g., 0x...)"
            className={cn(
              "w-full rounded-lg border border-border/50 bg-card/20 px-4 py-3",
              "text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring",
            )}
            aria-label="To account address"
          />
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/20 px-4 py-3">
            <TokenSelect value={toToken} onChange={setToToken} />
            <div className="text-right text-lg font-semibold">{amount || "0"}</div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="secondary" className="h-10" onClick={handleCancel} disabled={isTransferring}>
            Cancel
          </Button>
          <Button className="h-10" onClick={handleTransfer} disabled={isTransferDisabled}>
            {isTransferring ? "Transferring..." : "Transfer"}
          </Button>
        </div>
      </div>

      {/* Universal scratch card modal */}
      <Dialog open={openCongrats} onOpenChange={setOpenCongrats}>
        <DialogContent className="bg-card/20 backdrop-blur-xl border border-border/60 max-w-lg text-foreground">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Congratulations!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="text-sm text-muted-foreground">Scratch to reveal your bonus</div>
            {/* Note: reward text is fully hidden by the opaque overlay until scratched */}
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

export default TransferBox
