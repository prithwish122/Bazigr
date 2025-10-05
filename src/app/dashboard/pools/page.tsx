import Image from "next/image"

export default function PoolsPage() {
  return (
    <div className="w-full">
      <Image src="/images/pools-banner.png" alt="Pools" width={1400} height={200} className="w-full h-auto" priority />
    </div>
  )
}
