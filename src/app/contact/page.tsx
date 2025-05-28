export default function Contact() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center gap-8">
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <p className="max-w-xl text-lg text-gray-700 dark:text-gray-300 mb-8">
        Interested in collaborating, have questions, or just want to connect? Reach out to me!
      </p>
      <a href="mailto:trevoralpert1@gmail.com" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors">
        Email Me
      </a>
      <div className="flex gap-6 mt-8 justify-center">
        <a href="https://www.linkedin.com/in/trevoralpert/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
          <img src="/linkedin.svg" alt="LinkedIn" className="w-8 h-8" />
        </a>
        <a href="https://github.com/trevoralpert" target="_blank" rel="noopener noreferrer" title="GitHub">
          <img src="/github.svg" alt="GitHub" className="w-8 h-8" />
        </a>
        <a href="https://www.instagram.com/trevor.alpert/" target="_blank" rel="noopener noreferrer" title="Instagram">
          <img src="/instagram.svg" alt="Instagram" className="w-8 h-8" />
        </a>
      </div>
    </main>
  );
} 