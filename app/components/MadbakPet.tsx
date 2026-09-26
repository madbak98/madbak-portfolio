"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import type { LangKey } from "../lib/portfolio-data";
import type { PetPageContext } from "../lib/pet-page-context";
import TextType from "../lab/react-bits/TextAnimations/TextType/TextType";
import {
  BACK_ID,
  PET_CHARACTER_SRC,
  emotionToPetState,
  getClickDialogue,
  getCompactSeedOptions,
  getDialogueText,
  getIdleDialogue,
  getOpeningForContext,
  getOptionLabel,
  resolveNextDialogueId,
  type DialogueOption,
  type PetDialogue,
  type PetEmotion,
  type PetState,
} from "../about/lib/pet-dialogues";

export type PetMode = "full" | "compact";

const TALK_FRAME_MS = 130;
const TYPING_SPEED = 34;
const LONG_IDLE_MS = 36000;

const FRAME_KEYS = [
  "idle",
  "smile",
  "angry",
  "sleepy",
  "talking1",
  "talking2",
] as const;

type FrameKey = (typeof FRAME_KEYS)[number];

export type MadbakPetProps = {
  mode: PetMode;
  pageContext: PetPageContext;
  lang: LangKey;
  portraitAlt: string;
  reducedMotion?: boolean;
  frame?: ReactNode;
  layout?: "stack" | "split";
};

function activeFrameKey(state: PetState, talkingFrame: 0 | 1): FrameKey {
  if (state === "talking") {
    return talkingFrame === 0 ? "talking1" : "talking2";
  }
  return state;
}

/**
 * Shared MADBAK Pet — simple conversation tree + TextType + emotions.
 * No AI. Options → next node. Back pops a small visit stack.
 */
export function MadbakPet({
  mode,
  pageContext,
  lang,
  portraitAlt,
  reducedMotion = false,
  frame,
  layout = "stack",
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

  const busyRef = useRef(false);
  const activeDialogueRef = useRef<PetDialogue | null>(null);
  const visitStackRef = useRef<string[]>([]);
  const petClickCountRef = useRef(0);
  const lastActivityRef = useRef(0);
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

  const playDialogue = useCallback(
    (dialogue: PetDialogue, opts?: { pushHistory?: boolean; clearStack?: boolean }) => {
      busyRef.current = true;
      lastActivityRef.current = Date.now();

      if (opts?.clearStack) {
        visitStackRef.current = [];
      } else if (
        opts?.pushHistory !== false &&
        activeDialogueRef.current &&
        activeDialogueRef.current.id !== dialogue.id
      ) {
        visitStackRef.current = [
          ...visitStackRef.current.slice(-24),
          activeDialogueRef.current.id,
        ];
      }

      activeDialogueRef.current = dialogue;
      setTypingDone(false);
      setVisibleOptions([]);
      setActiveDialogue(dialogue);
      setDialogueKey((k) => k + 1);
      setTalkingFrame(0);
      setPetState(emotionToPetState(dialogue.emotion));
    },
    [],
  );

  const selectOption = useCallback(
    (nextDialogueId: string) => {
      if (busyRef.current) return;

      if (nextDialogueId === BACK_ID) {
        const prevId = visitStackRef.current.pop();
        if (!prevId) {
          playDialogue(getOpeningForContext(pageContext), { clearStack: true });
          return;
        }
        const prev = resolveNextDialogueId(prevId);
        if (prev) playDialogue(prev, { pushHistory: false });
        return;
      }

      const next = resolveNextDialogueId(nextDialogueId);
      if (!next) return;
      const clear =
        nextDialogueId === "__start" || next.id === "root";
      playDialogue(next, { clearStack: clear });
    },
    [pageContext, playDialogue],
  );

  const handleTypingStart = useCallback(() => {
    setPetState("talking");
    setTalkingFrame(0);
  }, []);

  const handleTypingComplete = useCallback(() => {
    const dialogue = activeDialogueRef.current;
    const emotion: PetEmotion = dialogue?.emotion ?? "smile";
    setPetState(emotionToPetState(emotion));
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

  useEffect(() => {
    if (!ready) return;
    if (openedForRouteRef.current === contextKey) return;
    openedForRouteRef.current = contextKey;

    const openingDelay = 0;
    const t = window.setTimeout(() => {
      busyRef.current = false;
      activeDialogueRef.current = null;
      visitStackRef.current = [];
      petClickCountRef.current = 0;
      setActiveDialogue(null);
      setTypingDone(false);
      setPetState("idle");

      if (mode === "full") {
        setExpanded(true);
        playDialogue(getOpeningForContext(pageContext), { clearStack: true });
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
        playDialogue(getIdleDialogue());
      }
    }, 4000);
    return () => window.clearInterval(id);
  }, [ready, mode, playDialogue]);

  const openWithPageContext = useCallback(() => {
    setExpanded(true);
    playDialogue(getOpeningForContext(pageContext), { clearStack: true });
  }, [pageContext, playDialogue]);

  const onAvatarClick = () => {
    lastActivityRef.current = Date.now();
    if (busyRef.current) return;

    // Compact closed → open page conversation first
    if (mode === "compact" && !expanded) {
      openWithPageContext();
      return;
    }

    if (!activeDialogue) {
      openWithPageContext();
      return;
    }

    // Progressive click teasing while conversation is open
    petClickCountRef.current += 1;
    const count = petClickCountRef.current;
    setExpanded(true);
    playDialogue(getClickDialogue(count), { pushHistory: true });
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
    layout === "split" ? "madbak-pet--split" : "",
    ready ? "is-ready" : "",
    expanded ? "is-expanded" : "",
    reducedMotion ? "is-reduced" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className={rootClass} aria-label="Madbak companion" data-lang={lang}>
      <div className="madbak-pet__stack">
        <div className="madbak-pet__present">
          {showBubble ? (
            <div
              className="madbak-pet__bubble"
              aria-live="polite"
              dir={lang === "fa" ? "rtl" : "ltr"}
              lang={lang === "fa" ? "fa" : "en"}
            >
              <strong className="madbak-pet__name">Madbak:</strong>
              <div className="madbak-pet__line" key={`${lang}-${dialogueKey}`}>
                {activeDialogue ? (
                  <TextType
                    key={`${dialogueKey}-${lang}`}
                    text={getDialogueText(activeDialogue, lang)}
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
                    {getDialogueText(getOpeningForContext(pageContext), lang)}
                  </p>
                )}
              </div>
              <span className="madbak-pet__tail" aria-hidden />
            </div>
          ) : null}

          <div className="madbak-pet__stage">
            {frame}
            <button
              type="button"
              className="madbak-pet__avatar"
              onClick={onAvatarClick}
              onKeyDown={onAvatarKeyDown}
              onMouseEnter={onHoverPulse}
              aria-label={
                lang === "fa" ? "با MADBAK حرف بزن" : "Talk to Madbak"
              }
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
          </div>
        </div>

        {showOptions ? (
          <ul
            className="madbak-pet__options"
            dir={lang === "fa" ? "rtl" : "ltr"}
            lang={lang === "fa" ? "fa" : "en"}
          >
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
                  {getOptionLabel(option, lang)}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </aside>
  );
}
