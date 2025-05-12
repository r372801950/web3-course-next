'use client'

import React from 'react'
import {useQuery} from '@tanstack/react-query'
import {CourseDataResponse, courseListOptions} from "@/app/[locale]/courses/pokemon";

export function CourseList() {
  const {
      data: courseData,
      isLoading,
      error
  } = useQuery<CourseDataResponse>({
    ...courseListOptions,
    // staleTime: Infinity,  // 数据永不过时
    // 或者使用更合理的时间，如 5 分钟
    staleTime: 5 * 60 * 1000,
    // 仅当缓存中没有数据时才获取
    refetchOnMount: false
  })

  if (isLoading) return <div>加载中...</div>;

  // 处理错误状态
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div>
      <h1>课程列表2</h1>
      <p>证明react-query同一个key不会重复请求</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courseData?.data.map((course, index) => (
          <div key={index} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold">{course.name}</h2>
            <p>价格: {course.price} ETH</p>
            <p>状态: {course.isActive ? '可用' : '不可用'}</p>
            {/*<p>创建者: {course.creator.substring(0, 6)}...{course.creator.substring(38)}</p>*/}
          </div>
        ))}
      </div>
    </div>
  )
}