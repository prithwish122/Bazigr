"use client"

import { Trophy } from "lucide-react"

// Mock leaderboard data - replace with real data from your backend
const leaderboardData = [
  { rank: 1, wallet: "0x742d...5980", amount: 500, color: "from-yellow-400 to-yellow-500" },
  { rank: 2, wallet: "0x8a3f...1105", amount: 487, color: "from-cyan-400 to-cyan-500" },
  { rank: 3, wallet: "0x5c2e...5800", amount: 456, color: "from-pink-400 to-pink-500" },
  { rank: 4, wallet: "0x9d1b...4001", amount: 423, color: "from-orange-300 to-orange-400" },
  { rank: 5, wallet: "0x3f7a...8246", amount: 389, color: "from-orange-300 to-orange-400" },
  { rank: 6, wallet: "0x6e4c...5607", amount: 342, color: "from-orange-300 to-orange-400" },
  { rank: 7, wallet: "0x2b8d...4649", amount: 298, color: "from-orange-300 to-orange-400" },
  { rank: 8, wallet: "0x7f3e...3000", amount: 267, color: "from-orange-300 to-orange-400" },
]

export default function LeaderboardPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 blur-xl opacity-50" />
          <div className="relative bg-gradient-to-r from-red-500 to-pink-500 rounded-t-3xl py-4 px-6 text-center shadow-2xl">
            <h1 className="text-2xl font-bold text-white tracking-wide uppercase">Leaderboard</h1>
          </div>
        </div>

        {/* Leaderboard Container */}
        <div className="relative">
          {/* Glass morphism background */}
          <div className="absolute inset-0 backdrop-blur-xl bg-white/5 rounded-3xl border-4 border-yellow-500/50 shadow-2xl" />

          {/* Content */}
          <div className="relative p-6 space-y-3">
            {leaderboardData.map((entry) => (
              <div
                key={entry.rank}
                className={`relative group overflow-hidden rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${entry.color} opacity-90`} />

                {/* Glass overlay */}
                <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />

                {/* Content */}
                <div className="relative flex items-center gap-4 px-5 py-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    <span className="text-xl font-bold text-white drop-shadow-lg">{entry.rank}</span>
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Wallet Address */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white drop-shadow-md truncate uppercase tracking-wide">
                      {entry.wallet}
                    </p>
                  </div>

                  {/* Token Amount */}
                  <div className="flex-shrink-0 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/30">
                    <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
                      <span className="text-[10px] font-bold text-yellow-900">BAZ</span>
                    </div>
                    <span className="text-sm font-bold text-white drop-shadow-md">{entry.amount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </div>
            ))}
          </div>

          {/* Bottom decoration */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-gradient-to-b from-yellow-500/30 to-transparent rounded-b-full blur-xl" />
        </div>
      </div>
    </div>
  )
}
