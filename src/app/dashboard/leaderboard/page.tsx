import Image from "next/image"

export default function LeaderboardPage() {
  return (
    <div className="w-full">
      <Image
        src="/images/leaderboard-banner.jpg"
        alt="Leaderboard"
        width={1400}
        height={200}
        className="w-full h-auto"
        priority
      />
    </div>
  )
}
