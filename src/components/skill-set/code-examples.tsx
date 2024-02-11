import React from "react";
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
import {
  stagger,
  useAnimate,
  type AnimationPlaybackControls,
} from "framer-motion";
import { Spinner } from "../ui/spinner";

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
                  className="mx-2 cursor-pointer size-[24px] object-contain"
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

function reloadIframeToast(reloadFn: () => void, id?: number): void {
  toast.info("If the code takes too long to load, please click on refresh", {
    action: {
      label: "Refresh",
      onClick: reloadFn,
    },
    duration: 10000,
    ...(id ? { id } : {}),
  });
}

function registerToasterEffect(
  loading: boolean,
  visible: boolean,
  refresh: () => void,
): () => () => void {
  return () => {
    let timer: NodeJS.Timeout;
    if (loading && visible) {
      timer = setTimeout(() => {
        reloadIframeToast(refresh);
      }, 5000);
    }
    return () => clearTimeout(timer);
  };
}

function triggerSkillsAnimationEffect(
  animate: ReturnType<typeof useAnimate>[1],
): AnimationPlaybackControls {
  return animate(
    [
      ["img", { scale: [1, 1.5, 0.5] }, { duration: 1, delay: stagger(0.3) }],
      [
        "img",
        { x: -1000, opacity: 0 },
        { duration: 2, delay: stagger(0.3), at: 1 },
      ],
    ],
    {
      delay: 2,
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 2,
    },
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
  const animationRef = React.useRef<AnimationPlaybackControls>();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [visible, setVisible] = React.useState<boolean>(false);
  const refreshFn = reloadIframe?.bind(null, iframeRef.current);
  React.useEffect(registerToasterEffect(loading, visible, refreshFn), [
    loading,
    visible,
  ]);

  return (
    <main
      id="code-examples"
      onMouseEnter={() => {
        setVisible(true);
        if (!notifiedUserAboutRefresh) {
          reloadIframeToast(refreshFn, 1);
          setNotifiedUserAboutRefresh(true);
          animationRef.current = triggerSkillsAnimationEffect(animate);
        }
      }}
      className="flex flex-col h-full w-full px-16 opacity-0 bg-background"
    >
      <div ref={scope} className="flex relative justify-between my-2">
        <Select
          onOpenChange={() => {
            animationRef.current?.complete();
          }}
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

        <Button variant="outline" onClick={refreshFn}>
          Refresh
        </Button>
        <Button className="ml-2" variant="outline">
          <a href={url} target="_blank">
            Open in new tab
          </a>
        </Button>
      </div>
      <Toaster className="cursor-grab" />

      {loading ? (
        <center className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Spinner className="mb-4" /> Building application...
        </center>
      ) : (
        <></>
      )}

      <iframe
        ref={iframeRef}
        src={url}
        onLoadCapture={() => {
          setLoading(false);
        }}
        onLoad={() => {
          setLoading(false);
        }}
        className={`h-full rounded-lg ${loading ? " opacity-0" : ""}`}
      ></iframe>
    </main>
  );
}
