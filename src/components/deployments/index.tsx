import { useEffect } from "react";
import { type Deployment, columns } from "./columns";
import { DataTable } from "./data-table";
import React from "react";

async function getDeployments(): Promise<Deployment[]> {
  return fetch("http://localhost:3000/api/deployments")
    .then((res) => res.json())
    .then(({ deployments }) => deployments)
    .catch((err) => {
      console.error(err);
      return [];
    });
}

export function Deployments() {
  const [deployments, setDeployments] = React.useState<Deployment[]>([]);

  useEffect(() => {
    (async () => {
      const responseDeployments = await getDeployments();
      if (!responseDeployments) {
        return;
      }
      setDeployments(responseDeployments);
    })();
  }, []);

  return (
    <div className="container h-full mx-auto py-10 snap-start">
      <DataTable columns={columns} data={deployments} />
    </div>
  );
}
