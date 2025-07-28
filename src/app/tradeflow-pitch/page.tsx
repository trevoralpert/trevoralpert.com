import React from "react";

export default function TradeFlowPitch() {
  return (
    <main className="w-full min-h-screen p-0 m-0 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            TradeFlow AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Advanced Trading Platform - Pitch Deck
          </p>
          <div className="mt-4 flex justify-center">
            <a
              href="/projects"
              className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors"
            >
              ← Back to Projects
            </a>
          </div>
        </div>
        
        <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div 
            className="relative w-full"
            style={{ paddingBottom: "56.25%" }} // 16:9 aspect ratio
          >
            <iframe
              src="https://docs.google.com/presentation/d/1NllK48niln0D-ASrWC82_SYy362wuMv0ZQD-wUkEK1M/embed?start=false&loop=false&delayms=5000"
              className="absolute top-0 left-0 w-full h-full border-0"
              title="TradeFlow AI Pitch Deck"
              allowFullScreen
            />
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Use the navigation arrows in the presentation or keyboard arrow keys to navigate slides
          </p>
        </div>
      </div>
    </main>
  );
} 