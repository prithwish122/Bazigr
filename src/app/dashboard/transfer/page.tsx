import Image from "next/image"
import { ConnectWalletModal } from "@/app/components/dashboard/connect-wallet-modal"

export default function TransferPage() {
  return (
    <>
      <ConnectWalletModal />
      <div className="w-full border-none">
        <Image
          src="/images/transfer-banner.png"
          alt="Transfer"
          width={1400}
          height={200}
          className="w-full h-auto"
          priority
          
        />
      </div>
    </>
  )
}
