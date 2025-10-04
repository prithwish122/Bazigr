export default function WhyChooseUs() {
  return (
    <section className="py-20 px-4">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12 text-balance">Why choose us?</h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[280px]">
        {/* Large card - Swap, Bridge & Lend */}
        <div className="md:col-span-2 lg:col-span-2 lg:row-span-1 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-blue-800/40 backdrop-blur-sm border border-white/10 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-2xl font-bold text-white">Swap, Bridge & Lend</h3>
            </div>
            <p className="text-white/80 text-lg">
              Access all DeFi essentials in one place — move, earn, and grow effortlessly.
            </p>
          </div>
        </div>

        {/* Earn Cashbacks & Rewards */}
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-pink-300/30 via-pink-200/30 to-orange-200/30 backdrop-blur-sm border border-white/10 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Earn Cashbacks & Rewards</h3>
            <p className="text-gray-800 text-sm">
              Every transaction gives you back — get instant cashback and exclusive bonuses.
            </p>
          </div>
        </div>

        {/* Daily Tasks */}
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-pink-200/30 via-purple-200/30 to-pink-300/30 backdrop-blur-sm border border-white/10 p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900">Daily Tasks</h3>
          </div>
          <p className="text-gray-800 text-sm">
            Complete simple missions to boost XP, unlock badges, and earn extravian extra rewards.
          </p>
        </div>

        {/* Defi Agent */}
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-purple-200/30 via-blue-200/30 to-purple-300/30 backdrop-blur-sm border border-white/10 p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-xl font-bold text-gray-900">Defi Agent</h3>
          </div>
          <p className="text-gray-800 text-sm">
            Your smart companion that guides, automates, and simplifies every on-chain move.
          </p>
        </div>

        {/* Mini Games After Every Move */}
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-teal-600/40 via-teal-700/40 to-emerald-600/40 backdrop-blur-sm border border-white/10 p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
            </svg>
            <h3 className="text-xl font-bold text-white">Mini Games After Every Move</h3>
          </div>
          <p className="text-white/90 text-sm">Turn each DeFi action into fun and surprises.</p>
        </div>
      </div>
    </section>
  )
}
