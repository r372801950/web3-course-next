import { ethers } from "ethers";
import { CourseMarket__factory } from "@/typechain-types";

async function getServerCourseInfo() {
  try {
    // 使用公共RPC提供商连接区块链网络
    // 注意：应使用与您的合约相匹配的网络
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL || "https://ethereum-sepolia.publicnode.com" // 根据您的合约所在网络调整
    );

    // CourseMarket合约地址
    const contractAddress = "0xE19f6eabb277012834D7cF31F74bF4eeD26DdA95";

    // 使用typechain工厂类
    const courseMarket = CourseMarket__factory.connect(
      contractAddress,
      provider
    );

    // 获取课程总数
    const totalCourses = await courseMarket.courseCount();

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

    return {
      totalCourses: totalCourses.toString(),
      courses
    };
  } catch (error) {
    console.error("服务器获取课程信息失败:", error);
    // 在服务器端出错时返回空数据，而不是抛出错误
    return {
      totalCourses: "0",
      courses: []
    };
  }
}

export default getServerCourseInfo;