"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { MadlabEntry } from "../../lib/madlab";
import type { ReactBitsFreeItem } from "../../lib/react-bits-free";
import { usePreferredLang } from "../../lib/locale-preference";
import { madlabCategoryLabel, madlabText, madlabTutorialPath } from "../../lib/madlab-i18n";
import { getTutorialForItem } from "../tutorials/tutorial-data";
import { MadlabCallout } from "./MadlabCallout";
import { ReactBitsCodeViewer } from "./ReactBitsCodeViewer";
import { ReactBitsLivePreview, type MadlabPalette } from "./ReactBitsLivePreview";

const INITIAL_PALETTE: MadlabPalette = {
  primary: "#FF2A2A",
  light: "#EBE8E1",
  deep: "#8B1515",
};

const PALETTE_SOURCES = new Set([
  "Strands", "Antigravity", "BlobCursor", "ClickSpark", "Crosshair", "Cubes", "ElectricBorder",
  "MagicRings", "Magnet", "LetterGlitch", "ShapeGrid", "Waves", "Counter", "Folder", "SpotlightCard",
  "CircularText", "CountUp", "GradientText", "ShinyText", "TrueFocus",
]);

function PaletteField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2.5 text-sm text-white/70 transition-colors focus-within:border-[#ff2a2a]/70">
      <span>{label}</span>
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">
        {value}
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="h-7 w-8 cursor-pointer rounded border border-white/15 bg-transparent p-0.5"
          aria-label={`${label} color`}
        />
      </span>
    </label>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-md border border-white/10 bg-white/[0.035] px-3 py-2.5">
      <span className="flex items-center justify-between gap-3 text-sm text-white/70">
        {label}
        <output className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">{value}</output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 h-1.5 w-full cursor-pointer accent-[#ff2a2a]"
        aria-label={label}
      />
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-md border border-white/10 bg-white/[0.035] px-3 py-2.5 text-sm text-white/70 focus-within:border-[#ff2a2a]/70">
      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25" aria-label={label} />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2.5 text-sm text-white/70 focus-within:border-[#ff2a2a]/70">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="max-w-[8rem] bg-transparent text-right font-mono text-[10px] uppercase tracking-[0.1em] text-white/50 outline-none" aria-label={label}>
        {options.map((option) => <option key={option} value={option} className="bg-[#151515]">{option}</option>)}
      </select>
    </label>
  );
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-md border border-white/10 bg-white/[0.035] px-3 py-2.5 text-sm text-white/70">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-[#ff2a2a]" aria-label={label} />
    </label>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 border-b border-white/10 py-3 last:border-b-0 sm:grid-cols-[0.7fr_1fr]">
      <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">{label}</dt>
      <dd className="break-words text-sm text-white/70">{value}</dd>
    </div>
  );
}

