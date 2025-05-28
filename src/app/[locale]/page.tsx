import Hero from "@/components/hero";
// import HotCourses from "@/components/hot-courses";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {getQueryClient} from "@/lib/get-query-client";
import {hotCourseOptionsServer} from "@/lib/hooks/use-course-db";
import dynamic from "next/dynamic";

const HotCourses = dynamic(() => import("@/components/hot-courses"), {
  ssr: true, // 保持服务端渲染
  loading: () => (//接口卡顿的loading，lcp快了500-1000ms
    <div className="animate-pulse p-6">
      loading...
    </div>
  )
});

export default function HomePage() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(hotCourseOptionsServer)

  return (
    <>
      <Hero />
      {/* <HydrationBoundary state={dehydrate(queryClient)}>
        <HotCourses />
      </HydrationBoundary> */}
    </>
  )
}