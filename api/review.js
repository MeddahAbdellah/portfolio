const referencesPath = "public/references.json";
const githubToken = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_REPO_OWNER;
const repo = process.env.REPO_NAME;

const history = {};

const simpleRateLimit = (ip, timeout = 60 * 1000) => {
  if (history[ip] > Date.now() - timeout) {
    throw new Error("Rate Limit Exceeded");
  }
  history[ip] = Date.now();
};

function randomString() {
  return Math.random().toString(36).substring(7);
}

function enableCors(request, response, allowedDomains) {
  response.setHeader("Access-Control-Allow-Credentials", true);
  const origin = request.headers.origin;

  if (
    origin &&
    allowedDomains.some((allowedDomain) => origin.endsWith(allowedDomain))
  ) {
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

function toValidationError(payload) {
  if (!payload.name) {
    return { error: "Name is required" };
  }

  if (!payload.review) {
    return { error: "Review is required" };
  }

  if (!payload.jobTitle) {
    return { error: "jobTitle is required" };
  }

  if (!payload.profilePic) {
    return { error: "profilePic is required" };
  }

  return undefined;
}

async function getLatestCommitSha() {
  return fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`,
    {
      headers: {
        Authorization: `token ${githubToken}`,
      },
    },
  )
    .then((response) => response.json())
    .then((data) => data.object.sha);
}

async function createNewBranch(branch, latestCommitSha) {
  return fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
    method: "POST",
    headers: {
      Authorization: `token ${githubToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ref: `refs/heads/${branch}`,
      sha: latestCommitSha,
    }),
  }).then((response) => response.json());
}

function toContentAndSha() {
  return async (data) => {
    if (data.content) {
      const decodedContent = Buffer.from(data.content, "base64").toString();
      return Promise.resolve({
        currentReferences: JSON.parse(decodedContent),
        currentReferencesSha: data.sha,
      });
    }

    if (data.download_url) {
      return fetch(data.download_url)
        .then((response) => response.json())
        .then((references) => {
          if (references) {
            return {
              currentReferences: references,
              currentReferencesSha: data.sha,
            };
          }
          return [];
        });
    }
    return Promise.resolve([]);
  };
}

async function getReferencesAndSha() {
  return fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${referencesPath}?ref=main`,
    {
      headers: {
        Authorization: `token ${githubToken}`,
      },
    },
  )
    .then((response) => response.json())
    .then(toContentAndSha());
}

function toUpdatedRefrences(currentReferences, payload) {
  const { name, review, jobTitle, profilePic } = payload;
  let userReference = currentReferences.find(
    (reference) => reference.name === name,
  );

  if (userReference) {
    userReference = {
      ...userReference,
      review,
      jobTitle,
      profilePic,
    };
  } else {
    userReference = {
      name,
      review,
      jobTitle,
      profilePic,
    };
  }

  return [
    ...currentReferences.filter((reference) => reference.name !== name),
    userReference,
  ];
}

async function syncUpdate(
  branch,
  commitMessage,
  currentReferencesSha,
  updatedContent,
) {
  return fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${referencesPath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: updatedContent,
        sha: currentReferencesSha,
        branch,
      }),
    },
  ).then((response) => response.json());
}

async function createPullRequest(branch, commitMessage) {
  return fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
    method: "POST",
    headers: {
      Authorization: `token ${githubToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: commitMessage,
      head: branch,
      base: "main",
    }),
  }).then((response) => response.json());
}

export default async function handler(request, response) {
  enableCors(request, response, ["stackblitz.io", "codesandbox.io"]);

  if (request.method === "OPTIONS") {
    response.status(200).end();
    return;
  }

  try {
    simpleRateLimit(request.headers["x-real-ip"], 10 * 60 * 1000);
  } catch (error) {
    return response.status(429).end();
  }

  const error = toValidationError(request.body);
  if (error) {
    return response.status(400).json(error);
  }

  const { name } = request.body;

  const latestCommitSha = await getLatestCommitSha();

  const branch = `${name.toLowerCase().replace(/[^a-z]/g, "")}-reference-${randomString()}`;
  await createNewBranch(branch, latestCommitSha);

  const { currentReferences, currentReferencesSha } =
    await getReferencesAndSha();

  const updatedReferences = toUpdatedRefrences(currentReferences, request.body);

  const updatedContent = Buffer.from(
    JSON.stringify(updatedReferences),
  ).toString("base64");

  const commitMessage = `👌 Adding new reference from ${name}`;
  await syncUpdate(branch, commitMessage, currentReferencesSha, updatedContent);

  const pr = await createPullRequest(branch, commitMessage);

  response.json({ success: !!pr.html_url, prUrl: pr.html_url });
}
