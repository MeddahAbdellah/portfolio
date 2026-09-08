# Meddah Abdallah — AI portfolio

An AI portfolio that lets a recruiter interview Abdallah about his professional experience, engineering decisions, leadership, and technical work. Repository activity supplements the CV context with current implementation examples.

## Run locally

```sh
npm install
OPENAI_API_KEY=... npm run dev
```

## Vercel environment variables

- `OPENAI_API_KEY` — required; used only by the server-side chat function.
- `OPENAI_MODEL` — optional; defaults to `gpt-5.6-sol` for stronger repository analysis and interview answers.
- `GITHUB_REPO_OWNER` — optional; defaults to `MeddahAbdellah`.
- `GITHUB_TOKEN` — optional but recommended. Use a fine-grained token with read-only Contents and Metadata access to every public and private repository that should inform answers, and no write permissions.

Never prefix secrets with `PUBLIC_`. Redeploy after changing Vercel environment variables.

If an earlier deployment has `OPENAI_MODEL=gpt-5.6`, the API automatically maps that product name to the valid `gpt-5.6-sol` model ID. Updating the Vercel value is still recommended.

`GITHUB_TOKEN` may be pasted as the raw token or with a `Bearer`/`token` prefix. If it is expired or lacks access, the server automatically retries public GitHub requests without it. Removing a stale token from Vercel is recommended.

After updating the token in Vercel, redeploy the project so new serverless instances receive it; an existing GitHub context snapshot can remain cached for up to ten minutes.

## How repository knowledge works

With `GITHUB_TOKEN`, `api/github-context.js` calls GitHub's authenticated-user repository endpoint so accessible private repositories are included. Without a token it falls back to the public user endpoint. It excludes forks, archived repositories, and repositories not owned by `GITHUB_REPO_OWNER`, then inspects the eight most recently pushed repositories. Results are cached in each warm serverless instance for ten minutes to reduce GitHub API usage.

For every selected repository the context includes:

- Repository description, topics, activity dates, stars, and links
- Language byte counts
- The four latest commit summaries and dates
- Up to 8,000 characters from the README
- Up to 8,000 characters from `package.json`, when present

Repository text is treated as untrusted data by the system prompt. Answers must distinguish direct evidence from inference and must not claim that repository activity proves expertise, sole authorship, employment history, or business impact.
Private repository evidence is restricted to anonymized, high-level technical insights; answers must not expose private names, links, content, commit messages, organizations, collaborators, or identifying project details.

## Debugging

Browser lifecycle, response status, diagnostic stage/code, request ID, and React errors are logged as expanded JSON text with the `[AskAbdallah]` prefix. Questions and answers are deliberately not logged. The same request ID appears in Vercel function logs under `[AskAbdallah API]`, making it possible to correlate a browser failure with its server-side GitHub or OpenAI stage. Error responses use `Cache-Control: no-store` so Vercel does not preserve a stale failure.

The application does not impose its own character or conversation-history limits on chat messages. The complete conversation is sent on each turn, up to the request and context limits enforced by Vercel and the configured OpenAI model.

## Checks

```sh
npm run build
```
