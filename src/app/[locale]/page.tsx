import {useTranslations} from 'next-intl';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

export default function HomePage() {
  const nav = useTranslations('Navigation');
  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList>
          {/* 热门课程导航项 */}
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/course"
              className={navigationMenuTriggerStyle()}
            >
              {nav('hotCourses')}
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* 课程列表导航项 */}
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/course-list"
              className={navigationMenuTriggerStyle()}
            >
              {nav('courseList')}
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* 文档导航项 */}
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
  );
}