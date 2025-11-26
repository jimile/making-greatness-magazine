import { Book } from "@/components/Book";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center gap-10 px-6 py-16 sm:px-10">
        <header className="flex w-full flex-col items-center gap-2 text-center sm:items-start sm:text-left">
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
            helmet made
          </p>
          <h1 className="text-4xl font-semibold text-zinc-900 sm:text-5xl">
            Interactive 2D book gallery
          </h1>
          <p className="max-w-3xl text-base text-zinc-600 sm:text-lg">
            Tap the cover to open, then flip through blank spreads. The crease,
            edge shadows, and page turn are all CSS-ready for you to drop in
            real imagery.
          </p>
        </header>
        <Book />
      </main>
    </div>
  );
}
