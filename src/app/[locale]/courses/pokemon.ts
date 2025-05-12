import { queryOptions } from '@tanstack/react-query'

// 首先定义一个 Course 接口
export interface Course {
  name: string;
  price: string | number;
  isActive: boolean;
  creator?: string; // 可选属性，因为你注释掉了这部分代码
}
export interface CourseDataResponse {
  data: Course[];
  // 其他可能的响应字段，如 code, message 等
}
// 定义课程列表查询选项
export const courseListOptions = queryOptions<CourseDataResponse>({
  queryKey: ['courses'],
  retry: 0,
  queryFn: async () => {
    // 使用相对路径，这样会通过 Next.js API 路由
    // const response = await fetch('/api/course/list')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }
});  // 添加分号，确保语句正确结束