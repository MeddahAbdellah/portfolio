export default async function handler(request, response) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  const allowedDomain = "stackblitz.io";
  const origin = req.headers.origin;

  if (origin && origin.endsWith(allowedDomain)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { name, review, linkedin } = request.body;
  if (!name || !review || !linkedin) {
    return response.status(400).json({ error: "Please fill all the fields" });
  }
  const filePath = `reviews/${name.replace(/\s+/g, "-").toLowerCase()}.md`;
  const fileContent = `---
name: ${name}
linkedin: ${linkedin}
---
${review}`;

  const githubToken = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.REPO_NAME;
  const path = filePath;

  const branch = `${name.toLowerCase().replace(/[^a-z]/g, "")}-review-branch`; // Unique branch name for each PR
  const commitMessage = `Adding new review for ${name}`;

  // Fetch the SHA of the latest commit on the main branch
  const getLatestCommitSha = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`,
    {
      headers: {
        Authorization: `token ${githubToken}`,
      },
    },
  )
    .then((response) => response.json())
    .then((data) => data.object.sha);

  console.log({ getLatestCommitSha });

  // Create a new branch
  const createNewBranch = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/refs`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ref: `refs/heads/${branch}`,
        sha: getLatestCommitSha,
      }),
    },
  ).then((response) => response.json());

  console.log({ createNewBranch });

  // Create a new file on the new branch
  const createNewFile = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?branch=${branch}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: Buffer.from(fileContent).toString("base64"),
        branch,
      }),
    },
  ).then((response) => response.json());

  console.log({ createNewFile });

  // Create a pull request
  const prResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: commitMessage,
        head: branch,
        base: "main",
        body: `Review submission by ${name}`,
      }),
    },
  );

  const prData = await prResponse.json();

  response.json({ success: true, prUrl: prData.html_url });
}
