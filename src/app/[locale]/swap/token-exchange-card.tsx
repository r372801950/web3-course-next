// src/components/token-exchange-card.tsx
"use client"

import React, {useState, useEffect} from "react"
import { ArrowDownUp, ChevronDown, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWeb3, TokenId } from "@/lib/context/web3-context"
import { ethers } from "ethers"
import { toast, Toaster } from "sonner"
import { useAccount } from "wagmi"

// 代币定义
interface TokenDefinition {
  id: TokenId
  name: string
  symbol: string
  icon: React.ReactNode
}

// 代币数据
const TOKENS: Record<TokenId, TokenDefinition> = {
  eth: {
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
  },
  yd: {
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
  },
}

// 交易对配置
const EXCHANGE_RATES: Record<string, number> = {
  "eth-yd": 1000, // 1 ETH = 1000 YD
  "yd-eth": 0.001, // 1 YD = 0.001 ETH
}

export default function TokenExchangeCard() {
  const { address, isConnected } = useAccount();
  const { ydContract, balances, refreshBalances } = useWeb3();

  const [fromTokenId, setFromTokenId] = useState<TokenId>("eth");
  const [toTokenId, setToTokenId] = useState<TokenId>("yd");
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [swapRotation, setSwapRotation] = useState<number>(0);
  const [isBalanceLoading, setIsBalanceLoading] = useState<boolean>(false);

  // 获取当前选中的代币
  const fromToken = TOKENS[fromTokenId];
  const toToken = TOKENS[toTokenId];

  // 获取兑换率
  const getExchangeRate = (from: TokenId, to: TokenId): number => {
    const rateKey = `${from}-${to}`;
    return EXCHANGE_RATES[rateKey] || 0;
  };

  // 格式化余额显示
  const formatBalance = (balance: string): string => {
    return Number(balance).toFixed(4);
  };

  // 组件挂载时刷新余额
  useEffect(() => {
    if (isConnected && address) {
      refreshBalances();
    }
  }, [isConnected, address, refreshBalances]);
  // }, [isConnected, address, useCallback(refreshBalances,[])]);

  // 计算兑换金额
  useEffect(() => {
    if (fromAmount === "") {
      setToAmount("");
      return;
    }

    const amount = Number.parseFloat(fromAmount);
    if (isNaN(amount)) {
      setToAmount("");
      return;
    }

    const rate = getExchangeRate(fromTokenId, toTokenId);
    if (rate > 0) {
      setToAmount((amount * rate).toString());
    }
  }, [fromAmount, fromTokenId, toTokenId]);

  // 交换代币
  const handleSwapTokens = () => {
    setSwapRotation(swapRotation + 180);

    const tempTokenId = fromTokenId;
    setFromTokenId(toTokenId);
    setToTokenId(tempTokenId);

    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  // 刷新余额
  const handleRefreshBalance = async () => {
    setIsBalanceLoading(true);
    await refreshBalances();
    setIsBalanceLoading(false);
  };

  // 处理兑换
  const handleExchange = async () => {
    if (!isConnected || !address) {
      toast.error("请先连接钱包");
      return;
    }

    if (!ydContract) {
      toast.error("合约未加载，请刷新页面");
      return;
    }

    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) return;

    setIsLoading(true);

    try {
      if (fromTokenId === "eth" && toTokenId === "yd") {
        // ETH 换 YD 调用 buyWithETH
        const tx = await ydContract.buyWithETH({
          value: ethers.utils.parseEther(fromAmount),
        });

        // 等待交易确认
        await tx.wait();
        toast.success("兑换成功！");
      } else if (fromTokenId === "yd" && toTokenId === "eth") {
        // YD 换 ETH 调用 sellTokens
        const amountInWei = ethers.utils.parseEther(fromAmount);
        const tx = await ydContract.sellTokens(amountInWei);

        // 等待交易确认
        await tx.wait();
        toast.success("兑换成功！");
      }

      // 重置输入
      setFromAmount("");
      setToAmount("");
    } catch (error) {
      console.error("交易失败:", error);
      toast.error("交易失败，请重试");
    } finally {
      setIsLoading(false);
      await handleRefreshBalance(); // 交易完成后刷新余额
    }
  };

  // 检查兑换是否有效
  const isExchangeValid = () => {
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) return false;

    const currentBalance = balances[fromTokenId] || "0";
    if (Number.parseFloat(fromAmount) > Number(currentBalance)) return false;

    return getExchangeRate(fromTokenId, toTokenId) > 0;
  };

  // 渲染代币输入字段
  const renderTokenInput = (
    tokenId: TokenId,
    amount: string,
    label: string,
    id: string,
    isReadOnly: boolean,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  ) => {
    const token = TOKENS[tokenId];
    const balance = balances[tokenId] || "0";

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor={id} className="text-gray-300">{label}</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-gray-400 hover:text-white"
              onClick={handleRefreshBalance}
              disabled={isBalanceLoading}
            >
              {isBalanceLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
            </Button>
            <span className="text-sm text-gray-300">
              余额: {formatBalance(balance)} {token.symbol}
            </span>
          </div>
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
        {!isReadOnly && Number.parseFloat(amount) > Number(balance) && (
          <p className="text-red-500 text-xs">余额不足</p>
        )}
      </div>
    );
  };

  return (
    <>
      <Toaster position="top-center" />
      <Card className="w-full max-w-md shadow-lg border-purple-700 bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-white">代币兑换</CardTitle>
          <CardDescription className="text-gray-300">在 ETH 和 YD 代币之间进行兑换</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* From token section */}
          {renderTokenInput(
            fromTokenId,
            fromAmount,
            "从",
            "from-amount",
            false,
            (e) => setFromAmount(e.target.value)
          )}

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
          {renderTokenInput(toTokenId, toAmount, "到", "to-amount", true)}

          {/* Exchange rate info */}
          <div className="text-sm text-gray-300 p-2 bg-purple-900 bg-opacity-40 rounded-md border border-purple-800">
            <p>
              兑换比率: 1 {fromToken.symbol} = {getExchangeRate(fromTokenId, toTokenId)} {toToken.symbol}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            disabled={!isExchangeValid() || isLoading || !ydContract}
            onClick={handleExchange}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                处理中...
              </>
            ) : !ydContract ? (
              "连接钱包"
            ) : !isExchangeValid() ? (
              "输入有效金额"
            ) : (
              `兑换 ${fromToken.symbol} 为 ${toToken.symbol}`
            )}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}