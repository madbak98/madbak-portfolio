"use client";

import Link from "next/link";

import { usePreferredLang } from "../../lib/locale-preference";
import { madlabText } from "../../lib/madlab-i18n";
import type { ReactBitsFreeItem } from "../../lib/react-bits-free";
import { MadlabCodeBlock } from "../components/MadlabCodeBlock";
import { MadlabLibrarySidebar } from "../components/MadlabLibrarySidebar";
import { MadlabStep } from "../components/MadlabStep";
import { getTutorialForItem } from "./tutorial-data";

export default function MadlabTutorialClient({ item }: { item: ReactBitsFreeItem }) {
  const [lang] = usePreferredLang();
  const tutorial = getTutorialForItem(item);
  const text = (copy: { en: string; fa: string; tr: string }) => copy[lang];
  const tx = (key: Parameters<typeof madlabText>[1]) => madlabText(lang, key);

  return (
    <div className="mx-auto max-w-[1800px] lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <MadlabLibrarySidebar />
      <main className="min-w-0">
        <header className="border-b border-white/12 px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-[1100px]">
            <Link href={`/lab/${item.slug}`} className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-[#ff2a2a]">
              {tx("libraryBack")}
            </Link>
            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.55fr)] lg:items-end lg:gap-16">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff2a2a]">MADLAB / TUTORIAL</p>
                <h1 className="mt-4 max-w-4xl text-[clamp(3rem,8vw,8.5rem)] font-black leading-[0.84] tracking-[-0.1em]">{text(tutorial.title)}</h1>
              </div>
              <p className="max-w-xl text-base leading-relaxed text-white/55">{text(tutorial.summary)}</p>
            </div>
            <div className="mt-10 grid gap-4 border-t border-white/12 pt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35 sm:grid-cols-3">
              <span>LEVEL / {text(tutorial.level)}</span>
              <span>TIME / {text(tutorial.time)}</span>
              <span>STACK / {text(tutorial.stack)}</span>
            </div>
          </div>
        </header>

        <section className="border-b border-white/12 px-5 py-10 sm:px-8 sm:py-14 lg:px-12" aria-labelledby="tutorial-map-title">
          <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[0.3fr_1fr] lg:gap-16">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff2a2a]">00 / {lang === "en" ? "Before you code" : lang === "fa" ? "قبل از کدنویسی" : "Kodlamadan önce"}</p>
              <h2 id="tutorial-map-title" className="mt-3 text-3xl font-black tracking-[-0.07em] sm:text-5xl">{lang === "en" ? "The mental model." : lang === "fa" ? "مدل ذهنی." : "Zihinsel model."}</h2>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-white/60">
              {tutorial.mentalModel.map((paragraph) => <p key={text(paragraph)}>{text(paragraph)}</p>)}
            </div>
          </div>
        </section>

        <section className="border-b border-white/12 px-5 py-12 sm:px-8 sm:py-16 lg:px-12" aria-labelledby="build-tutorial-title">
          <div className="mx-auto max-w-[1100px]">
            <div className="mb-10">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff2a2a]">01 / {lang === "en" ? "Build sequence" : lang === "fa" ? "روند ساخت" : "Yapım sırası"}</p>
              <h2 id="build-tutorial-title" className="mt-3 text-3xl font-black tracking-[-0.07em] sm:text-5xl">{lang === "en" ? "From blank file to interaction." : lang === "fa" ? "از فایل خالی تا تعامل." : "Boş dosyadan etkileşime."}</h2>
            </div>
            <div className="space-y-10">
              {tutorial.steps.map((step, index) => (
                <MadlabStep key={text(step.title)} number={String(index + 1).padStart(2, "0")} title={text(step.title)}>
                  <p>{text(step.copy)}</p>
                  {step.code ? <MadlabCodeBlock code={step.code} language="tsx" /> : null}
                </MadlabStep>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/12 px-5 py-12 sm:px-8 sm:py-16 lg:px-12" aria-labelledby="debug-title">
          <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[0.3fr_1fr] lg:gap-16">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff2a2a]">02 / {lang === "en" ? "Debug checklist" : lang === "fa" ? "چک‌لیست دیباگ" : "Hata ayıklama listesi"}</p>
              <h2 id="debug-title" className="mt-3 text-3xl font-black tracking-[-0.07em] sm:text-5xl">{lang === "en" ? "If it feels wrong." : lang === "fa" ? "اگر درست حس نمی‌شود." : "Doğru hissettirmiyorsa."}</h2>
            </div>
            <ul className="space-y-4 text-base leading-relaxed text-white/60">
              {tutorial.debug.map((line) => <li key={text(line)}><span className="text-[#ff2a2a]">•</span> {text(line)}</li>)}
            </ul>
          </div>
        </section>

        <section className="border-t border-white/12 px-5 py-10 sm:px-8 sm:py-14 lg:px-12" aria-label="Continue exploring MADLAB">
          <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-5">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff2a2a]">{tx("tutorialSource")}</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.06em]">{tx("readyToAdapt")}</h2>
            </div>
            <Link href={`/lab/${item.slug}#implementation-code`} className="border border-[#ff2a2a] px-4 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#ff2a2a] transition-colors hover:bg-[#ff2a2a] hover:text-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]">
              {tx("openLocalSource")}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
