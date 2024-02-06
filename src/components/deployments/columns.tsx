import { type ColumnDef } from "@tanstack/react-table";
import { deploymentState, type Deployment } from "./deployments.model";

const stateToChip = (state: string) => {
  switch (state) {
    case deploymentState.ready:
      return <i className="bg-green-500 rounded-full w-2 h-2"></i>;
    case deploymentState.error:
      return <i className="bg-red-500 rounded-full w-2 h-2"></i>;
    case deploymentState.building:
      return <i className="bg-yellow-500 rounded-full w-2 h-2"></i>;
    case deploymentState.queued:
      return <i className="bg-blue-500 rounded-full w-2 h-2"></i>;
    case deploymentState.canceled:
      return <i className="bg-gray-500 rounded-full w-2 h-2"></i>;
    default:
      return <i className="bg-blue-500 rounded-full w-2 h-2"></i>;
  }
};

export const columns: ColumnDef<Deployment>[] = [
  {
    accessorKey: "state",
    header: () => <p className="text-center">State</p>,
    cell: ({ row }) => {
      const state = row.getValue<string>("state");
      return <div className="flex justify-center">{stateToChip(state)}</div>;
    },
  },
  {
    accessorKey: "commit",
    header: "Commit",
    cell: ({ row }) => {
      const commit = row.getValue<string>("commit");
      return (
        <p className="flex items-center">
          <img
            className="h-[16px] mr-1 aspect-square"
            src="commit-git.svg"
          ></img>
          {commit}
        </p>
      );
    },
  },
  {
    accessorKey: "branch",
    header: "Branch",
    cell: ({ row }) => {
      const branch = row.getValue<string>("branch");
      return (
        <p className="flex items-center">
          <img
            className="h-[16px] mr-1 aspect-square"
            src="pull-request.svg"
          ></img>
          {branch}
        </p>
      );
    },
  },
  {
    accessorKey: "preview",
    header: "Preview",
    cell: ({ row }) => {
      const preview = row.getValue<string>("preview");
      return (
        <a
          className="hover:underline flex items-center"
          href={`https://${preview}`}
          target="_blank"
        >
          {preview}{" "}
          <img className="h-[12px] ml-1 aspect-square" src="arrow.svg"></img>
        </a>
      );
    },
  },
];
