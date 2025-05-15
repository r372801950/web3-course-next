import TokenExchangeCard from "@/app/[locale]/swap/token-exchange-card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 backdrop-blur-sm">
      <TokenExchangeCard />
    </main>
  )
}