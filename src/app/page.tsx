import ExpandableCards from "./components/Expandablecards"
import { Navbar } from "./components/navbar"
import WhyChooseUs from "./components/Whychooseus"

export default function Page() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="relative mx-auto flex min-h-[70vh] w-[min(92vw,980px)] flex-col items-center justify-center text-center mb-0">
        <h1 className="text-balance font-extrabold leading-[0.95] tracking-tight uppercase">
          <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-9xl">Your Defi</span>
          <span className="mt-1 block text-5xl sm:text-7xl md:text-8xl lg:text-9xl">Reimagined</span>
        </h1>
        <p className="mt-5 text-pretty italic opacity-95 text-lg sm:text-xl md:text-2xl">Every move gets rewarded</p>
      </section>
      <ExpandableCards />
      <WhyChooseUs/>
    </main>
  )
}
