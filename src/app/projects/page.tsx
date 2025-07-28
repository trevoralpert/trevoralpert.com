"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

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
  "FutureFund": "FutureFund (Desktop)",
  "mobile": "TradeFlow (Mobile)", 
  "Vertical-Video-Comedy-Sketch--.fdx-pdf_generator-": "TikTok/Reels Script Generator",
  "SnapCraft": "SnapCraft (Mobile)",
  "Face_Timeline": "Face Timeline",
  "Resume-Cover-Letter-Job-Placement-Score-Generator": "Resume/Cover Letter/Job Placement Score Generator",
  "Resume-Screening-Assistant": "Resume Screening Assistant",
  "Youtube-Scipt-Writing-tool": "Youtube Script Writing Tool"
};

// Background images for active projects
const projectBackgrounds: Record<string, string> = {
  "Chess-Evolution": "/project-images/evochess.png",
  "mobile": "/project-images/tradeflow.png",
  "Vertical-Video-Comedy-Sketch--.fdx-pdf_generator-": "/project-images/tiktok-reels-generator.png",
  "SnapCraft": "/project-images/snapcraft.png"
};

// Demo video links for projects
const demoLinks: Record<string, { video?: string; pitchDeck?: string }> = {
  "Chess-Evolution": {
    video: "https://www.loom.com/share/dc4e01dfa5c14d17935cf4bad60a47d5"
  },
  "mobile": {
    video: "https://www.loom.com/share/9a288b7e04b044c7b10992222d273ffb",
    pitchDeck: "/tradeflow-pitch"
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
        const res = await fetch("https://api.github.com/users/trevoralpert/starred?per_page=50");
        if (!res.ok) throw new Error("Failed to fetch starred repos");
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

  const ProjectCard = ({ repo, isComingSoon }: { repo: Repo; isComingSoon: boolean }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const hasBackgroundImage = !isComingSoon && projectBackgrounds[repo.name];



    // Coming Soon projects keep the original card style
    if (isComingSoon) {
      return (
        <div className="rounded-lg border p-6 shadow text-left bg-white dark:bg-gray-900">
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
        <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">
          {repo.readmeSummary || repo.description || "No description provided."}
        </p>
        
        <div className="flex flex-col gap-2">
          <a 
            href={repo.html_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline font-semibold"
          >
            View on GitHub
          </a>
          
          {/* Demo video link */}
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
          
          {/* Pitch deck link for TradeFlow */}
          {!isComingSoon && demoLinks[repo.name]?.pitchDeck && (
            <a
              href={demoLinks[repo.name].pitchDeck}
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm font-bold"
            >
              📊 Pitch Deck
            </a>
          )}
          
          {/* App deployment links */}
          {getAppLink(repo.name) && (
            <a
              href={getAppLink(repo.name)!}
              {...(isExternalLink(repo.name) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-bold"
            >
              {isComingSoon 
                ? '🚀 Demo Deployment'
                : (isExternalLink(repo.name) ? 'Play EvoChess' : `Open ${formatTitle(repo.name)} App`)
              }
            </a>
          )}
        </div>
      </div>
      );
    }

    // Active projects with background images
    return (
      <div 
        className="relative rounded-lg overflow-hidden shadow-lg h-64 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Image */}
        {hasBackgroundImage && (
          <div className="absolute inset-0">
            <Image
              src={projectBackgrounds[repo.name]}
              alt={formatTitle(repo.name)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              onError={() => setImageLoaded(false)}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        )}
        
        {/* Fallback background for TradeFlow if image fails or hasn't loaded yet */}
        {!isComingSoon && repo.name === "mobile" && (!hasBackgroundImage || !imageLoaded) && (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <div className="text-8xl">📱</div>
          </div>
        )}
        
        {/* Title Overlay (Always Visible) */}
        <div className="absolute top-4 left-4 right-4 z-20">
          <h2 className="text-2xl font-bold text-white" style={{
            textShadow: '3px 3px 6px rgba(0,0,0,0.9), -1px -1px 3px rgba(0,0,0,0.9), 1px -1px 3px rgba(0,0,0,0.9), -1px 1px 3px rgba(0,0,0,0.9), 0px 0px 6px rgba(0,0,0,0.8)'
          }}>
            {formatTitle(repo.name)}
          </h2>
        </div>
        
        {/* Content that appears on hover - positioned below title */}
        <div className={`absolute left-4 right-4 z-10 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} style={{ top: '80px', bottom: '16px' }}>
          <div className="bg-black bg-opacity-20 rounded-lg p-4 space-y-2 drop-shadow-lg h-full flex flex-col justify-center">
            <p className="text-white font-medium leading-relaxed">
              {repo.readmeSummary || repo.description || "No description provided."}
            </p>
            
            <div className="flex flex-col gap-2">
              <a 
                href={repo.html_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-300 hover:text-blue-100 underline font-semibold"
              >
                View on GitHub
              </a>
              
              {/* Demo video link */}
              {demoLinks[repo.name]?.video && (
                <a
                  href={demoLinks[repo.name].video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-bold drop-shadow-md"
                >
                  🎥 Watch Demo
                </a>
              )}
              
              {/* Pitch deck link for TradeFlow */}
              {demoLinks[repo.name]?.pitchDeck && (
                <a
                  href={demoLinks[repo.name].pitchDeck}
                  className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm font-bold drop-shadow-md"
                >
                  📊 Pitch Deck
                </a>
              )}
              
              {/* App deployment links */}
              {getAppLink(repo.name) && (
                <a
                  href={getAppLink(repo.name)!}
                  {...(isExternalLink(repo.name) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-bold drop-shadow-md"
                >
                  {isExternalLink(repo.name) ? 'Play EvoChess' : `Open ${formatTitle(repo.name)} App`}
                </a>
              )}
            </div>
          </div>
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
          <div className="w-full max-w-6xl">
            <h2 className="text-2xl font-bold mb-6 text-left">Active Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {activeRepos.map((repo) => (
                <ProjectCard key={repo.id} repo={repo} isComingSoon={false} />
              ))}
            </div>
          </div>
        )}
      
              {/* Coming Soon Section */}
        {!loading && comingSoonRepos.length > 0 && (
          <div className="w-full max-w-6xl">
            <h2 className="text-2xl font-bold mb-6 text-left">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comingSoonRepos.map((repo) => (
                <ProjectCard key={repo.id} repo={repo} isComingSoon={true} />
              ))}
            </div>
          </div>
        )}
    </main>
  );
} 