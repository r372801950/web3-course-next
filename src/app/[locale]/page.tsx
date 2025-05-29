import Hero from "@/components/hero";
// import dynamic from "next/dynamic";

// const HotCourses = dynamic(() => import("@/components/hot-courses"), {
//   ssr: true,
//   loading: () => (
//     <div className="animate-pulse p-6">
//       loading...
//     </div>
//   )
// });

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* <HydrationBoundary state={dehydrate(queryClient)}>
        <HotCourses />
      </HydrationBoundary> */}
    </>
  )
}