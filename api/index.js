export default async function handler(request, response) {
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

  const githubToken = process.env.YOUR_GITHUB_TOKEN;
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

  // Create a new branch
  await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
    method: "POST",
    headers: {
      Authorization: `token ${githubToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ref: `refs/heads/${branch}`,
      sha: getLatestCommitSha,
    }),
  });

  // Create a new file on the new branch
  await fetch(
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
  );

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

  res.json({ success: true, prUrl: prData.html_url });
}
