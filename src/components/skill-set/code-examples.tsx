import React from "react";
import styles from "./code-examples.module.css";
import { skills, type SkillType } from "./skills";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { stagger, useAnimate } from "framer-motion";

function SkillGroup({ type }: { type: SkillType }): React.JSX.Element {
  return (
    <>
      {skills
        .filter((skill) => skill.type === type)
        .map((skill) => {
          return (
            <SelectItem key={skill.url} value={skill.url}>
              <p className="flex">
                <img
                  className="mx-2 cursor-pointer h-[24px] object-cover"
                  src={skill.icon}
                />
                {skill.name}
              </p>
            </SelectItem>
          );
        })}
    </>
  );
}

function reloadIframe(iframe: HTMLIFrameElement | null): void {
  if (!iframe) return;
  iframe.src += "";
}

function reloadIframeToast(id?: number): void {
  toast.info("If the code doesn't load, please click on refresh", {
    duration: 10000,
    ...(id ? { id } : {}),
  });
}

function registerToasterEffect(loading: boolean): () => () => void {
  return () => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        reloadIframeToast();
      }, 5000);
    }
    return () => clearTimeout(timer);
  };
}

function triggerSkillsAnimationEffect(
  animate: ReturnType<typeof useAnimate>[1],
): void {
  animate(
    [
      ["img", { scale: [1, 1.5, 0.5] }, { duration: 1, delay: stagger(0.3) }],
      [
        "img",
        { x: -1000, opacity: 0 },
        { duration: 2, delay: stagger(0.3), at: 1 },
      ],
    ],
    { delay: 2 },
  );
}

function Skills(): React.JSX.Element {
  return (
    <div className="overflow-hidden h-full w-full flex items-center justify-center">
      {skills.map((skill) => {
        return (
          <img
            key={skill.url}
            className="mx-2 cursor-pointer h-[24px] object-cover"
            src={skill.icon}
          />
        );
      })}
    </div>
  );
}

export function CodeExamples(): React.JSX.Element {
  const [url, setUrl] = React.useState<string>(
    "https://stackblitz.com/edit/stackblitz-starters-vsqw3r",
  );
  const [scope, animate] = useAnimate();
  const [notifiedUserAboutRefresh, setNotifiedUserAboutRefresh] =
    React.useState<boolean>(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(registerToasterEffect(loading), [loading]);

  return (
    <main
      onMouseEnter={() => {
        if (!notifiedUserAboutRefresh) {
          reloadIframeToast(1);
          setNotifiedUserAboutRefresh(true);
          triggerSkillsAnimationEffect(animate);
        }
      }}
      className="flex flex-col h-full w-full px-16 opacity-0 bg-background"
    >
      <Toaster className="cursor-grab" />
      <div ref={scope} className="flex relative justify-between my-2">
        <Select
          onValueChange={(url) => {
            setLoading(true);
            setUrl(url);
          }}
        >
          <SelectTrigger className="w-[320px]">
            <SelectValue placeholder="✨ Select a skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Frontend</SelectLabel>
              <SkillGroup type="front" />
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Backend</SelectLabel>
              <SkillGroup type="back" />
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Fullstack</SelectLabel>
              <SkillGroup type="fullstack" />
            </SelectGroup>
          </SelectContent>
        </Select>
        <Skills />
        <Button
          variant="outline"
          onClick={() => reloadIframe(iframeRef.current)}
        >
          Refresh
        </Button>
      </div>

      {loading ? (
        <center className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <i className={styles.spinner}></i> Building application...
        </center>
      ) : (
        <></>
      )}

      <iframe
        ref={iframeRef}
        src={url}
        onLoad={() => setLoading(false)}
        className={`h-full rounded-lg ${loading ? " opacity-0" : ""}`}
      ></iframe>
    </main>
  );
}