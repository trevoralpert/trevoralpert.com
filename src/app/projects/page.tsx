"use client";
import React, { useEffect, useState } from "react";
import Image from 'next/image';

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  owner: { login: string };
  topics?: string[];
  readmeSummary?: string;
}

// Hand-crafted summaries for each project (max 18 words)
const customSummaries: Record<string, string> = {
  "Chess-Evolution": "Real-time multiplayer chess on a 3D globe with evolutionary piece upgrades and strategic combat.",
  "draft-assistant": "Comprehensive fantasy football draft assistant optimized for strategic draft management and player recommendations.",
  "FutureFund": "AI-powered investment platform helping users make smarter financial decisions with personalized portfolio recommendations.",
  "mobile": "Advanced trading platform with real-time market data, AI insights, and portfolio management tools.",
  "Vertical-Video-Comedy-Sketch--.fdx-pdf_generator-": "Generate TikTok or Instagram comedy scripts from your sample and characters, then export as editable Final Draft or PDF.",
  "SnapCraft": "AI-powered social media content creation tool for generating engaging posts, captions, and visual content.",
  "Face_Timeline": "Interactive timeline showcasing personal growth through facial recognition and photo chronology visualization.",
  "Resume-Cover-Letter-Job-Placement-Score-Generator": "AI-powered tool that analyzes and scores resumes, cover letters, and job placements for optimization.",
  "Resume-Screening-Assistant": "Automated resume screening system that ranks candidates using AI to streamline hiring processes.",
  "CSV-Data-Analysis-Tool": "Upload a CSV, ask questions, and get instant AI-powered insights using GPT-4.",
  "Marketing-Tool": "Automate marketing tasks and campaigns with a simple, user-friendly tool for businesses.",
  "AI-Powered-HR-Assistant": "Chatbot that intakes your company's HR Policy Handbook and answers questions to automate HR support tasks.",
  "Youtube-Scipt-Writing-tool": "Generate YouTube video scripts with AI. Input your topic and get a ready-to-use script."
};

// User-friendly project titles
const customTitles: Record<string, string> = {
  "Chess-Evolution": "EvoChess",
  "draft-assistant": "DraftGenie",
  "FutureFund": "FutureFund (Desktop)",
  "mobile": "TradeFlow (Mobile)", 
  "Vertical-Video-Comedy-Sketch--.fdx-pdf_generator-": "TikTok/Reels Script Generator",
  "SnapCraft": "SnapCraft (Mobile)",
  "Face_Timeline": "Face Timeline",
  "Resume-Cover-Letter-Job-Placement-Score-Generator": "Resume/Cover Letter/Job Placement Score Generator",
  "Resume-Screening-Assistant": "Resume Screening Assistant",
  "Youtube-Scipt-Writing-tool": "Youtube Script Writing Tool"
};

// Demo video links for projects
const demoLinks: Record<string, { video?: string; pitchDeck?: string }> = {
  "Chess-Evolution": {
    video: "https://www.loom.com/share/dc4e01dfa5c14d17935cf4bad60a47d5"
  },
  "draft-assistant": {
    video: "https://youtu.be/iOqklkh1oJE"
  },
  "mobile": {
    video: "https://www.loom.com/share/9a288b7e04b044c7b10992222d273ffb",
    pitchDeck: "https://docs.google.com/presentation/d/1NllK48niln0D-ASrWC82_SYy362wuMv0ZQD-wUkEK1M/edit?slide=id.g344ba1186e2_0_1#slide=id.g344ba1186e2_0_1"
  },
  "FutureFund": {
    video: "https://youtu.be/SPVMIpDJNLw"
  },
  "SnapCraft": {
    video: "https://youtu.be/w5h5hhxFNrA"
  }
};

// Custom ordering for projects (by repo name)
const projectOrder = {
  active: [
    "Chess-Evolution",
    "draft-assistant", // DraftGenie
    "mobile", // TradeFlow
    "Vertical-Video-Comedy-Sketch--.fdx-pdf_generator-",
    "SnapCraft"
  ],
  comingSoon: [
    "FutureFund",
    "Face_Timeline",
    "Resume-Cover-Letter-Job-Placement-Score-Generator", 
    "Resume-Screening-Assistant"
  ]
};

