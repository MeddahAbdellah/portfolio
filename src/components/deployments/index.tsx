import { DataTable } from "./data-table";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { Explanation } from "../explanation/explanation";
import { Button } from "../ui/button";

export function Deployments(): React.JSX.Element {
  const [explainVisible, setExplainVisible] = useState<boolean>(false);

  return (
    <section className="hidden md:block h-full w-full py-8 px-16 snap-start snap-always relative overflow-hidden">
      <Explanation
        src="deployments-explained.mp4"
        visible={explainVisible}
        onEnded={() => setExplainVisible(false)}
      />
      <header className="">
        <h2 className="text-3xl font-bold mb-4">Deployments</h2>
        <div className="flex justify-between">
          <h3 className="text-sm text-zinc-400 ml-2">
            🚀 Continuously generated from the previous form
          </h3>
          <Button
            aria-label="Show explanation"
            onClick={() => setExplainVisible(!explainVisible)}
          >
            What's this ? <i className="fa-solid fa-volume-high ml-2"></i>
          </Button>
        </div>
      </header>
      <main className="w-full h-full flex flex-col">
        <Separator className="mt-8 mb-2" />
        <DataTable />
      </main>
    </section>
  );
}
