'use client'

import React from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import {CourseDataResponse, courseListOptions} from "@/app/[locale]/courses/pokemon";

export function PokemonInfo() {
  const { data: courseData } = useSuspenseQuery<CourseDataResponse>(courseListOptions)

  return (
    <div>
      <h1>课程列表</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courseData.data.map((course, index) => (
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