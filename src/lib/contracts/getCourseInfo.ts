import { ethers } from "ethers";
import { CourseMarket__factory } from "@/typechain-types";

async function getCourseInfo() {
  try {
    // 检查是否存在window.ethereum（MetaMask）
    if (typeof window !== 'undefined' && window.ethereum) {
      // 使用MetaMask作为提供者
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // 请求用户授权
      await provider.send("eth_requestAccounts", []);

      // 获取签名者
      // const signer = provider.getSigner();

      // CourseMarket合约地址
      const contractAddress = process.env.NEXT_PUBLIC_COURSE_MARKET_ADDRESS || '';

      // 使用typechain工厂类
      const courseMarket = CourseMarket__factory.connect(
        contractAddress,
        provider
      );

      // 获取课程总数
      const totalCourses = await courseMarket.courseCount();
      console.log(`总课程数: ${totalCourses.toString()}`);

      // 获取所有课程信息
      const courses = [];
      for (let i = 0; i < totalCourses.toNumber(); i++) {
        const course = await courseMarket.courses(i);
        courses.push({
          web2CourseId: course.web2CourseId,
          name: course.name,
          price: ethers.utils.formatEther(course.price),
          isActive: course.isActive,
          creator: course.creator
        });
      }

      console.log("所有课程:", courses);

      return {
        totalCourses: totalCourses.toString(),
        courses
      };
    } else {
      throw new Error("MetaMask未安装或不可用");
    }
  } catch (error) {
    console.error("获取课程信息失败:", error);
    throw error;
  }
}

export default getCourseInfo;