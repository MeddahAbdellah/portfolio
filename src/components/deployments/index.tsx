import { DataTable } from "./data-table";
import { Separator } from "../ui/separator";
import Parallax from "parallax-js";
import styles from "./deployments.module.css";
import { useState, useRef, useEffect } from "react";
import type { Deployment } from "./deployments.model";

export function Deployments({ url }: { url: string }): React.JSX.Element {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${url}api/deployments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setDeployments(data));
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    new Parallax(sceneRef.current);
  });

  return (
    <section className="h-full w-full mx-auto snap-start relative overflow-hidden">
      <div ref={sceneRef} className="absolute h-full w-full">
        <div
          className={styles.aurora}
          data-depth-y="3.2"
          data-depth-x=".6"
        ></div>
      </div>
      <main className="w-full h-full py-8 px-16">
        <h1 className="text-3xl font-bold mb-4">Deployments</h1>
        <h6 className="text-sm text-zinc-400 ml-2">
          🚀 Continuously generated from the previous form
        </h6>
        <Separator className="mt-8 mb-2" />
        <DataTable data={deployments} />
      </main>
    </section>
  );
}
