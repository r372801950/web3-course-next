import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "web3 course",
  description: "web3 course next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
