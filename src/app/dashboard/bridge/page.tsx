import Image from "next/image"

export default function BridgePage() {
  return (
    <div className="w-full">
      <Image
        src="/images/bridge-banner.png"
        alt="Bridge"
        width={1400}
        height={200}
        className="w-full h-auto"
        priority
      />
    </div>
  )
}
