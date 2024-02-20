import { DataTable } from "./data-table";
import { useState } from "react";
import { Explanation } from "../explanation/explanation";
import { Button } from "../ui/button";
import { ReviewForm } from "./review-form";

export function Deployments(): React.JSX.Element {
  const [explainVisible, setExplainVisible] = useState<boolean>(false);

  return (
    <section className="hidden md:flex flex-col h-full w-full py-8 px-16 snap-start snap-always relative overflow-hidden">
      <Explanation
        src="deployments-explained.mp4"
        visible={explainVisible}
        onEnded={() => setExplainVisible(false)}
      />
      <header>
        <h2 className="text-3xl font-bold mb-4">Pending reviews</h2>
        <div className="flex justify-between">
          <h3 className="text-sm text-zinc-400 ml-2">
            🚀 You can leave a review and you will a see it on the list
          </h3>
          <Button
            aria-label="Show explanation"
            onClick={() => setExplainVisible(!explainVisible)}
          >
            What's this ? <i className="fa-solid fa-volume-high ml-2"></i>
          </Button>
        </div>
      </header>
      <main className="w-full h-full flex gap-4 overflow-y-hidden">
        <ReviewForm />
        <DataTable />
      </main>
    </section>
  );
}
