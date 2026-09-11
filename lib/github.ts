import type { GithubMetadata } from "@/features/projects/types/project";

const GITHUB_HOST = "github.com";
const API_BASE = "https://api.github.com";

export function parseGithubRepositoryUrl(value: string): {
  owner: string;
  repository: string;
} | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== GITHUB_HOST) return null;

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length !== 2) return null;

    const repository = parts[1].replace(/\.git$/i, "");
    if (!/^[A-Za-z0-9_.-]+$/.test(parts[0]) || !/^[A-Za-z0-9_.-]+$/.test(repository)) {
      return null;
    }

    return { owner: parts[0], repository };
  } catch {
    return null;
  }
}

async function githubRequest<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "devfolio-github-sync",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

type RepositoryResponse = {
  name: string;
  default_branch: string;
  description: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
};

type ReadmeResponse = {
  content?: string;
  encoding?: string;
};

export type GithubImportData = {
  title: string;
  summary: string;
  fullDescription: string;
  features: string[];
  githubUrl: string;
  githubMetadata: GithubMetadata;
};

function decodeReadme(readme: ReadmeResponse): string {
  if (!readme.content || readme.encoding !== "base64") return "";
  return Buffer.from(readme.content.replace(/\s/g, ""), "base64")
    .toString("utf8")
    .trim()
    .slice(0, 20000);
}

export async function fetchGithubMetadata(
  githubUrl: string,
): Promise<GithubMetadata> {
  const repository = parseGithubRepositoryUrl(githubUrl);
  if (!repository) throw new Error("Only public github.com repository URLs are supported.");

  const path = `/repos/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.repository)}`;
  const [details, languages] = await Promise.all([
    githubRequest<RepositoryResponse>(path),
    githubRequest<Record<string, number>>(`${path}/languages`),
  ]);

  return {
    owner: repository.owner,
    repository: repository.repository,
    defaultBranch: details.default_branch,
    description: details.description ?? undefined,
    language: details.language ?? undefined,
    topics: (details.topics ?? []).slice(0, 20),
    stars: details.stargazers_count,
    forks: details.forks_count,
    languages: Object.entries(languages)
      .sort(([, firstBytes], [, secondBytes]) => secondBytes - firstBytes)
      .slice(0, 20)
      .map(([name, bytes]) => ({ name, bytes })),
    lastSyncedAt: new Date().toISOString(),
  };
}

export async function fetchGithubImport(
  githubUrl: string,
): Promise<GithubImportData> {
  const repository = parseGithubRepositoryUrl(githubUrl);
  if (!repository) throw new Error("Only public github.com repository URLs are supported.");

  const path = `/repos/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.repository)}`;
  const [details, languages, readme] = await Promise.all([
    githubRequest<RepositoryResponse>(path),
    githubRequest<Record<string, number>>(`${path}/languages`),
    githubRequest<ReadmeResponse>(`${path}/readme`).catch(() => ({})),
  ]);
  const metadata = {
    owner: repository.owner,
    repository: repository.repository,
    defaultBranch: details.default_branch,
    description: details.description ?? undefined,
    language: details.language ?? undefined,
    topics: (details.topics ?? []).slice(0, 20),
    stars: details.stargazers_count,
    forks: details.forks_count,
    languages: Object.entries(languages)
      .sort(([, firstBytes], [, secondBytes]) => secondBytes - firstBytes)
      .slice(0, 20)
      .map(([name, bytes]) => ({ name, bytes })),
    lastSyncedAt: new Date().toISOString(),
  } satisfies GithubMetadata;
  const readmeText = decodeReadme(readme);

  return {
    title: details.name,
    summary: details.description ?? `Imported from ${repository.owner}/${repository.repository}.`,
    fullDescription:
      readmeText ||
      details.description ||
      `Imported from ${repository.owner}/${repository.repository}.`,
    features: metadata.topics,
    githubUrl: `https://github.com/${repository.owner}/${repository.repository}`,
    githubMetadata: metadata,
  };
}