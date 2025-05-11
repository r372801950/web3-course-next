import { queryOptions } from '@tanstack/react-query'
import getCourseInfo from "@/lib/contracts/getCourseInfo";

export const pokemonOptions = queryOptions(
  // {
  //   queryKey: ['pokemon'],
  //   queryFn: async () => {
  //     const response = await fetch('https://pokeapi.co/api/v2/pokemon/25')
  //
  //     return response.json()
  //   },
  // }
  {
    queryKey: ['courses-list'],   // 唯一标识这个查询的键
    queryFn: getCourseInfo,  // 数据获取函数
    staleTime: 60 * 1000,    // 数据保持新鲜状态的时间（毫秒）
    // retry: 1,                // 失败重试次数
  }
)