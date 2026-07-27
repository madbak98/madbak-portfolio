import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "../../components/seo/JsonLd";
import { MadlabShell } from "../MadlabShell";
import { MadlabArticleHeader } from "../components/MadlabArticleHeader";
import { catalogEntry, MadlabCatalogDetail } from "../components/MadlabCatalogDetail";
import { MadlabCallout } from "../components/MadlabCallout";
import { MadlabCodeBlock } from "../components/MadlabCodeBlock";
import { MadlabPreviewShell } from "../components/MadlabPreviewShell";
import { MadlabPropsList } from "../components/MadlabPropsList";
import { MadlabRelatedExperiments } from "../components/MadlabRelatedExperiments";
import { MadlabSection } from "../components/MadlabSection";
import { MadlabSourceActions } from "../components/MadlabSourceActions";
import { MadlabStep } from "../components/MadlabStep";
import { MadlabLibrarySidebar } from "../components/MadlabLibrarySidebar";
import { buildMadlabJsonLd, buildMadlabMetadata } from "../../lib/madlab-seo";
import { getMadlabEntry, MADLAB_ENTRIES, type MadlabEntry } from "../../lib/madlab";
import { getReactBitsFreeItem, REACT_BITS_FREE_ITEMS } from "../../lib/react-bits-free";

const CURSOR_GRID_CODE = `import { useState } from "react";

const GRID_SIZE = 5;

export function CursorGrid() {
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5, active: false });

  function trackPointer(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: (event.clientX - bounds.left) / bounds.width,
      y: (event.clientY - bounds.top) / bounds.height,
      active: true,
    });
  }

  return (
    <div onPointerMove={trackPointer} onPointerLeave={() => setPointer((state) => ({ ...state, active: false }))}>
      {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
        const column = index % GRID_SIZE;
        const row = Math.floor(index / GRID_SIZE);
        const distance = Math.hypot(pointer.x - (column + 0.5) / GRID_SIZE, pointer.y - (row + 0.5) / GRID_SIZE);
        const proximity = pointer.active ? Math.max(0, 1 - distance * 3.2) : 0;

        return <span key={index} style={{ opacity: 0.2 + proximity * 0.8 }} />;
      })}
    </div>
  );
}

/* CSS */
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 16s linear infinite;
}

@keyframes marquee {
  to { transform: translateX(-50%); }
}`;

const MAGNETIC_BUTTON_CODE = `import { useState } from "react";

export function MagneticButton() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function trackPointer(event: React.PointerEvent<HTMLButtonElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setOffset({
      x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 24,
      y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 24,
    });
  }

  return (
    <button
      onPointerMove={trackPointer}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      style={{ transform: \`translate3d(\${offset.x}px, \${offset.y}px, 0)\` }}
    >
      Start a conversation
    </button>
  );
}`;

const INFINITE_MARQUEE_CODE = `const items = ["MADLAB", "MOTION", "CODE", "INTERACTION"];

export function InfiniteMarquee() {
  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div className="marquee-track">
        {loop.map((item, index) => (
          <span key={\`\${item}-\${index}\`}>{item} / </span>
        ))}
      </div>
    </div>
  );
}`;

function codeForEntry(slug: string) {
  if (slug === "cursor-grid") return CURSOR_GRID_CODE;
  if (slug === "magnetic-button") return MAGNETIC_BUTTON_CODE;
  if (slug === "infinite-marquee") return INFINITE_MARQUEE_CODE;
  return CURSOR_GRID_CODE;
}

const ENTRY_DETAILS = {
  "cursor-grid": {
    overviewTitle: "A pointer-led grid that explains proximity.",
    overview: "Cursor Grid turns pointer position into a readable field of response. The useful part is the small distance calculation behind the visual treatment.",
    learn: ["Map pointer coordinates into a stable local space.", "Calculate proximity without a heavy animation loop.", "Keep the interaction legible with hover, keyboard, and reduced-motion fallbacks."],
    how: "The grid normalizes the pointer against its own bounds, measures distance from each cell, and uses that value to tune the cell’s visual response.",
    steps: [
      ["01", "Create the grid contract", "Start with a fixed cell system and a clear pointer coordinate model."],
      ["02", "Measure proximity", "Compare the pointer position with each cell center and clamp the influence."],
      ["03", "Turn distance into feedback", "Use color, shadow, and scale as restrained output signals."],
    ],
  },
  "magnetic-button": {
    overviewTitle: "A small button with a sense of weight.",
    overview: "Magnetic Button uses pointer distance to pull a CTA toward the user without making the interaction feel noisy or difficult to control.",
    learn: ["Read pointer position relative to a button’s bounds.", "Translate a normalized offset into a restrained movement range.", "Reset the interaction cleanly when the pointer leaves."],
    how: "The button owns its offset. Pointer coordinates are normalized to the center of the element, scaled to a small range, and reset on leave.",
    steps: [
      ["01", "Measure the button", "Use the element bounds so the interaction works at any responsive size."],
      ["02", "Normalize the pull", "Convert pointer distance into a small, predictable translation."],
      ["03", "Release with intent", "Return to the resting position when the pointer leaves the target."],
    ],
  },
  "infinite-marquee": {
    overviewTitle: "A continuous loop with a readable rhythm.",
    overview: "Infinite Marquee duplicates a short content set and translates the track continuously, creating motion that can be paused or reduced without losing the message.",
    learn: ["Duplicate content to create a seamless loop.", "Animate one track instead of every individual word.", "Respect reduced motion and preserve readable contrast."],
    how: "The track contains two copies of the same items. A single linear translation moves the first copy out while the second copy takes its place.",
    steps: [
      ["01", "Define the content rhythm", "Keep the source list short, intentional, and easy to duplicate."],
      ["02", "Build one moving track", "Render both copies in one flex row with a fixed animation duration."],
      ["03", "Protect readability", "Slow the loop down, expose the content, and disable nonessential motion when requested."],
    ],
  },
} as const;

type MadlabEntryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [...MADLAB_ENTRIES, ...REACT_BITS_FREE_ITEMS].map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: MadlabEntryPageProps): Promise<Metadata> {
  const slug = (await params).slug;
  const entry = getMadlabEntry(slug);
  if (entry) return buildMadlabMetadata(entry);
  const item = getReactBitsFreeItem(slug);
  return item ? buildMadlabMetadata(catalogEntry(item)) : { title: "MADLAB experiment not found" };
}

function MadlabEntryPageContent({ entry }: { entry: MadlabEntry }) {
  const details = ENTRY_DETAILS[entry.slug as keyof typeof ENTRY_DETAILS] ?? ENTRY_DETAILS["cursor-grid"];

  return (
    <main>
        <MadlabArticleHeader entry={entry} />
        <MadlabPreviewShell entry={entry} code={codeForEntry(entry.slug)} />

        <MadlabSection eyebrow="01 / Overview" title={details.overviewTitle}>
          <p>{details.overview}</p>
        </MadlabSection>

        <MadlabSection eyebrow="02 / What you will learn" title="The idea behind the interaction.">
          <ul className="space-y-3">
            {details.learn.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </MadlabSection>

        <MadlabSection eyebrow="03 / How it works" title="Structure first. Tuning second.">
          <p>{details.how}</p>
        </MadlabSection>

        <section className="border-b border-white/12 px-5 py-12 sm:px-8 sm:py-16 lg:px-12" aria-labelledby="build-steps-title">
          <div className="mx-auto max-w-[1100px]">
            <div className="mb-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff2a2a]">04 / Build sequence</p>
              <h2 id="build-steps-title" className="mt-3 text-3xl font-black tracking-[-0.06em]">Step by step</h2>
            </div>
            <div className="space-y-8">
              {details.steps.map(([number, title, copy]) => (
                <MadlabStep key={number} number={number} title={title}>{copy}</MadlabStep>
              ))}
            </div>
            <MadlabCodeBlock
              language="tsx"
              code={codeForEntry(entry.slug)}
            />
          </div>
        </section>

        <MadlabSection eyebrow="05 / Notes" title="Production details belong in the experiment.">
          <MadlabCallout kind="note" title="Implementation note">
            This release includes a working preview and a copy-ready starter implementation for this experiment.
          </MadlabCallout>
          <MadlabCallout kind="warning" title="Scope">
            Production hardening, stronger mobile tuning, and a full written breakdown can be added in the next pass.
          </MadlabCallout>
          <MadlabCallout kind="tip" title="Next pass">
            Tune the timing, contrast, and component API against the context where you plan to use it.
          </MadlabCallout>
        </MadlabSection>

        <MadlabSection eyebrow="06 / Props & API" title="A stable surface for the future build.">
          <MadlabPropsList props={[
            { name: "reducedMotion", type: "boolean", description: "Keeps the preview readable without nonessential movement." },
            { name: "className", type: "string", description: "Allows the experiment shell to inherit the MADLAB layout." },
            { name: "status", type: "MadlabStatus", description: "Communicates whether the experiment is draft, preview, or published." },
          ]} />
        </MadlabSection>

        <MadlabSection eyebrow="07 / Performance" title="Measure before adding complexity.">
          <p>Keep animation work local to the interaction, avoid unnecessary state updates, and pause nonessential work when the preview is not visible.</p>
        </MadlabSection>

        <MadlabSection eyebrow="08 / Accessibility" title="The visual idea still needs a clear interface.">
          <p>Every future experiment should have a semantic name, keyboard path, reduced-motion fallback, usable contrast, and a text explanation that does not depend on the animation.</p>
        </MadlabSection>

        <MadlabSection eyebrow="09 / Mobile" title="A considered small screen composition.">
          <p>On narrow screens, the preview should simplify its visual workload, preserve the primary idea, and never require horizontal scrolling to understand the experiment.</p>
        </MadlabSection>

        <section className="border-b border-white/12 px-5 py-12 sm:px-8 sm:py-16 lg:px-12" aria-labelledby="source-actions-title">
          <div className="mx-auto max-w-[1100px]">
            <h2 id="source-actions-title" className="sr-only">Source actions</h2>
            <MadlabSourceActions entry={entry} />
          </div>
        </section>
        <MadlabRelatedExperiments entry={entry} />
    </main>
  );
}

export default async function MadlabEntryPage({ params }: MadlabEntryPageProps) {
  const slug = (await params).slug;
  const entry = getMadlabEntry(slug);
  const item = getReactBitsFreeItem(slug);
  if (!entry && !item) notFound();

  return (
    <MadlabShell>
      <JsonLd data={buildMadlabJsonLd(entry ?? catalogEntry(item!))} />
      {entry ? (
        <div className="mx-auto max-w-[1800px] lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
          <MadlabLibrarySidebar />
          <MadlabEntryPageContent entry={entry} />
        </div>
      ) : (
        <div className="mx-auto max-w-[1800px] lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
          <MadlabLibrarySidebar />
          <MadlabCatalogDetail item={item!} />
        </div>
      )}
    </MadlabShell>
  );
}
