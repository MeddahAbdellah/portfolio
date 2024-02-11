import { DataTable } from "./data-table";
import { Separator } from "../ui/separator";

export function Deployments(): React.JSX.Element {
  return (
    <section className="h-full w-full mx-auto snap-start snap-always relative overflow-hidden">
      <main className="w-full h-full py-8 px-16">
        <h2 className="text-3xl font-bold mb-4">Deployments</h2>
        <h3 className="text-sm text-zinc-400 ml-2">
          🚀 Continuously generated from the previous form
        </h3>
        <Separator className="mt-8 mb-2" />
        <DataTable />
      </main>
    </section>
  );
}
