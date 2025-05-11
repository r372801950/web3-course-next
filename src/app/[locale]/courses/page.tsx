// 'use client';
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {PokemonInfo} from "@/app/[locale]/courses/PokemonInfo";
import {pokemonOptions} from "@/app/[locale]/courses/pokemon";
import {getQueryClient} from "@/app/[locale]/courses/get-query-client";

const CoursePage = () => {
  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(pokemonOptions)

  // 渲染数据
  return (
    <div>

      <h1>Pokemon Info</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PokemonInfo />
      </HydrationBoundary>
    </div>
  );
}


export default CoursePage