"use client"

import { WobbleCard } from "./ui/wobble-card"

export default function WhyChooseUs() {
  return (
    <section className="py-20 px-4">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12 text-balance">Why choose us?</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
        <WobbleCard containerClassName="col-span-1 lg:col-span-2 h-full bg-gradient-to-br from-[#1a1f3a] via-[#2d3561] to-[#1e2749] min-h-[500px] lg:min-h-[300px]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Swap, Bridge & Lend
              </h3>
            </div>
            <p className="mt-4 text-left text-base/6 text-neutral-200">
              Access all DeFi essentials in one place — move, earn, and grow effortlessly.
            </p>
          </div>
        </WobbleCard>

        <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-gradient-to-br from-[#f5a6c8] via-[#f8b5d4] to-[#ffc4e1]">
          <div className="max-w-xs">
            <h3 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-gray-900">
              Earn Cashbacks & Rewards
            </h3>
            <p className="mt-4 text-left text-base/6 text-gray-800">
              Every transaction gives you back — get instant cashback and exclusive bonuses.
            </p>
          </div>
        </WobbleCard>

        <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-gradient-to-br from-[#f5a6c8] via-[#f0b3d9] to-[#f5c4e8]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              <h3 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-gray-900">
                Daily Tasks
              </h3>
            </div>
            <p className="mt-4 text-left text-base/6 text-gray-800">
              Complete simple missions to boost XP, unlock badges, and earn extravian extra rewards.
            </p>
          </div>
        </WobbleCard>

        <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-gradient-to-br from-[#b8a8d9] via-[#c5b8e8] to-[#d4c8f5]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-gray-900">
                Defi Agent
              </h3>
            </div>
            <p className="mt-4 text-left text-base/6 text-gray-800">
              Your smart companion that guides, automates, and simplifies every on-chain move.
            </p>
          </div>
        </WobbleCard>

        <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-gradient-to-br from-[#2d7a7a] via-[#3a8f8f] to-[#2d6b6b]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
              <h3 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Mini Games After Every Move
              </h3>
            </div>
            <p className="mt-4 text-left text-base/6 text-neutral-200">Turn each DeFi action into fun and surprises.</p>
          </div>
        </WobbleCard>
      </div>
    </section>
  )
}
