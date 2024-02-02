import React, { useEffect, useRef } from "react";
import styles from "./front-skill-set.module.css";
import { stagger, useAnimate } from "framer-motion";
import { CodeExamples } from "./code-examples";

const tileSizePx = 100;

const generateResizeEffectFn = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  setNumberOfTiles: (value: React.SetStateAction<number>) => void,
  opened: React.MutableRefObject<boolean>,
) => {
  return () => {
    if (!containerRef.current || opened.current) return;
    const { clientWidth } = containerRef.current;
    const { clientHeight } = containerRef.current;

    const columns = Math.floor(clientWidth / tileSizePx);
    const rows = Math.floor(clientHeight / tileSizePx);
    setNumberOfTiles(columns * rows);

    containerRef.current.style.setProperty("--__rows", `${rows}`);
    containerRef.current.style.setProperty("--__columns", `${columns}`);
  };
};

function throttledGeneratorFn(effectFn: () => void): [() => void, () => void] {
  let timeoutId: ReturnType<typeof setTimeout> | undefined | null = undefined;
  return [
    (): void => {
      if (timeoutId) return undefined;
      timeoutId = setTimeout(() => {
        effectFn();
        timeoutId = null;
      }, 200);
    },
    () => {
      if (timeoutId) clearTimeout(timeoutId);
    },
  ];
}

export function SkillSet(props: { type: "front" | "back" }): React.JSX.Element {
  const { type } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const opened = useRef<boolean>(false);
  const [numberOfTiles, setNumberOfTiles] = React.useState<number>(0);

  const [scope, animate] = useAnimate();
  useEffect(() => {
    if (!containerRef.current) return;

    const observeTarget = containerRef.current;
    const resizeEffect = generateResizeEffectFn(
      containerRef,
      setNumberOfTiles,
      opened,
    );
    const [throttledResizeEffect, cleanThrottle] =
      throttledGeneratorFn(resizeEffect);
    const resizeObserver = new ResizeObserver(throttledResizeEffect);

    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
      cleanThrottle();
    };
  }, []);

  return (
    <section
      ref={scope}
      className={`${styles.wrapper} relative h-full w-full overflow-hidden snap-start snap-always`}
    >
      <CodeExamples type={type} />
      <div className="absolute h-full w-full top-0 pointer-events-none">
        <div ref={containerRef} className={styles.container}>
          <header className={`absolute z-10 pt-32 px-32`}>
            <h1 className="font-extrabold text-8xl">
              <span>{type === "front" ? "Frontend" : "Backend"} skills</span>{" "}
              <br /> <br />
              <span className={`${styles.highlight} pl-56`}>
                Click somewhere
              </span>
            </h1>
          </header>
          {Array.from({ length: numberOfTiles }, (_, i) => i + 1).map(
            (index: number) => {
              return (
                <p
                  key={index}
                  className={`${styles.tile} flex justify-center items-center pointer-events-auto`}
                  onClick={() => {
                    opened.current = true;

                    animate(
                      "p",
                      { opacity: 0, pointerEvents: "none" },
                      { delay: stagger(0.01, { from: index }) },
                    );

                    animate("header", { opacity: 0, pointerEvents: "none" });

                    animate(
                      "main",
                      { opacity: 1 },
                      { duration: 1.5, ease: "easeIn" },
                    );
                  }}
                ></p>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
