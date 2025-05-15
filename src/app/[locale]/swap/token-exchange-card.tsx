"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowDownUp, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Token type definition
type Token = {
  id: string
  name: string
  symbol: string
  icon: React.ReactNode
  balance: number
}

// Token data
const tokens: Token[] = [
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    icon: (
      <div className="bg-blue-700 p-1 rounded-full">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L5 12L12 16L19 12L12 2Z" fill="#627EEA" />
          <path d="M12 16L5 12L12 22L19 12L12 16Z" fill="#627EEA" />
          <path d="M12 2L12 9L19 12L12 2Z" fillOpacity="0.6" fill="#627EEA" />
          <path d="M12 16L12 22L19 12L12 16Z" fillOpacity="0.6" fill="#627EEA" />
        </svg>
      </div>
    ),
    balance: 1.234,
  },
  {
    id: "yd",
    name: "YD Token",
    symbol: "YD",
    icon: (
      <div className="bg-purple-700 p-1 rounded-full">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="12" fill="#FFC107" fillOpacity="0.2" />
          <path d="M7 8H17L12 18L7 8Z" fill="#FFC107" />
          <path d="M12 6L17 16H7L12 6Z" fill="#FFC107" />
        </svg>
      </div>
    ),
    balance: 1000,
  },
]

export default function TokenExchangeCard() {
  const [fromToken, setFromToken] = useState<Token>(tokens[0])
  const [toToken, setToToken] = useState<Token>(tokens[1])
  const [fromAmount, setFromAmount] = useState<string>("")
  const [toAmount, setToAmount] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [swapRotation, setSwapRotation] = useState<number>(0)

  // Mock exchange rate: 1 ETH = 1000 YD
  const ethToYdRate = 1000
  const ydToEthRate = 0.001

  // Calculate exchange amount when input changes
  useEffect(() => {
    if (fromAmount === "") {
      setToAmount("")
      return
    }

    const amount = Number.parseFloat(fromAmount)
    if (isNaN(amount)) {
      setToAmount("")
      return
    }

    if (fromToken.id === "eth" && toToken.id === "yd") {
      setToAmount((amount * ethToYdRate).toString())
    } else if (fromToken.id === "yd" && toToken.id === "eth") {
      setToAmount((amount * ydToEthRate).toString())
    }
  }, [fromAmount, fromToken, toToken])

  // Swap tokens with button rotation effect
  const handleSwapTokens = () => {
    // Rotate the swap button
    setSwapRotation(swapRotation + 180)

    // Swap the tokens immediately
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)

    const tempAmount = fromAmount
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  // Handle exchange
  const handleExchange = () => {
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setFromAmount("")
      setToAmount("")
    }, 1500)
  }

  // Check if exchange is valid
  const isExchangeValid = () => {
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) return false
    if (Number.parseFloat(fromAmount) > fromToken.balance) return false
    return true
  }

  // Render token input field
  const renderTokenInput = (
    token: Token,
    amount: string,
    label: string,
    id: string,
    isReadOnly: boolean,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  ) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor={id} className="text-gray-300">
          {label}
        </Label>
        <span className="text-sm text-gray-300">
          余额: {token.balance} {token.symbol}
        </span>
      </div>
      <div className="flex items-center space-x-2 p-3 bg-gray-900 bg-opacity-60 rounded-lg border border-purple-800">
        <div className="flex-shrink-0">{token.icon}</div>
        <div className="flex-grow">
          <div className="flex items-center">
            <span className="font-medium text-white">{token.symbol}</span>
            <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
          </div>
          <div className="text-xs text-gray-400">{token.name}</div>
        </div>
        <Input
          id={id}
          type="number"
          placeholder="0.0"
          value={amount}
          onChange={onChange}
          readOnly={isReadOnly}
          className="flex-grow border-none bg-transparent text-right text-white focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      {!isReadOnly && Number.parseFloat(amount) > token.balance && <p className="text-red-500 text-xs">余额不足</p>}
    </div>
  )

  return (
    <Card className="w-full max-w-md shadow-lg border-purple-700 bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-white">代币兑换</CardTitle>
        <CardDescription className="text-gray-300">在 ETH 和 YD 代币之间进行兑换</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* From token section */}
        {renderTokenInput(fromToken, fromAmount, "从", "from-amount", false, (e) => setFromAmount(e.target.value))}

        {/* Swap button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 border-purple-500 bg-purple-900 text-white hover:bg-purple-700 hover:text-white transition-all duration-300 z-10"
            onClick={handleSwapTokens}
            style={{ transform: `rotate(${swapRotation}deg)`, transition: "transform 0.5s ease" }}
          >
            <ArrowDownUp className="h-4 w-4" />
            <span className="sr-only">交换代币</span>
          </Button>
        </div>

        {/* To token section */}
        {renderTokenInput(toToken, toAmount, "到", "to-amount", true)}

        {/* Exchange rate info */}
        <div className="text-sm text-gray-300 p-2 bg-purple-900 bg-opacity-40 rounded-md border border-purple-800">
          <p>
            兑换比率: 1 {fromToken.symbol} = {fromToken.id === "eth" ? ethToYdRate : ydToEthRate} {toToken.symbol}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          disabled={!isExchangeValid() || isLoading}
          onClick={handleExchange}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              处理中...
            </>
          ) : !isExchangeValid() ? (
            "输入有效金额"
          ) : (
            `兑换 ${fromToken.symbol} 为 ${toToken.symbol}`
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
