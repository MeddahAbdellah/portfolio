import { DataTable } from "./data-table";
import { Separator } from "../ui/separator";
import { useState, useEffect } from "react";
import type { Deployment } from "./deployments.model";

export function Deployments(): React.JSX.Element {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  useEffect(() => {
    fetch(`api/deployments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(({ deployments }) => setDeployments(deployments));
  }, []);

  return (
    <section className="h-full w-full mx-auto snap-start snap-always relative overflow-hidden">
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
