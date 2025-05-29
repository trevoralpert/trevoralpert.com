import React from 'react';
import Image from 'next/image';
import { timeline, TimelineEntry, finalTimelineText, finalTimelineImage } from '../../data/timeline';

const Timeline: React.FC = () => {
  return (
    <section className="w-full max-w-4xl mx-auto py-12">
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
            <p className="text-lg text-gray-800 dark:text-gray-200 text-center md:text-left whitespace-pre-line">
              {entry.caption}
            </p>
          </div>
        </div>
      ))}
      <div className="w-full flex flex-col items-center mt-16 gap-6">
        <Image
          src={finalTimelineImage}
          alt="Final timeline highlight"
          className="rounded-lg shadow-lg max-h-96 object-contain"
          width={600}
          height={400}
          unoptimized
        />
        <p className="max-w-2xl text-xl text-gray-800 dark:text-gray-200 text-center font-medium whitespace-pre-line">
          {finalTimelineText}
        </p>
      </div>
    </section>
  );
};

export default Timeline; 