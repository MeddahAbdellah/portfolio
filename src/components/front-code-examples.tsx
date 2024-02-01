import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import styles from "./front-code-examples.module.css";

const skills = [
  {
    icon: "./angular.svg",
    url: "https://stackblitz.com/edit/typescript-fnpafa?file=index.ts",
  },
  {
    icon: "./react.svg",
    url: "https://stackblitz.com/edit/typescript-fnpafda?file=index.ts",
  },
  {
    icon: "./svelte.svg",
    url: "https://stackblitz.com/edit/typescript-fnpafza?file=index.ts",
  },
  {
    icon: "./solidjs.svg",
    url: "https://stackblitz.com/edit/typescript-fnpafqa?file=index.ts",
  },
  {
    icon: "./qwik.svg",
    url: "https://stackblitz.com/edit/typescript-fnpafga?file=index.ts",
  },
  {
    icon: "./astro.svg",
    url: "https://stackblitz.com/edit/typescript-fnpafgaza?file=index.ts",
  },
  {
    icon: "./next.svg",
    url: "https://stackblitz.com/edit/typescript-fnpafgaa?file=index.ts",
  },
] as const;

export function FrontCodeExamples(): React.JSX.Element {
  const [url, setUrl] = React.useState<string>(
    "https://stackblitz.com/edit/typescript-fnpafa?file=index.ts",
  );

  const [loading, setLoading] = React.useState<boolean>(true);

  return (
    <main className="flex flex-col h-full w-full opacity-0 bg-background">
      <div className="flex justify-around w-full py-2">
        <NavigationMenu>
          <NavigationMenuList>
            {skills.map((skill, index) => {
              return (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    active={url === skill.url}
                    asChild
                    className={navigationMenuTriggerStyle()}
                    onClick={() => {
                      setLoading(true);
                      setUrl(skill.url);
                    }}
                  >
                    <img
                      className="mx-2 cursor-pointer h-[65px] object-cover"
                      src={skill.icon}
                    />
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {loading ? (
        <center className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <i className={styles.spinner}></i> Building application...
        </center>
      ) : (
        <></>
      )}

      <iframe
        src={url}
        onLoad={() => setLoading(false)}
        className={`h-full w-full ${loading ? " opacity-0" : ""}`}
      ></iframe>
    </main>
  );
}
