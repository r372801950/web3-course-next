// 'use client';
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {PokemonInfo} from "@/app/[locale]/courses/PokemonInfo";
import {courseListOptions } from "@/app/[locale]/courses/pokemon";
import {getQueryClient} from "@/app/[locale]/courses/get-query-client";
import {CourseList} from "@/app/[locale]/courses/course-list";

const CoursePage = () => {
  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(courseListOptions)

  // 渲染数据
  return (
    <div>

      <h1>Pokemon Info</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PokemonInfo />
      </HydrationBoundary>
      <CourseList />
    </div>
  );
}


export default CoursePage