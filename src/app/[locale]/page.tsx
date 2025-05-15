
// import NavBar from "@/components/nav/nav-bar";
// import CourseList from "@/components/course/course-list";
import {SparklesCore} from "@/components/sparkles";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import HotCourses from "@/components/hot-courses";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {getQueryClient} from "@/app/[locale]/courses/get-query-client";
import {hotCourseOptions, hotCourseOptionsServer} from "@/lib/hooks/use-course-db";

export default function HomePage() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(hotCourseOptionsServer)

  return (
    <>
      {/*<NavBar />
      <CourseList />*/}
      <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        {/* Ambient background with moving particles */}
        <div className="h-full w-full absolute inset-0 z-0">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>

        <div className="relative z-10">
          <Navbar />
          <Hero />
          <HydrationBoundary state={dehydrate(queryClient)}>
            <HotCourses />
          </HydrationBoundary>
        </div>
      </main>
    </>
  )
}