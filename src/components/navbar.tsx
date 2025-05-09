"use client"

import { Button } from "@/components/ui/button"
import { Bot, Menu } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import type React from "react"
import { useTranslations } from "next-intl"
import ConnectBtn from "@/components/connect-wallet/connect-btn";

export default function Navbar() {
  const nav = useTranslations('Navigation');

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10"
    >
      <Link href="/" className="flex items-center space-x-2">
        <Bot className="w-8 h-8 text-purple-500" />
        <span className="text-white font-medium text-xl">{nav('web3University')}</span>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <NavLink href="/courses">{nav('courseList')}</NavLink>
        <NavLink href="/swap">{nav('tokenSwap')}</NavLink>
        <NavLink href="/upload-course">{nav('uploadCourse')}</NavLink>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <Button variant="ghost" className="text-white hover:text-purple-400">
          {nav('signIn')}
        </Button>
        {/*<Button className="bg-purple-600 hover:bg-purple-700 text-white">{nav('connectWallet')}</Button>*/}
        <ConnectBtn label={nav('connectWallet')} />
      </div>

      <Button variant="ghost" size="icon" className="md:hidden text-white">
        <Menu className="w-6 h-6" />
      </Button>
    </motion.nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-300 hover:text-white transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full" />
    </Link>
  )
}