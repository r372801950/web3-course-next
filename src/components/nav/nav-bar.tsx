import {useTranslations} from 'next-intl';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import ConnectBtn from "@/components/connect-wallet/connect-btn";


export default function NavBar() {
  const nav = useTranslations('Navigation');
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* 左侧 Logo */}
        <div className="flex items-center">
          <div className="font-bold text-xl">
            <Image
              className='mr-5'
              src="/logo.png" // 假设您的SVG文件名为logo.svg
              alt={nav('logo')}
              width={100} // 设置合适的宽度
              height={50} // 设置合适的高度
              priority // 如果这是重要的首屏元素，建议添加priority属性
            />
          </div>

          {/* 中间导航项 */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/course"
                  className={navigationMenuTriggerStyle()}
                >
                  {nav('hotCourses')}
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/course-list"
                  className={navigationMenuTriggerStyle()}
                >
                  {nav('courseList')}
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/docs"
                  className={navigationMenuTriggerStyle()}
                >
                  {nav('documentation')}
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* 右侧连接钱包按钮 */}
        <div>
          <ConnectBtn />
        </div>
      </div>
    </header>
  );
}