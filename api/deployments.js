const vercelToken = "jeCps8a9G7XuvKkPesjAIAAP";
const projectId = "prj_p06H9MCgjZGJUx0tAEipovMeRgS6";

function enableCors(request, response, allowedDomain) {
  response.setHeader("Access-Control-Allow-Credentials", true);
  const origin = request.headers.origin;

  if (origin && origin.endsWith(allowedDomain)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
  }

  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );
}

function toPortfolioDeployments() {
  return ({ deployments }) => {
    return deployments
      .map((deployment) => ({
        uid: deployment.uid,
        preview: deployment.url,
        branch: deployment.meta.githubCommitRef,
        sha: deployment.meta.githubCommitSha,
        commit: deployment.meta.githubCommitMessage,
        state: deployment.state,
      }))
      .filter((deployment) => deployment.branch !== "main");
  };
}

async function getVercelDeployments() {
  return fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(toPortfolioDeployments());
}

export default async function handler(request, response) {
  enableCors(request, response, "stackblitz.io");

  if (request.method === "OPTIONS") {
    response.status(200).end();
    return;
  }

  const deployments = await getVercelDeployments();

  response.json({ deployments });
}
