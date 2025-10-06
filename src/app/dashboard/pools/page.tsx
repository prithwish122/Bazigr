"use client"

import Image from "next/image"
import { useState } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog"
import { ExternalLink } from "lucide-react"

export default function PoolsPage() {
  const [isOwltoOpen, setIsOwltoOpen] = useState(false)

  return (
    <div className="w-full space-y-8">
      <Image src="/images/pools-banner.png" alt="Pools" width={1400} height={200} className="w-full h-auto" priority />

      <div className="px-6">
        <Card
          className="relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
          onClick={() => setIsOwltoOpen(true)}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Liquid wave effect background */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
                </div>

                {/* Icon placeholder with glass effect */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/30 to-purple-500/30 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                    O
                  </div>
                </div>

                {/* Text content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    Owlto Finance
                  </h3>
                  <p className="text-white/60 text-sm">Cross-chain bridge and liquidity protocol</p>
                </div>
              </div>

              {/* Arrow icon */}
              <div className="relative z-10">
                <ExternalLink className="w-6 h-6 text-white/60 group-hover:text-cyan-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </div>
            </div>

            {/* Decorative liquid wave effect */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isOwltoOpen} onOpenChange={setIsOwltoOpen}>
        <DialogContent className="max-w-6xl h-[80vh] p-0 bg-black/90 backdrop-blur-xl border-white/20">
          <DialogTitle className="sr-only">Owlto Finance</DialogTitle>
          <iframe
            src="https://owlto.finance/"
            className="w-full h-full rounded-lg"
            title="Owlto Finance"
            allow="clipboard-read; clipboard-write"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
