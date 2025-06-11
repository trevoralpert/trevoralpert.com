import React from "react";

export default function FaceTimelineApp() {
  return (
    <main className="w-full min-h-screen p-0 m-0 bg-white">
      <h1 className="text-3xl font-bold mb-4 text-center pt-8">Face Timeline</h1>
      <div
        className="w-full"
        style={{ height: "calc(100vh - 80px)", maxHeight: "calc(100vh - 80px)" }}
      >
        <iframe
          src="https://face-timeline.fly.dev/"
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          title="Face Timeline App"
          allowFullScreen
        />
      </div>
    </main>
  );
} 