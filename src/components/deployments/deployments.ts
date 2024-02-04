export interface Deployment {
  uid: string;
  preview: string;
  branch: string;
  sha: string;
  commit: string;
  state: string;
}

export interface VercelDeployment {
  uid: string,
  url: string,
  meta: {
    githubCommitRef: string,
    githubCommitSha: string,
    githubCommitMessage: string,
  },
  state: DeploymentState,
}

export type DeploymentState = "READY" | "BUILDING" | "ERROR" | "QUEUED" | "CANCELED";

export const deploymentState: { [key: string]: DeploymentState} = {
  ready: "READY",
  error: "ERROR",
  building: "BUILDING",
  queued: "QUEUED",
  canceled: "CANCELED",
} as const;