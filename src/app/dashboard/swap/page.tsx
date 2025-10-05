import Image from "next/image"

export default function SwapPage() {
  return (
    <div className="w-full">
      <Image src="/images/swap-banner.png" alt="Swap" width={1400} height={200} className="w-full h-auto" priority />
    </div>
  )
}
