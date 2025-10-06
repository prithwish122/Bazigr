"use client"

import { Button } from "@/app/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import { Calendar, Plus, ArrowRightLeft, Badge as Bridge, Send } from "lucide-react"

export function UpcomingEvents() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white/80">
        <Calendar className="w-5 h-5" />
        <h2 className="text-base font-semibold">Daily tasks</h2>
      </div>

      <div className="border-2 border-dashed border-white/20 rounded-lg p-8 flex flex-col items-center justify-center space-y-4 min-h-[200px]">
        <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-white/40" />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs rounded-lg"
            >
              <Plus className="w-3 h-3 mr-1" />
              Daily tasks
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a2e] border-white/20 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Daily Tasks
              </DialogTitle>
              <DialogDescription className="text-white/60">Complete these tasks to earn rewards</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <ArrowRightLeft className="w-5 h-5 text-white/80" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white">Perform a swap</h3>
                  <p className="text-xs text-white/60">Exchange tokens on the platform</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Bridge className="w-5 h-5 text-white/80" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white">Bridge a token to any EVM chain</h3>
                  <p className="text-xs text-white/60">Transfer assets across chains</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Send className="w-5 h-5 text-white/80" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white">Perform a transfer</h3>
                  <p className="text-xs text-white/60">Send tokens to another wallet</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