export function MadlabCatalogDetailClient({ item, entry }: { item: ReactBitsFreeItem; entry: MadlabEntry }) {
  const [lang] = usePreferredLang();
  const tx = (key: Parameters<typeof madlabText>[1]) => madlabText(lang, key);
  const tutorial = getTutorialForItem(item);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [palette, setPalette] = useState<MadlabPalette>(INITIAL_PALETTE);
  const [speed, setSpeed] = useState(item.sourceName === "MagicRings" ? 0.8 : 0.35);
  const [count, setCount] = useState(item.sourceName === "MagicRings" ? 6 : 4);
  const [text, setText] = useState("MADLAB / MOTION");
  const [duration, setDuration] = useState(0.7);
  const [delay, setDelay] = useState(80);
  const [animateBy, setAnimateBy] = useState("words");
  const [blurEnabled, setBlurEnabled] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);

  const isTunable = item.sourceName === "Strands" || item.sourceName === "MagicRings";
  const isTextRelated = item.category === "TEXT ANIMATIONS" || item.sourceName === "AnimatedContent";
  const hasPalette = PALETTE_SOURCES.has(item.sourceName);
  const hasControls = hasPalette || isTunable || isTextRelated;
  const paletteLabel = useMemo(() => `${palette.primary} / ${palette.light} / ${palette.deep}`, [palette]);

  function updatePalette(key: keyof MadlabPalette, value: string) {
    setPalette((current) => ({ ...current, [key]: value }));
  }

  function resetPalette() {
    setPalette(INITIAL_PALETTE);
    setSpeed(item.sourceName === "MagicRings" ? 0.8 : 0.35);
    setCount(item.sourceName === "MagicRings" ? 6 : 4);
    setText("MADLAB / MOTION");
    setDuration(0.7);
    setDelay(80);
    setAnimateBy("words");
    setBlurEnabled(true);
  }

  function replayPreview() {
    setActiveTab("preview");
    setPreviewKey((current) => current + 1);
  }

  return (
    <main className="min-w-0">
      <header className="border-b border-white/12 px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.18em] text-white/38">
            <Link href="/lab" className="transition-colors hover:text-[#ff2a2a]">{tx("libraryBack")}</Link>
            <span>{madlabCategoryLabel(lang, item.category)} / {tx("freeReferenceLabel")}</span>
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.5fr)] lg:items-end lg:gap-16">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ff2a2a]">{entry.number} / {madlabCategoryLabel(lang, entry.category)}</p>
              <h1 className="mt-4 max-w-5xl text-[clamp(3.5rem,9vw,8.75rem)] font-black leading-[0.82] tracking-[-0.095em] text-[#ebe8e1]">{item.title}</h1>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-white/55 lg:pb-2">{entry.description}</p>
          </div>
          <dl className="mt-10 grid gap-x-8 border-t border-white/12 pt-4 sm:grid-cols-4">
            <InfoRow label={tx("difficulty")} value={entry.difficulty} />
            <InfoRow label={tx("buildTime")} value={entry.estimatedTime ?? "30–90 minutes"} />
            <InfoRow label={tx("category")} value={madlabCategoryLabel(lang, item.category)} />
            <InfoRow label={tx("status")} value={tx("previewLocalSource")} />
          </dl>
        </div>
      </header>

      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12" aria-labelledby="interactive-preview-title">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff2a2a]">{tx("workspace")}</p>
              <h2 id="interactive-preview-title" className="mt-3 text-3xl font-black tracking-[-0.07em] sm:text-5xl">{tx("buildTune")}</h2>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 border border-white/10 bg-white/[0.025] p-1" role="tablist" aria-label={tx("detailView")}>
                {(["preview", "code"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors ${activeTab === tab ? "bg-[#ff2a2a] text-[#0a0a0a]" : "text-white/45 hover:text-white"}`}
                  >
                    {tab === "preview" ? tx("preview") : tx("code")}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={replayPreview}
                aria-label={tx("replayAria")}
                className="border border-white/10 bg-white/[0.025] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/45 transition-colors hover:border-[#ff2a2a] hover:text-[#ff2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]"
              >
                {tx("replay")}
              </button>
            </div>
          </div>

          {activeTab === "preview" ? (
            <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
              <div className="min-w-0">
                <div className="flex items-center justify-between border border-b-0 border-white/12 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/38">
                  <span>{tx("livePreview")}</span>
                  <span>{isTextRelated ? tx("textControls") : hasPalette || isTunable ? tx("customControls") : tx("referencePreview")}</span>
                </div>
                <div className="relative border border-white/12 bg-[#101010]">
                  <ReactBitsLivePreview
                    key={previewKey}
                    item={item}
                    palette={palette}
                    size="detail"
                    previewProps={{ speed, count, ringCount: count, text, duration, delay, animateBy: animateBy as "words" | "letters", blur: blurEnabled }}
                  />
                </div>
                <p className="mt-3 border border-white/10 bg-white/[0.025] px-4 py-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-white/40">
                  {tx("moveInside")}
                </p>
              </div>

              <aside className="border border-white/12 bg-[#101010] p-4 sm:p-5" aria-label={tx("previewCustomization")}>
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#ff2a2a]">{tx("customize")}</p>
                    <h3 className="mt-2 text-xl font-bold tracking-[-0.05em]">{isTextRelated ? tx("textParameters") : hasPalette ? tx("palette") : tx("referenceSettings")}</h3>
                  </div>
                  <button type="button" onClick={resetPalette} className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/38 transition-colors hover:text-[#ff2a2a]">{tx("reset")}</button>
                </div>
                {hasPalette ? (
                  <div className="mt-4 space-y-2">
                    <PaletteField label={tx("primary")} value={palette.primary} onChange={(value) => updatePalette("primary", value)} />
                    <PaletteField label={tx("light")} value={palette.light} onChange={(value) => updatePalette("light", value)} />
                    <PaletteField label={tx("deep")} value={palette.deep} onChange={(value) => updatePalette("deep", value)} />
                  </div>
                ) : null}

                {isTextRelated ? (
                  <div className={`${hasPalette ? "mt-5 border-t border-white/10 pt-4" : "mt-4"} space-y-2`}>
                    <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">{tx("textAnimation")}</p>
                    <TextField label={tx("text")} value={text} onChange={setText} />
                    <SelectField label={tx("animateBy")} value={animateBy} options={["words", "letters"]} onChange={setAnimateBy} />
                    <RangeField label={tx("duration")} value={duration} min={0.1} max={1.5} step={0.05} onChange={setDuration} />
                    <RangeField label={tx("delay")} value={delay} min={0} max={300} step={10} onChange={setDelay} />
                    {item.sourceName === "BlurText" ? <ToggleField label={tx("enableBlur")} checked={blurEnabled} onChange={setBlurEnabled} /> : null}
                  </div>
                ) : null}

                {isTunable ? (
                  <div className={`${hasPalette || isTextRelated ? "mt-5 border-t border-white/10 pt-4" : "mt-4"} space-y-2`}>
                    <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">{tx("motionParameters")}</p>
                    <RangeField label={tx("speed")} value={speed} min={0.1} max={1.5} step={0.05} onChange={setSpeed} />
                    <RangeField label={item.sourceName === "MagicRings" ? tx("ringCount") : tx("strandCount")} value={count} min={2} max={10} step={1} onChange={setCount} />
                  </div>
                ) : null}

                {hasControls ? (
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">{tx("activeValues")}</p>
                    <p className="mt-2 break-words font-mono text-[9px] leading-relaxed text-white/45">
                      {hasPalette ? paletteLabel : tx("noColor")}
                      {isTextRelated ? ` / ${text} / ${duration}s / ${delay}ms` : ""}
                      {isTunable ? ` / ${speed} speed / ${count} count` : ""}
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 border-t border-white/10 pt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-white/35">{tx("noControls")}</p>
                )}
              </aside>
            </div>
          ) : (
            <div className="relative mt-8 border border-white/12 bg-[#101010] p-4 sm:p-6">
              <div className="mb-5 max-w-2xl">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#ff2a2a]">{tx("sourceCopyReady")}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{tx("sourceCopyDesc")}</p>
              </div>
              <ReactBitsCodeViewer item={item} initiallyOpen />
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-white/12 px-5 py-10 sm:px-8 sm:py-14 lg:px-12" aria-labelledby="props-title">
        <div className="mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-[0.42fr_1fr] lg:gap-20">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff2a2a]">{tx("apiSurface")}</p>
            <h2 id="props-title" className="mt-3 text-3xl font-black tracking-[-0.07em] sm:text-5xl">{tx("propsSource")}</h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/50">{tx("propsSourceDesc")}</p>
          </div>
          <dl className="border-y border-white/10">
            <InfoRow label={lang === "en" ? "Component" : lang === "fa" ? "کامپوننت" : "Bileşen"} value={item.sourceName} />
            <InfoRow label={lang === "en" ? "Source path" : lang === "fa" ? "مسیر سورس" : "Kaynak yolu"} value={item.sourcePath} />
            <InfoRow label={tx("stack")} value="React / TypeScript / Tailwind CSS" />
            <InfoRow label={tx("controls")} value={hasPalette ? tx("primaryLightDeep") : isTextRelated ? tx("textTiming") : tx("sourceDefaults")} />
            <InfoRow label={tx("accessibility")} value={tx("accessibilityDescription")} />
          </dl>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12" aria-labelledby="notes-title">
        <div className="mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-[0.42fr_1fr] lg:gap-20">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff2a2a]">{tx("integrationNotes")}</p>
            <h2 id="notes-title" className="mt-3 text-3xl font-black tracking-[-0.07em] sm:text-5xl">{tx("makeReference")}</h2>
          </div>
          <div className="max-w-2xl text-base leading-relaxed text-white/60">
            <p>{tx("integrationDesc")}</p>
            <MadlabCallout kind="tip" title={tx("buildNote")}>{tx("buildNoteDesc")}</MadlabCallout>
          </div>
        </div>
      </section>

      <section className="border-t border-white/12 px-5 py-10 sm:px-8 sm:py-14 lg:px-12" aria-labelledby="tutorial-title">
          <div className="mx-auto flex max-w-[1360px] flex-wrap items-end justify-between gap-8">
            <div className="max-w-2xl">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff2a2a]">{tx("tutorial")}</p>
              <h2 id="tutorial-title" className="mt-3 text-3xl font-black tracking-[-0.07em] sm:text-5xl">{tutorial.title[lang]}</h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/55">
                {tutorial.summary[lang]}
              </p>
            </div>
            <Link
              href={madlabTutorialPath(item.slug)}
              className="shrink-0 border border-[#ff2a2a] px-4 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#ff2a2a] transition-colors hover:bg-[#ff2a2a] hover:text-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]"
            >
              {tx("fullTutorial")}
            </Link>
          </div>
        </section>

      <section className="border-t border-white/12 px-5 py-10 sm:px-8 sm:py-14 lg:px-12" aria-label={tx("catalogContinue")}>
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff2a2a]">{tx("archive")}</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.06em]">{tx("keepExperimenting")}</h2>
          </div>
          <Link href="/lab" className="border border-[#ff2a2a] px-4 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#ff2a2a] transition-colors hover:bg-[#ff2a2a] hover:text-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]">{tx("backToLibrary")}</Link>
        </div>
      </section>
    </main>
  );
}
