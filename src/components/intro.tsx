import React from "react";
import styles from "./intro.module.css";

const codeSource = `https://raw.githubusercontent.com/hyperledger/fabric-sdk-node/61cf4b2441c7c30eaf36aa744e9768a0e7edf722/test/unit/channel-event-hub.js`;

async function codeShuffleGeneratorFn(
  source: string,
  offset: number = 200,
  lengthOfShownText: number = 30000,
): Promise<() => string> {
  let codeSample = await fetch(source)
    .then((res) => res.blob())
    .then((blob) => blob.text())
    .then((text) => text.replace(/\r?\n|\r/g, "").split(""));
  codeSample = [...codeSample, ...codeSample, ...codeSample];
  let index: number = 0;
  return (): string => {
    index =
      Math.floor(Math.random() * (codeSample.length - lengthOfShownText)) +
      offset;
    return codeSample.slice(index, index + lengthOfShownText).join("");
  };
}

const textGenerationFn = await codeShuffleGeneratorFn(codeSource);

const moveMask = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  const target = e.target as HTMLElement;
  target.style.setProperty("--__x", e.clientX - target.offsetLeft + "px");
  target.style.setProperty("--__y", e.clientY - target.offsetTop + "px");
};

const handleMouseMoveGeneratorFn = (
  setText: React.Dispatch<React.SetStateAction<string>>,
) => {
  return (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    moveMask(e);
    setText(textGenerationFn());
  };
};

const handleMouseEnter = (e: React.MouseEvent) => {
  (e.target as HTMLElement).style.setProperty("--__opacity", "1");
};

const handleMouseLeave = (e: React.MouseEvent) => {
  (e.target as HTMLElement).style.setProperty("--__opacity", "0");
};

export function Intro(): React.JSX.Element {
  const [text, setText] = React.useState<string>(textGenerationFn());
  const handleMouseMove = handleMouseMoveGeneratorFn(setText);

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${styles.container} h-full w-dvw relative flex flex-col justify-center items-center p-0 m-0 snap-start snap-always`}
    >
      <div className={`${styles.codeShuffle} break-all leading-tight`}>
        {text}
      </div>
      <div
        className={`${styles.textContainer} w-3/5 flex flex-col justify-center items-center text-center gap-16`}
      >
        <h1 className="text-8xl font-extrabold tracking-tight lg:text-8xl">
          Meddah Abdallah
        </h1>
        <h4 className="text-xl font-regular tracking-tight">
          Full-stack developer specializing in crafting high-quality user
          experiences and robust code, with a flexible approach to
          infrastructure. Expertise spans{" "}
          <span className={styles.highlight}>
            front to back-end to infrastructure
          </span>
          , ensuring seamless, efficient, and scalable solutions.
        </h4>
      </div>
    </section>
  );
}
