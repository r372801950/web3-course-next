import Hero from "@/components/hero";
import HotCourses from "@/components/hot-courses";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {getQueryClient} from "@/lib/get-query-client";
import {hotCourseOptionsServer} from "@/lib/hooks/use-course-db";

export default function HomePage() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(hotCourseOptionsServer)

  return (
    <>
      <Hero />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HotCourses />
      </HydrationBoundary>
    </>
  )
}