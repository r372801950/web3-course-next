
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {ReactNode} from "react";
import {Web3ClientProvider} from "@/components/provider/Web3Provider";
// import {SparklesCore} from "@/components/sparkles";
import Navbar from "@/components/navbar";
// import dynamic from 'next/dynamic';
// const SparklesCore = dynamic(() => import('@/components/sparkles').then(mod => mod.SparklesCore), {
//   ssr: false
// })
export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
    <body>
      <NextIntlClientProvider>
        <Web3ClientProvider>
          <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
            {/* Ambient background with moving particles */}
            {/* <div className="h-full w-full absolute inset-0 z-0">
              <SparklesCore
                id="tsparticlesfullpage"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={100}
                className="w-full h-full"
                particleColor="#FFFFFF"
              />
            </div> */}

            <div className="relative z-10">
              {/* Navbar stays fixed across all pages */}
              <Navbar />

              {/* Page content changes based on route */}
              {children}
            </div>
          </main>
        </Web3ClientProvider>
      </NextIntlClientProvider>
    </body>
    </html>
  );
}