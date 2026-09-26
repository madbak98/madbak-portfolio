/**
 * MADBAK Pet dialogue helpers — simple tree lookup + route openings.
 * No AI. No API. No random bank engine.
 */

import type { PetPageContext, PetPageType } from "../../lib/pet-page-context";
import type { LangKey } from "../../lib/portfolio-data";
import {
  ABOUT_ROOT_ID,
  BACK_ID,
  CLICK_ANGRY_IDS,
  CLICK_SEQUENCE_IDS,
  PET_DIALOGUE_TREE,
  START_ID,
} from "./pet-dialogue-tree";

export type PetEmotion = "neutral" | "smile" | "angry" | "sleepy";
export type PetState = "idle" | "talking" | Exclude<PetEmotion, "neutral">;

export type LocalizedPetText = {
  en: string;
  fa: string;
};

export type DialogueOption = {
  id: string;
  label: string | LocalizedPetText;
  nextDialogueId: string;
};

export type PetDialogue = {
  id: string;
  text: LocalizedPetText | string;
  emotion: PetEmotion;
  options?: readonly DialogueOption[];
};

export { BACK_ID, START_ID, ABOUT_ROOT_ID };

export const PET_CHARACTER_SRC = {
  idle: "/pet/smile.jpeg",
  smile: "/pet/smile.jpeg",
  angry: "/pet/angry.jpeg",
  sleepy: "/pet/sleepy.jpeg",
  talking1: "/pet/talking1.jpeg",
  talking2: "/pet/talking2.jpeg",
} as const;

/** Full tree (About + branches + clicks + route openers). */
export const PET_DIALOGUES: readonly PetDialogue[] = PET_DIALOGUE_TREE;

const BY_ID = new Map(PET_DIALOGUES.map((d) => [d.id, d]));

export function emotionToPetState(emotion: PetEmotion): PetState {
  return emotion === "neutral" ? "idle" : emotion;
}

export function getDialogue(id: string): PetDialogue | undefined {
  return BY_ID.get(id);
}

export function getDialogueText(dialogue: PetDialogue, lang: LangKey): string {
  if (typeof dialogue.text === "string") return dialogue.text;
  if (lang === "fa") return dialogue.text.fa;
  return dialogue.text.en;
}

export function getOptionLabel(option: DialogueOption, lang: LangKey): string {
  if (typeof option.label === "string") return option.label;
  if (lang === "fa") return option.label.fa;
  return option.label.en;
}

const OPENING_ID_BY_PAGE: Partial<Record<PetPageType, string>> = {
  home: "open-home-about",
  about: ABOUT_ROOT_ID,
  works: "open-works",
  services: "open-services",
  contact: "open-contact",
  madlab: "open-lab",
  other: "open-other",
};

/**
 * Page-aware opening node — links into the same connected tree.
 */
export function getOpeningForContext(ctx: PetPageContext): PetDialogue {
  if (ctx.pageType === "service-detail") {
    return getDialogue("open-services") ?? getDialogue(ABOUT_ROOT_ID)!;
  }
  if (ctx.pageType === "about" || ctx.pageType === "home") {
    // Homepage #about CRT + /about share the same root
    if (ctx.pageType === "about") {
      return getDialogue(ABOUT_ROOT_ID)!;
    }
  }
  const id = OPENING_ID_BY_PAGE[ctx.pageType] ?? "open-other";
  return getDialogue(id) ?? getDialogue(ABOUT_ROOT_ID)!;
}

/** Compact first-click options from the page opening node. */
export function getCompactSeedOptions(
  ctx: PetPageContext,
): readonly DialogueOption[] {
  const opening = getOpeningForContext(ctx);
  return opening.options?.slice(0, 4) ?? [];
}

/**
 * Resolve next node id (including special __start).
 * __back is handled by MadbakPet's visit stack — not here.
 */
export function resolveNextDialogueId(
  nextDialogueId: string,
): PetDialogue | undefined {
  if (nextDialogueId === START_ID || nextDialogueId === "root") {
    return getDialogue(ABOUT_ROOT_ID);
  }
  return getDialogue(nextDialogueId);
}

/** Sequential pet-click progression → then random angry lines. */
export function getClickDialogue(clickCount: number): PetDialogue {
  if (clickCount >= 1 && clickCount <= CLICK_SEQUENCE_IDS.length) {
    return getDialogue(CLICK_SEQUENCE_IDS[clickCount - 1]!)!;
  }
  const idx = Math.floor(Math.random() * CLICK_ANGRY_IDS.length);
  return getDialogue(CLICK_ANGRY_IDS[idx]!)!;
}

/** Long-idle sleepy line (About CRT only). */
export function getIdleDialogue(): PetDialogue {
  return getDialogue("sleepy-idle") ?? getDialogue(ABOUT_ROOT_ID)!;
}

export function dialogueNodeCount(): number {
  return PET_DIALOGUES.length;
}
