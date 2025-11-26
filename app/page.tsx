import { Book } from "@/components/Book";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center gap-10 px-6 py-16 sm:px-10">
        <Book />
      </main>
    </div>
  );
}
