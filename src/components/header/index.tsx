"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Header(): React.JSX.Element {
  return (
    <header
      style={{
        height: "var(--header-height)",
        borderColor: "hsl(var(--border))",
      }}
      className="hidden md:flex sticky bg-background top-0 w-full lg:pl-24 pr-8 border-b border-solid justify-between items-center z-10"
    >
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <a href="#xp">Experience</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <a href="#tastes">Skill Tastes</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <a href="#refs">References</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <a href="/blog">Blog</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <a
                href="/cv_meddah_abdallah.pdf"
                target="_blank"
                aria-label="My cv in pdf format"
              >
                <img src="cv-icon.svg" className="h-[12px]" alt="fullstack" />
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <a
                href="https://github.com/MeddahAbdellah"
                aria-label="My github profile"
                target="_blank"
              >
                <i className="fab fa-github text-lg">
                  <span className="hidden">github</span>
                </i>
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <a
                href="https://www.linkedin.com/in/meddahabdallah/"
                aria-label="My linkedin profile"
                target="_blank"
              >
                <i className="fab fa-linkedin-in text-lg"></i>
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <a
                href="https://stackoverflow.com/users/8208547/meddah-abdallah"
                aria-label="My stackoverflow profile"
                target="_blank"
              >
                <i className="fab fa-stack-overflow text-lg"></i>
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <a
                className="ml-8"
                href="https://calendly.com/meddah-abdallah/hire-me"
                target="_blank"
              >
                Hire Me
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
