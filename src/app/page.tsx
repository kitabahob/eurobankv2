// src/app/page.tsx
export const metadata = {
  title: "Value Stocke",
  description: "إدارة أموالك واستثماراتك بسهولة.",
};

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <section className="max-w-3xl p-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Value Stocke — موقع التجربة
        </h1>
        <p className="mt-4 text-lg opacity-80">
          إدارة أموالك واستثماراتك بسهولة.
        </p>
        <a
          href="#get-started"
          className="inline-block mt-8 px-6 py-3 rounded-xl bg-yellow-500 text-black font-semibold"
        >
          ابدأ الآن
        </a>
      </section>
    </main>
  );
}
