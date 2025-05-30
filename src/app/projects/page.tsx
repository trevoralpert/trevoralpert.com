"use client";
import React, { useEffect, useState } from "react";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  owner: { login: string };
  readmeSummary?: string;
}

// Hand-crafted summaries for each project (max 18 words)
const customSummaries: Record<string, string> = {
  "CSV-Data-Analysis-Tool": "Upload a CSV, ask questions, and get instant AI-powered insights using GPT-4.",
  "Marketing-Tool": "Automate marketing tasks and campaigns with a simple, user-friendly tool for businesses.",
  "Vertical-Video-Comedy-Sketch--.fdx-pdf_generator-": "Generate TikTok or Instagram comedy scripts from your sample and characters, then export as editable Final Draft or PDF.",
  "AI-Powered-HR-Assistant": "Chatbot that intakes your company's HR Policy Handbook and answers questions to automate HR support tasks.",
  "Resume-Screening-Assistant": "Screen resumes and rank candidates using AI to streamline your hiring process.",
  "Youtube-Scipt-Writing-tool": "Generate YouTube video scripts with AI. Input your topic and get a ready-to-use script."
};

// User-friendly project titles
const customTitles: Record<string, string> = {
  "Vertical-Video-Comedy-Sketch--.fdx-pdf_generator-": "Tik-Tok/Reels Script Generator",
  "Youtube-Scipt-Writing-tool": "Youtube Script Writing Tool"
};

function formatTitle(repoName: string): string {
  if (customTitles[repoName]) return customTitles[repoName];
  // Replace hyphens/underscores with spaces, capitalize each word
  return repoName
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function summarizeReadme(text: string, repoName?: string): string {
  // Use custom summary if available
  if (repoName && customSummaries[repoName]) {
    return customSummaries[repoName];
  }
  // Remove markdown, collapse whitespace
  let plain = text.replace(/[#*_`>\[\]\(\)!\-]/g, "").replace(/\s+/g, " ").trim();
  // Explicitly remove unwanted phrases from the start
  const unwantedStarts = [
    "VerticalVideoComedySketch.fdxpdfgenerator",
    "Nestlé HR Assistant Chatbot Overview",
    "Resume Screening Assistance App",
    "YouTube Script Writing Tool 🎥",
    "CSV Query Analysis App",
    "Marketing Tool 📢 Overview The Marketing Tool is"
  ];
  for (const phrase of unwantedStarts) {
    if (plain.startsWith(phrase)) {
      plain = plain.slice(phrase.length).trim();
    }
  }
  // Fix spacing issues (ensure single spaces between words)
  plain = plain.replace(/ +/g, " ").trim();
  // Shorten to 18 words max, no ellipsis
  const words = plain.split(" ").slice(0, 18);
  return words.join(" ");
}

async function fetchReadmeSummary(owner: string, repo: string): Promise<string> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: { Accept: "application/vnd.github.v3.raw" },
    });
    if (!res.ok) return "";
    const text = await res.text();
    // Summarize to under 30 words, removing title restatement
    return summarizeReadme(text, repo);
  } catch {
    return "";
  }
}

// Helper to filter out the personal README repo
function isPersonalReadmeRepo(repo: Repo) {
  return repo.name.toLowerCase().includes("readme") && repo.owner.login === "trevoralpert";
}

export default function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReposAndReadmes() {
      try {
        // Fetch starred repos
        const res = await fetch("https://api.github.com/users/trevoralpert/starred?per_page=10");
        if (!res.ok) throw new Error("Failed to fetch starred repos");
        let data: Repo[] = await res.json();
        // Remove the personal README repo if present
        data = data.filter((repo) => !isPersonalReadmeRepo(repo));
        // Always add the CSV Data Analysis Tool repo
        const csvRepoRes = await fetch("https://api.github.com/repos/trevoralpert/CSV-Data-Analysis-Tool");
        const csvRepo: Repo = await csvRepoRes.json();
        // Avoid duplicates
        if (!data.some((repo) => repo.owner.login === "trevoralpert" && repo.name === "CSV-Data-Analysis-Tool")) {
          data.unshift(csvRepo);
        }
        // Limit to 6
        data = data.slice(0, 6);
        // Fetch README summaries in parallel
        const withReadmes = await Promise.all(
          data.map(async (repo) => ({
            ...repo,
            readmeSummary: await fetchReadmeSummary(repo.owner.login, repo.name),
          }))
        );
        setRepos(withReadmes);
        setLoading(false);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setLoading(false);
      }
    }
    fetchReposAndReadmes();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center gap-8">
      <h1 className="text-3xl font-bold mb-4">Projects & Apps</h1>
      <p className="max-w-xl text-lg text-gray-100 dark:text-gray-100 mb-8">
        Here you&apos;ll find a collection of my interactive apps and projects. Each one tells a part of my story and showcases my journey from TV to AI.
      </p>
      {loading && <p>Loading starred repositories...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {repos.map((repo) => (
          <div key={repo.id} className="rounded-lg border p-6 bg-white dark:bg-gray-900 shadow text-left">
            <h2 className="text-xl font-semibold mb-2">{formatTitle(repo.name)}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {repo.readmeSummary || repo.description || "No description provided."}
            </p>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              View on GitHub
            </a>
            {/* Add link to embedded app if this is the Tik-Tok/Reels Script Generator */}
            {repo.name === "Vertical-Video-Comedy-Sketch--.fdx-pdf_generator-" && (
              <div className="mt-2">
                <a
                  href="/flyio-app"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Open Tik-Tok/Reels Script Generator App
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
} 