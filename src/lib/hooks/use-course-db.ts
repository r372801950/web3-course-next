import {queryOptions, useQuery} from "@tanstack/react-query";
import {type Course} from "@/lib/types/index";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
}
export interface Course {
  id: string;
  name: string;
  price: string | number;
  isActive: boolean;
  creator?: string; // 可选属性，因为你注释掉了这部分代码
}
export interface Welcome {
  id:          string;
  name:        string;
  category:    string;
  description: string;
  price:       string;
  duration:    number;
  imgInfo:     Info;
  fileInfo:    Info;
  createdAt:   Date;
  updatedAt:   Date;
  imgUrl:      string;
}

export interface Info {
  id:       string;
  size:     number;
  title:    string;
  mimetype: Mimetype;
}

export enum Mimetype {
  ImageJPEG = "image/jpeg",
  ImagePNG = "image/png",
  VideoMp4 = "video/mp4",
}
export interface CourseListResponse {
  code: number;
  message: string;
  data: Course[];
}

// 获取课程列表
// export const useCourseList = () => {
//   return useQuery<Course[]>({
//     queryKey: ["courses"],
//     queryFn: async () => {
//       const res = await fetch(`/api/course/list`);
//       const data: ApiResponse<Course[]> = await res.json();
//       return data.data || [];
//     },
//   });
// };

export const hotCourseOptions = queryOptions<Course[]>({
  queryKey: ['courses'],
  retry: 0,
  // queryFn: async () => {
  //   // 使用相对路径，这样会通过 Next.js API 路由
  //   const response = await fetch('/api/course/list')
  //   return await response.json();
  //
  // }
  queryFn: async () => {
    // const response = await fetch('http://localhost:3000/api/course/list');
    const response = await fetch('/api/course/list');
    const result: CourseListResponse = await response.json();
    return result.data || [];
  }
});

// 获取课程详情
export const useCourseDetail = (courseId: string) => {
  return useQuery<Course | null>({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const res = await fetch(`/api/course/detail/${courseId}`);
      const data: ApiResponse<Course> = await res.json();
      return data.data;
    },
    enabled: !!courseId,
  });
};
