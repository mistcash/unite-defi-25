import Image from "next/image";
import FloatingIslands from "../components/floating-islands";
import TransferUI from "../components/TransferUI";

export default function Home() {
  return <div className="font-sans items-center justify-items-center min-h-screen">
    <FloatingIslands>
      <TransferUI />
    </FloatingIslands>
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <Image
        className="dark:invert"
        src="/mist-logo.svg"
        alt="Mist logo"
        width={180}
        height={38}
        priority
      />
    </main>
  </div>;
}
