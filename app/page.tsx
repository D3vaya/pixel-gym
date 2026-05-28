import Image from "next/image";
import { Uploader } from "@/components/Uploader";
import { SparkleIcon } from "@/components/icons";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="bg-grid pointer-events-none fixed inset-0 opacity-50" aria-hidden />
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-[520px] bg-gradient-to-b from-wom-700/20 via-wom-900/10 to-transparent blur-3xl"
        aria-hidden
      />

      <main className="relative mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-12 sm:py-16">
        <header className="space-y-6">
          <div className="flex items-center justify-between">
            <Image
              src="/image.png"
              alt="WOM"
              width={84}
              height={28}
              priority
              unoptimized
              className="h-7 w-auto"
            />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-wom-500/30 bg-wom-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-wom-300">
              <SparkleIcon className="h-3 w-3" />
              Dev tools
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Image Optimizer
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
              Sube imágenes y conviértelas a WebP comprimido al máximo. Procesa varias
              en paralelo y descarga todo como un solo ZIP.
            </p>
          </div>
        </header>

        <Uploader />

        <footer className="mt-auto flex items-center justify-between border-t border-neutral-900 pt-6 text-xs text-neutral-500">
          <span>Sharp · quality 75 · effort 6</span>
          <span>WOM Internal</span>
        </footer>
      </main>
    </div>
  );
}
