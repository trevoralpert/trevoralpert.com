"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { timeline, TimelineEntry, finalTimelineText, finalTimelineImage } from '../../data/timeline';

const Timeline: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleWatchSeries = () => {
    window.open('https://ridesharewebseries.com/season-1/', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="w-full max-w-4xl mx-auto py-12"
      style={{
        '--flip-perspective': '1000px'
      } as React.CSSProperties}
    >
      {timeline.map((entry: TimelineEntry, idx: number) => (
        <div
          key={idx}
          className={`flex flex-col md:flex-row items-center mb-16 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
        >
          <div className="md:w-1/2 w-full flex flex-col items-center mb-4 md:mb-0 gap-4">
            {entry.images.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt={entry.caption.substring(0, 40) + '...'}
                className="rounded-lg shadow-lg max-h-96 object-contain"
                width={600}
                height={400}
                unoptimized
              />
            ))}
          </div>
          <div className="md:w-1/2 w-full px-4">
            <p className="text-lg text-gray-200 dark:text-gray-200 text-center md:text-left whitespace-pre-line">
              {entry.caption}
            </p>
          </div>
        </div>
      ))}
      <div className="w-full flex flex-col items-center mt-16 gap-6">
        {/* Flip Card Container */}
        <div 
          className="relative w-full max-w-[600px] h-[300px] md:h-[400px]"
          style={{ perspective: '1000px' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className="relative w-full h-full transition-transform duration-700"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front Face - Image */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="relative w-full h-full group">
                <Image
                  src={finalTimelineImage}
                  alt="Rideshare Web Series"
                  className="rounded-lg shadow-lg w-full h-full object-contain"
                  width={600}
                  height={400}
                  unoptimized
                />
                
                {/* Hover Overlay with Buttons */}
                                 <div 
                   className={`absolute inset-0 bg-black bg-opacity-50 rounded-lg flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 transition-opacity duration-300 ${
                     isHovered ? 'opacity-100' : 'opacity-0'
                   }`}
                 >
                   <button
                     onClick={handleWatchSeries}
                     className="px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors duration-200 shadow-lg text-sm md:text-base"
                   >
                     🎬 Watch Web Series
                   </button>
                   <button
                     onClick={handleFlip}
                     className="px-4 md:px-6 py-2 md:py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors duration-200 shadow-lg text-sm md:text-base"
                   >
                     ▶️ Watch Trailer
                   </button>
                 </div>
              </div>
            </div>

            {/* Back Face - YouTube Embed */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/XlJT2uZJzeM"
                  title="Rideshare Web Series Trailer"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                
                {/* Back Button */}
                <button
                  onClick={handleFlip}
                  className="absolute top-4 right-4 px-4 py-2 bg-gray-800 bg-opacity-80 text-white rounded-lg font-bold hover:bg-opacity-100 transition-all duration-200 shadow-lg"
                >
                  ← Back to Image
                </button>
              </div>
            </div>
          </div>
        </div>
        <p className="max-w-2xl text-xl text-gray-200 dark:text-gray-200 text-center font-medium whitespace-pre-line">
          {finalTimelineText}
        </p>
      </div>
    </section>
  );
};

export default Timeline; 