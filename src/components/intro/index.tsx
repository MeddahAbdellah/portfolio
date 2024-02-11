import React from "react";
import styles from "./intro.module.css";
import { text } from "./code-sample.json";
import { animateIntroMask } from "./animate-intro-mask";

function codeShuffleGeneratorFn(
  offset: number = 200,
  lengthOfShownText: number = 30000,
): () => string {
  const codeSample = text.repeat(10);
  let index: number = 0;
  return (): string => {
    index =
      Math.floor(Math.random() * (codeSample.length - lengthOfShownText)) +
      offset;
    return codeSample
      .split("")
      .slice(index, index + lengthOfShownText)
      .join("");
  };
}

const textGenerationFn = codeShuffleGeneratorFn();

function generateDocumentScrollEffectFn(
  ref: React.RefObject<HTMLDivElement>,
): () => void {
  return () => {
    ref.current?.style.setProperty("--__opacity", "0");
  };
}

const registerDocumentScrollEffect = (
  containerRef: React.RefObject<HTMLDivElement>,
) => {
  return () => {
    const documentScrollEffect = generateDocumentScrollEffectFn(containerRef);
    document.addEventListener("scroll", documentScrollEffect, true);
    return () => document.removeEventListener("scroll", documentScrollEffect);
  };
};

const moveMask = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  const target = e.target as HTMLElement;
  target.style.setProperty("--__opacity", "1");
  animateIntroMask(target, e.clientX, e.clientY);
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

const initialTest = text.repeat(10);

export function Intro(): React.JSX.Element {
  const [text, setText] = React.useState<string>(initialTest);
  const handleMouseMove = handleMouseMoveGeneratorFn(setText);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(registerDocumentScrollEffect(containerRef), []);

  return (
    <section
      ref={containerRef}
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
        <h2 className="text-xl font-regular tracking-tight">
          Full-stack developer specializing in crafting high-quality user
          experiences and robust code, with a flexible approach to
          infrastructure. Expertise spans{" "}
          <span className={styles.highlight}>
            front to back-end to infrastructure
          </span>
          , ensuring seamless, efficient, and scalable solutions.
        </h2>
      </div>
    </section>
  );
}
