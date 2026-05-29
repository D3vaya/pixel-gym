import Image from "next/image";
import { Uploader } from "@/components/Uploader";
import { GithubIcon, SparkleIcon } from "@/components/icons";
import { branding } from "@/branding.config";

function BrandWordmark({ name }: { name: string }) {
  const m = name.match(/^(<\/?)([^/>]+)(\/?>)$/);
  const cls = "font-mono text-sm font-semibold tracking-tight text-neutral-300";
  if (m) {
    return (
      <span className={cls}>
        <span className="text-brand-400">{m[1]}</span>
        <span className="text-neutral-100">{m[2]}</span>
        <span className="text-brand-400">{m[3]}</span>
      </span>
    );
  }
  return <span className={cls}>{name}</span>;
}

function FooterBrand() {
  const { brand } = branding;
  const href = brand.productHref;
  return (
    <span className="flex items-center gap-2">
      <span className="font-display text-2xl leading-none text-white">
        {brand.product}
      </span>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${brand.product} on GitHub`}
          className="focus-ring rounded-md p-1 text-neutral-400 transition-colors hover:text-brand-300"
        >
          <GithubIcon className="h-4 w-4" />
        </a>
      )}
    </span>
  );
}

function ProductTitle() {
  const { brand } = branding;
  const className =
    "font-display text-5xl leading-tight text-white sm:text-6xl";
  if (brand.productHref) {
    return (
      <h1>
        <a
          href={brand.productHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${className} focus-ring inline-block transition-colors hover:text-brand-300`}
        >
          {brand.product}
        </a>
      </h1>
    );
  }
  return <h1 className={className}>{brand.product}</h1>;
}

function FooterSignature() {
  const { brand, logo } = branding;
  const href = brand.footer.rightHref;
  const prefix = brand.footer.signaturePrefix;
  const inner = (
    <>
      {prefix && <span className="text-neutral-600">{prefix}</span>}
      {logo.footer.show && (
        <Image
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          unoptimized
          className={logo.footer.className}
        />
      )}
      <span>{brand.footer.right}</span>
    </>
  );
  const classes =
    "flex items-center gap-1.5 text-[11px] tabular-nums text-neutral-400";
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${classes} focus-ring rounded-md transition-colors hover:text-brand-300`}
      >
        {inner}
      </a>
    );
  }
  return <span className={classes}>{inner}</span>;
}

export default function Home() {
  const { brand, logo } = branding;
  return (
    <div className="relative min-h-screen">
      <div className="bg-grid pointer-events-none fixed inset-0 opacity-50" aria-hidden />
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-[520px] bg-gradient-to-b from-brand-700/20 via-brand-900/10 to-transparent blur-3xl"
        aria-hidden
      />

      <main className="relative mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-12 sm:py-16">
        <header className="space-y-6">
          <div className="flex items-center justify-between">
            {logo.header.show ? (
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                priority
                unoptimized
                className={logo.header.className}
              />
            ) : (
              <BrandWordmark name={brand.name} />
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-brand-300">
              <SparkleIcon className="h-3 w-3" />
              {brand.badge}
            </span>
          </div>

          <div className="space-y-3">
            <ProductTitle />
            <p className="max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
              {brand.tagline}
            </p>
          </div>
        </header>

        <Uploader />

        <footer className="mt-auto flex items-center justify-between gap-4 border-t border-neutral-900 pt-6 text-xs text-neutral-500">
          <FooterBrand />
          <FooterSignature />
        </footer>
      </main>
    </div>
  );
}
