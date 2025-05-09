
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {ReactNode} from "react";
import {Web3ClientProvider} from "@/components/provider/Web3Provider";

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
          {children}
        </Web3ClientProvider>
      </NextIntlClientProvider>
    </body>
    </html>
  );
}