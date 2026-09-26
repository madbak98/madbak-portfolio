"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import type { LangKey } from "../lib/portfolio-data";
import type { PetPageContext } from "../lib/pet-page-context";
import TextType from "../lab/react-bits/TextAnimations/TextType/TextType";
import {
  PET_CHARACTER_SRC,
  getCompactSeedOptions,
  getDialogue,
  getOpeningForContext,
  pickDialogue,
  triggerFromClickCount,
  type DialogueOption,
  type PetDialogue,
  type PetEmotion,
  type PetState,
} from "../about/lib/pet-dialogues";

export type PetMode = "full" | "compact";

const TALK_FRAME_MS = 130;
const CLICK_WINDOW_MS = 900;
const LONG_IDLE_MS = 36000;
const TYPING_SPEED = 34;

const FRAME_KEYS = [
  "idle",
  "smile",
  "angry",
  "sleepy",
  "talking1",
  "talking2",
] as const;

type FrameKey = (typeof FRAME_KEYS)[number];

type MadbakPetProps = {
  mode: PetMode;
  pageContext: PetPageContext;
  lang: LangKey;
  portraitAlt: string;
  reducedMotion?: boolean;
};

function activeFrameKey(state: PetState, talkingFrame: 0 | 1): FrameKey {
  if (state === "talking") {
    return talkingFrame === 0 ? "talking1" : "talking2";
  }
  return state;
}

/**
 * Shared MADBAK Pet — one conversation engine, two presentations.
 * full: editorial Operator installation (About)
 * compact: fixed viewport companion (other internal pages)
 */
