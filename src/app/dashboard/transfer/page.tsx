import Image from "next/image"
import { ConnectWalletModal } from "@/app/components/dashboard/connect-wallet-modal"
import { TransferFlow} from "@/app/components/transfer/transfer-flow"

export default function TransferPage() {
  return (
    <>
      <ConnectWalletModal />
      <div className="w-full">
        <Image
          src="/images/transfer-banner.png"
          alt="Transfer"
          width={1400}
          height={200}
          className="w-full h-auto"
          priority
        />
         <div className="mx-auto mt-6 w-full max-w-3xl px-4 min-h-[560px]">
          <TransferFlow />
        </div>
      </div>
    </>
  )
}