// Background images for active projects
const projectBackgrounds: Record<string, string> = {
  "Chess-Evolution": "/project-images/evochess.png",
  "draft-assistant": "/project-images/draftgenie.png", 
  "mobile": "/project-images/tradeflow.png",
  "Vertical-Video-Comedy-Sketch--.fdx-pdf_generator-": "/project-images/tiktok-reels-generator.png",
  "SnapCraft": "/project-images/snapcraft.png"
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
    const headers: Record<string, string> = { 
      Accept: "application/vnd.github.v3.raw" 
    };
    
    // Add authentication if token is available
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    if (token) {
      headers.Authorization = `token ${token}`;
    }
    
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers,
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

// Helper to sort repos by custom order
function sortByCustomOrder(repos: Repo[], orderArray: string[]): Repo[] {
  return repos.sort((a, b) => {
    const aIndex = orderArray.indexOf(a.name);
    const bIndex = orderArray.indexOf(b.name);
    
    // If both are in the order array, sort by their position
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    // If only one is in the order array, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    // If neither is in the order array, maintain original order
    return 0;
  });
}

export default function Projects() {
  const [activeRepos, setActiveRepos] = useState<Repo[]>([]);
  const [comingSoonRepos, setComingSoonRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReposAndReadmes() {
      try {
        // Fetch starred repos with higher limit to ensure we get all tagged ones
        const headers: Record<string, string> = {};
        
        // Add authentication if token is available
        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
        if (token) {
          headers.Authorization = `token ${token}`;
        }
        
        const res = await fetch("https://api.github.com/users/trevoralpert/starred?per_page=50", {
          headers
        });
        if (!res.ok) {
          console.error(`GitHub API Error: ${res.status} ${res.statusText}`);
          throw new Error(`Failed to fetch starred repos: ${res.status}`);
        }
        let data: Repo[] = await res.json();
        
        // Remove the personal README repo if present
        data = data.filter((repo) => !isPersonalReadmeRepo(repo));
        
        // Filter by topics
        const activeProjects = data.filter((repo) => 
          repo.topics?.includes('portfolio-active')
        );
        const comingSoonProjects = data.filter((repo) => 
          repo.topics?.includes('portfolio-coming-soon')
        );
        
        // Sort by custom order
        const sortedActive = sortByCustomOrder(activeProjects, projectOrder.active);
        const sortedComingSoon = sortByCustomOrder(comingSoonProjects, projectOrder.comingSoon);
        
        // Fetch README summaries in parallel for both groups
        const [activeWithReadmes, comingSoonWithReadmes] = await Promise.all([
          Promise.all(
            sortedActive.map(async (repo) => ({
              ...repo,
              readmeSummary: await fetchReadmeSummary(repo.owner.login, repo.name),
            }))
          ),
          Promise.all(
            sortedComingSoon.map(async (repo) => ({
              ...repo,
              readmeSummary: await fetchReadmeSummary(repo.owner.login, repo.name),
            }))
          )
        ]);
        
        setActiveRepos(activeWithReadmes);
        setComingSoonRepos(comingSoonWithReadmes);
        setLoading(false);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setLoading(false);
      }
    }
    fetchReposAndReadmes();
  }, []);

  // Helper function to get the app link for embedded projects
  const getAppLink = (repoName: string) => {
    switch (repoName) {
      case "Vertical-Video-Comedy-Sketch--.fdx-pdf_generator-":
        return "/flyio-app";
      case "Resume-Cover-Letter-Job-Placement-Score-Generator":
        return "/resume-score-app";
      case "Resume-Screening-Assistant":
        return "/resume-screening-app";
      case "Face_Timeline":
        return "/face-timeline-app";
      case "Chess-Evolution":
        return "https://chess-evolution.onrender.com"; // External link for EvoChess
      default:
        return null;
    }
  };

  // Helper function to determine if link should be external
  const isExternalLink = (repoName: string) => {
    return repoName === "Chess-Evolution";
  };

  // Project card component with background images and hover effects
  const ProjectCard: React.FC<{ repo: Repo; isComingSoon: boolean }> = ({ repo, isComingSoon }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // For active projects, use background image cards with hover effects
    if (!isComingSoon && projectBackgrounds[repo.name]) {
      return (
        <div 
          key={repo.id}
          className="relative h-64 rounded-lg overflow-hidden shadow-lg cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Image */}
          <Image
            src={projectBackgrounds[repo.name]}
            alt={formatTitle(repo.name)}
            fill
            className="object-cover"
            style={repo.name === "Chess-Evolution" ? { objectPosition: "center top" } : {}}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Fallback gradient for TradeFlow */}
          {repo.name === "mobile" && !imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <span className="text-6xl">📱</span>
            </div>
          )}
          
          {/* Title - Always Visible */}
          <div className="absolute inset-0 flex items-start p-6">
            <h2 
              className="text-2xl font-bold text-white z-10"
              style={{
                textShadow: "3px 3px 6px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)"
              }}
            >
              {formatTitle(repo.name)}
            </h2>
          </div>
          
          {/* Hover Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end transition-all duration-300">
              <div className="absolute top-20 bottom-4 left-4 right-4 bg-black bg-opacity-50 p-4 rounded-lg">
                <p className="text-white mb-4 text-sm font-bold">
                  {repo.readmeSummary || repo.description || "No description provided."}
                </p>
                
                <div className="flex flex-col gap-2">
                  <a 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-bold drop-shadow-md"
                  >
                    📱 View on GitHub
                  </a>
                  
                  {demoLinks[repo.name]?.video && (
                    <a
                      href={demoLinks[repo.name].video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-bold drop-shadow-md"
                    >
                      🎥 Watch Demo
                    </a>
                  )}
                  
                  {demoLinks[repo.name]?.pitchDeck && (
                    <a
                      href={demoLinks[repo.name].pitchDeck}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm font-bold drop-shadow-md"
                    >
                      📊 Pitch Deck
                    </a>
                  )}
                  
                  {getAppLink(repo.name) && (
                    <a
                      href={getAppLink(repo.name)!}
                      target={isExternalLink(repo.name) ? "_blank" : "_self"}
                      rel={isExternalLink(repo.name) ? "noopener noreferrer" : undefined}
                      className="inline-block px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-sm font-bold drop-shadow-md"
                    >
                      {isExternalLink(repo.name) ? 'Play EvoChess' : '🚀 Open App'}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // For coming soon projects, use standard cards
    return (
      <div key={repo.id} className="rounded-lg border p-6 shadow text-left bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-bold text-black dark:text-white">
            {formatTitle(repo.name)}
          </h2>
          {isComingSoon && (
            <span className="px-2 py-1 text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-full">
              Coming Soon
            </span>
          )}
        </div>
        
        <p className="mb-4 font-bold text-gray-800 dark:text-gray-200">
          {repo.readmeSummary || repo.description || "No description provided."}
        </p>
        
        <div className="flex flex-col gap-2">
          <a 
            href={repo.html_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline font-bold"
          >
            📱 View on GitHub
          </a>
          
          {demoLinks[repo.name]?.video && (
            <a
              href={demoLinks[repo.name].video}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-bold"
            >
              🎥 Watch Demo
            </a>
          )}
          
          {getAppLink(repo.name) && (
            <a
              href={getAppLink(repo.name)!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-sm font-bold"
            >
              🚀 Demo Deployment
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center gap-8">
      <h1 className="text-3xl font-bold mb-4">Projects & Apps</h1>
      <p className="max-w-xl text-lg text-gray-100 dark:text-gray-100 mb-8">
        Here you&apos;ll find a collection of my interactive apps and projects. Each one tells a part of my story and showcases my journey from TV to AI.
      </p>
      
      {loading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Active Projects Section */}
      {!loading && activeRepos.length > 0 && (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-left">Active Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {activeRepos.map((repo) => <ProjectCard key={repo.id} repo={repo} isComingSoon={false} />)}
          </div>
        </div>
      )}
      
      {/* Coming Soon Section */}
      {!loading && comingSoonRepos.length > 0 && (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-left">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comingSoonRepos.map((repo) => <ProjectCard key={repo.id} repo={repo} isComingSoon={true} />)}
          </div>
        </div>
      )}

    </main>
  );
} 