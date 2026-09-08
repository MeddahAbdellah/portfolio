const GITHUB_API = "https://api.github.com";
const CACHE_TTL = 10 * 60 * 1000;
const MAX_REPOS = 8;
const MAX_FILE_CHARACTERS = 8_000;

let cache;
let pendingContext;

function githubToken() {
  return process.env.GITHUB_TOKEN?.trim().replace(/^(?:Bearer|token)\s+/i, "");
}

function headers(authenticated = true) {
  const token = githubToken();
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "meddah-interviewer-portfolio",
    ...(authenticated && token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function github(path) {
  const request = (authenticated) => fetch(`${GITHUB_API}${path}`, {
    headers: headers(authenticated),
    signal: AbortSignal.timeout(12_000),
  });

  let response = await request(true);
  // An expired token, a token copied with its auth scheme, or insufficient token
  // permissions must not prevent access to data that is public anyway.
  if ((response.status === 401 || response.status === 403) && githubToken()) {
    response = await request(false);
  }
  if (!response.ok) {
    const remaining = response.headers.get("x-ratelimit-remaining");
    const reset = response.headers.get("x-ratelimit-reset");
    throw new Error(`GitHub ${path} returned ${response.status} (remaining=${remaining ?? "unknown"}, reset=${reset ?? "unknown"})`);
  }
  return response.json();
}

function decode(content = "") {
  return Buffer.from(content.replace(/\n/g, ""), "base64").toString("utf8");
}

async function repositoryContext(repo) {
  const base = `/repos/${encodeURIComponent(repo.owner.login)}/${encodeURIComponent(repo.name)}`;
  const [commits, languages, readme, manifest] = await Promise.allSettled([
    github(`${base}/commits?per_page=4`),
    github(`${base}/languages`),
    github(`${base}/readme`),
    github(`${base}/contents/package.json`),
  ]);

  const recentCommits = commits.status === "fulfilled"
    ? commits.value.map((commit) => ({
        date: commit.commit?.author?.date,
        message: commit.commit?.message?.split("\n")[0],
        url: commit.html_url,
      }))
    : [];

  return {
    name: repo.name,
    url: repo.html_url,
    description: repo.description,
    homepage: repo.homepage,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    primaryLanguage: repo.language,
    topics: repo.topics || [],
    languages: languages.status === "fulfilled" ? languages.value : {},
    latestCommits: recentCommits,
    readme: readme.status === "fulfilled" ? decode(readme.value.content).slice(0, MAX_FILE_CHARACTERS) : null,
    packageManifest: manifest.status === "fulfilled" ? decode(manifest.value.content).slice(0, MAX_FILE_CHARACTERS) : null,
  };
}

export async function getGitHubContext() {
  if (cache && cache.expiresAt > Date.now()) return cache.value;

  if (pendingContext) return pendingContext;
  pendingContext = refreshGitHubContext();
  try {
    return await pendingContext;
  } catch (error) {
    // A stale snapshot is preferable to making the whole interview unavailable
    // during a temporary GitHub incident or rate-limit window.
    if (cache?.value) return cache.value;
    throw error;
  } finally {
    pendingContext = undefined;
  }
}

async function refreshGitHubContext() {
  const owner = process.env.GITHUB_REPO_OWNER || "MeddahAbdellah";
  const [profileResult, repositoriesResult] = await Promise.allSettled([
    github(`/users/${encodeURIComponent(owner)}`),
    github(`/users/${encodeURIComponent(owner)}/repos?per_page=100&sort=pushed&direction=desc&type=owner`),
  ]);

  if (repositoriesResult.status === "rejected") throw repositoriesResult.reason;
  if (profileResult.status === "rejected") {
    console.error("GitHub profile request failed; continuing with repositories:", profileResult.reason);
  }

  const profile = profileResult.status === "fulfilled" ? profileResult.value : {};
  const repositories = repositoriesResult.value;

  // The public users endpoint intentionally excludes private repositories, even
  // when GITHUB_TOKEN is configured. Forks are excluded to avoid attributing
  // somebody else's code to Meddah.
  const ownedPublicRepos = repositories
    .filter((repo) => !repo.private && !repo.fork && !repo.archived)
    .slice(0, MAX_REPOS);

  const value = {
    fetchedAt: new Date().toISOString(),
    profile: {
      login: profile.login,
      name: profile.name,
      bio: profile.bio,
      company: profile.company,
      location: profile.location,
      blog: profile.blog,
      url: profile.html_url,
      publicRepos: profile.public_repos,
    },
    repositories: await Promise.all(ownedPublicRepos.map(repositoryContext)),
  };

  cache = { value, expiresAt: Date.now() + CACHE_TTL };
  return value;
}
