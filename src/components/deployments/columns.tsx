import { type ColumnDef } from "@tanstack/react-table";

export interface Deployment {
  uid: string;
  url: string;
  branch: string;
  sha: string;
  message: string;
  state: string;
}

const deploymentState = {
  ready: "READY",
  error: "ERROR",
  building: "BUILDING",
  queued: "QUEUED",
  cancelled: "CANCELLED",
};

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
    case deploymentState.cancelled:
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
    accessorKey: "message",
    header: "Commit",
    cell: ({ row }) => {
      const message = row.getValue<string>("message");
      return (
        <p className="flex items-center">
          <img className="h-[16px] mr-1 aspect-1/1" src="commit-git.svg"></img>
          {message}
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
            className="h-[16px] mr-1 aspect-1/1"
            src="pull-request.svg"
          ></img>
          {branch}
        </p>
      );
    },
  },
  {
    accessorKey: "url",
    header: "Preview",
    cell: ({ row }) => {
      const url = row.getValue<string>("url");
      return (
        <a
          className="hover:underline flex items-center"
          href={`https://${url}`}
          target="_blank"
        >
          {url} <img className="h-[12px] ml-1 aspect-1/1" src="arrow.svg"></img>
        </a>
      );
    },
  },
];
