import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center gap-8">
      <Image
        src="/profile-photo.jpg"
        alt="Trevor Alpert profile photo"
        width={200}
        height={200}
        className="rounded-full border-4 border-blue-500 mb-4 object-cover"
        priority
      />
      <h1 className="text-4xl font-bold">Hi, I'm Trevor Alpert</h1>
      <p className="max-w-2xl text-lg text-gray-700 dark:text-gray-300">
        After a successful career in TV, I've transitioned my passion for storytelling and creativity into the world of Artificial Intelligence. This site is a narrative of my journey, showcasing the projects and apps that define my work and vision for the future.
      </p>
      <a
        href="/projects"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors"
      >
        Explore My Projects
      </a>
    </main>
  );
}
