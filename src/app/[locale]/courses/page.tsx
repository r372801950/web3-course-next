'use client';

import getCourseInfo from "@/lib/contracts/getCourseInfo";
import {useQuery} from "@tanstack/react-query";

const CoursePage = () => {
  /*useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const courseData = await getCourseInfo();
        setCourses(courseData.courses);
      } catch (err) {
        console.error("获取课程信息失败:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);*/

  // 使用 useQuery Hook 替换 useState 和 useEffect
  const {
    data: courseData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['courses'],   // 唯一标识这个查询的键
    queryFn: getCourseInfo,  // 数据获取函数
    staleTime: 60 * 1000,    // 数据保持新鲜状态的时间（毫秒）
    retry: 1,                // 失败重试次数
  });
  // 处理加载状态
  if (isLoading) return <div>加载中...</div>;

  // 处理错误状态
  if (error) return <div>错误: {error.message}</div>;
  // 渲染数据
  return (
    <div>
      <h1>课程列表</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courseData?.courses.map((course, index) => (
          <div key={index} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold">{course.name}</h2>
            <p>价格: {course.price} ETH</p>
            <p>状态: {course.isActive ? '可用' : '不可用'}</p>
            <p>创建者: {course.creator.substring(0, 6)}...{course.creator.substring(38)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


export default CoursePage