import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import styles from "./code-examples.module.css";
import { frontSkills } from "./front-example-urls";
import { backSkills } from "./back-example-urls";

export function CodeExamples(props: {
  type: "front" | "back";
}): React.JSX.Element {
  const { type } = props;
  const skills = type === "front" ? frontSkills : backSkills;
  const [url, setUrl] = React.useState<string>(
    "https://stackblitz.com/edit/stackblitz-starters-vsqw3r",
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