export function MadbakPet({
  mode,
  pageContext,
  lang,
  portraitAlt,
  reducedMotion = false,
}: MadbakPetProps) {
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState(mode === "full");
  const [petState, setPetState] = useState<PetState>("idle");
  const [talkingFrame, setTalkingFrame] = useState<0 | 1>(0);
  const [activeDialogue, setActiveDialogue] = useState<PetDialogue | null>(
    null,
  );
  const [dialogueKey, setDialogueKey] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [visibleOptions, setVisibleOptions] = useState<readonly DialogueOption[]>(
    [],
  );

  const usedIdsRef = useRef(new Set<string>());
  const busyRef = useRef(false);
  const activeDialogueRef = useRef<PetDialogue | null>(null);
  const clickTimesRef = useRef<number[]>([]);
  const lastActivityRef = useRef(0);
  const historyRef = useRef<string[]>([]);
  const openedForRouteRef = useRef<string | null>(null);
  const contextKey = `${pageContext.pageType}:${pageContext.route}`;

  const preloadList = useMemo(() => Object.values(PET_CHARACTER_SRC), []);

  useEffect(() => {
    preloadList.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
    lastActivityRef.current = Date.now();
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, [preloadList]);

  const playDialogue = useCallback((dialogue: PetDialogue) => {
    busyRef.current = true;
    lastActivityRef.current = Date.now();
    historyRef.current = [...historyRef.current.slice(-24), dialogue.id];
    usedIdsRef.current.add(dialogue.id);
    if (usedIdsRef.current.size > 50) usedIdsRef.current.clear();
    activeDialogueRef.current = dialogue;
    setTypingDone(false);
    setVisibleOptions([]);
    setActiveDialogue(dialogue);
    setDialogueKey((k) => k + 1);
    setTalkingFrame(0);
    setPetState("idle");
  }, []);

  const selectOption = useCallback(
    (nextDialogueId: string) => {
      if (busyRef.current) return;
      const next = getDialogue(nextDialogueId);
      if (!next) return;
      playDialogue(next);
    },
    [playDialogue],
  );

  const handleTypingStart = useCallback(() => {
    setPetState("talking");
    setTalkingFrame(0);
  }, []);

  const handleTypingComplete = useCallback(() => {
    const dialogue = activeDialogueRef.current;
    const emotion: PetEmotion = dialogue?.emotion ?? "smile";
    setPetState(emotion);
    setTalkingFrame(0);
    setTypingDone(true);
    busyRef.current = false;
    setVisibleOptions(
      dialogue?.options?.length
        ? dialogue.options
        : getCompactSeedOptions(pageContext),
    );
  }, [pageContext]);

  useEffect(() => {
    if (petState !== "talking" || reducedMotion) return;
    const id = window.setInterval(() => {
      setTalkingFrame((f) => (f === 0 ? 1 : 0));
    }, TALK_FRAME_MS);
    return () => window.clearInterval(id);
  }, [petState, reducedMotion]);

  // Route change: reset presentation UI; full auto-opens with page context.
  useEffect(() => {
    if (!ready) return;
    if (openedForRouteRef.current === contextKey) return;
    openedForRouteRef.current = contextKey;

    const openingDelay = mode === "full" ? 650 : 0;
    const t = window.setTimeout(() => {
      busyRef.current = false;
      activeDialogueRef.current = null;
      setActiveDialogue(null);
      setTypingDone(false);
      setPetState("idle");

      if (mode === "full") {
        setExpanded(true);
        playDialogue(getOpeningForContext(pageContext));
        return;
      }

      setExpanded(false);
      setVisibleOptions(getCompactSeedOptions(pageContext));
    }, openingDelay);

    return () => window.clearTimeout(t);
  }, [ready, contextKey, mode, pageContext, playDialogue]);

  useEffect(() => {
    if (!ready || mode !== "full") return;
    const id = window.setInterval(() => {
      if (busyRef.current) return;
      if (Date.now() - lastActivityRef.current >= LONG_IDLE_MS) {
        lastActivityRef.current = Date.now();
        playDialogue(pickDialogue("longIdle", usedIdsRef.current));
      }
    }, 4000);
    return () => window.clearInterval(id);
  }, [ready, mode, playDialogue]);

  const openWithPageContext = useCallback(() => {
    setExpanded(true);
    playDialogue(getOpeningForContext(pageContext));
  }, [pageContext, playDialogue]);

  const onAvatarClick = () => {
    lastActivityRef.current = Date.now();
    if (busyRef.current) return;

    const now = Date.now();
    clickTimesRef.current = clickTimesRef.current.filter(
      (t) => now - t < CLICK_WINDOW_MS,
    );
    clickTimesRef.current.push(now);
    const burst = clickTimesRef.current.length;

    if (burst >= 3) {
      setExpanded(true);
      playDialogue(
        pickDialogue(triggerFromClickCount(burst), usedIdsRef.current),
      );
      return;
    }

    if (mode === "compact" && !expanded) {
      openWithPageContext();
      return;
    }

    if (!activeDialogue) {
      openWithPageContext();
      return;
    }

    if (typingDone) {
      playDialogue(getDialogue("root-again") ?? getOpeningForContext(pageContext));
    }
  };

  const onAvatarKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onAvatarClick();
    }
  };

  const onHoverPulse = () => {
    if (mode !== "compact" || expanded || busyRef.current) return;
    lastActivityRef.current = Date.now();
  };

  const visibleKey = activeFrameKey(petState, talkingFrame);
  const showBubble = mode === "full" || expanded;
  const showOptions =
    showBubble &&
    visibleOptions.length > 0 &&
    (!activeDialogue || typingDone);

  const rootClass = [
    "madbak-pet",
    `madbak-pet--${mode}`,
    ready ? "is-ready" : "",
    expanded ? "is-expanded" : "",
    reducedMotion ? "is-reduced" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className={rootClass} aria-label="Madbak companion" data-lang={lang}>
      <div className="madbak-pet__stack">
        {showBubble ? (
          <div className="madbak-pet__bubble" aria-live="polite">
            <strong className="madbak-pet__name">Madbak:</strong>
            <div className="madbak-pet__line" key={`${lang}-${dialogueKey}`}>
              {activeDialogue ? (
                <TextType
                  key={dialogueKey}
                  text={activeDialogue.text}
                  as="p"
                  className="madbak-pet__type"
                  typingSpeed={reducedMotion ? 10 : TYPING_SPEED}
                  initialDelay={reducedMotion ? 0 : 50}
                  loop={false}
                  showCursor={!reducedMotion}
                  cursorCharacter="▌"
                  cursorClassName="madbak-pet__cursor"
                  onTypingStart={handleTypingStart}
                  onTypingComplete={handleTypingComplete}
                />
              ) : (
                <p className="madbak-pet__placeholder">
                  {getOpeningForContext(pageContext).text}
                </p>
              )}
            </div>
            <span className="madbak-pet__tail" aria-hidden />
          </div>
        ) : null}

        <button
          type="button"
          className="madbak-pet__avatar"
          onClick={onAvatarClick}
          onKeyDown={onAvatarKeyDown}
          onMouseEnter={onHoverPulse}
          aria-label="Talk to Madbak"
          aria-expanded={showBubble}
        >
          <span className="madbak-pet__ring">
            {FRAME_KEYS.map((key) => (
              <Image
                key={key}
                src={PET_CHARACTER_SRC[key]}
                alt={key === visibleKey ? portraitAlt : ""}
                width={480}
                height={480}
                sizes={
                  mode === "full"
                    ? "(max-width: 1023px) min(70vw, 280px), 240px"
                    : "112px"
                }
                priority={key === "idle"}
                draggable={false}
                aria-hidden={key !== visibleKey}
                className={
                  key === visibleKey
                    ? "madbak-pet__img madbak-pet__img--active"
                    : "madbak-pet__img"
                }
              />
            ))}
          </span>
          {mode === "compact" && !expanded ? (
            <span className="madbak-pet__hint" aria-hidden />
          ) : null}
        </button>

        {showOptions ? (
          <ul className="madbak-pet__options">
            {visibleOptions.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  className="madbak-pet__option"
                  onClick={() => {
                    setExpanded(true);
                    selectOption(option.nextDialogueId);
                  }}
                >
                  <span className="madbak-pet__option-mark" aria-hidden>
                    ○
                  </span>
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </aside>
  );
}
