# Ask Meddah

An AI portfolio that lets a recruiter interview Meddah Abdallah's public GitHub work. On each conversation, the server gathers current public repository metadata, READMEs, package manifests, language statistics, and recent commits, then asks OpenAI to answer strictly from that evidence.

## Run locally

```sh
npm install
OPENAI_API_KEY=... npm run dev
```

## Vercel environment variables

- `OPENAI_API_KEY` — required; used only by the server-side chat function.
- `OPENAI_MODEL` — optional; defaults to `gpt-5.6-sol` for stronger repository analysis and interview answers.
- `GITHUB_REPO_OWNER` — optional; defaults to `MeddahAbdellah`.
- `GITHUB_TOKEN` — optional but recommended to increase GitHub API limits. Use a fine-grained token with **read-only access to public repositories** and no account or write permissions.

Never prefix secrets with `PUBLIC_`. Redeploy after changing Vercel environment variables.

## How repository knowledge works

`api/github-context.js` calls GitHub's public user and repository endpoints. It intentionally excludes private repositories, forks, and archived repositories, then inspects the eight most recently pushed owned repositories. Results are cached in each warm serverless instance for ten minutes to reduce GitHub API usage.

For every selected repository the context includes:

- Repository description, topics, activity dates, stars, and links
- Language byte counts
- The four latest commit summaries and dates
- Up to 8,000 characters from the README
- Up to 8,000 characters from `package.json`, when present

Repository text is treated as untrusted data by the system prompt. Answers must distinguish direct evidence from inference and must not claim that repository activity proves expertise, sole authorship, employment history, or business impact.

## Checks

```sh
npm run build
```
