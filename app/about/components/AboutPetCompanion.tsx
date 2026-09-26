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
import { usePathname } from "next/navigation";

import type { LangKey } from "../../lib/portfolio-data";
import TextType from "../../lab/react-bits/TextAnimations/TextType/TextType";
import {
  PET_CHARACTER_SRC,
  PET_DEFAULT_OPTIONS,
  getDialogue,
  pickDialogue,
  triggerFromClickCount,
  type DialogueOption,
  type PetDialogue,
  type PetEmotion,
  type PetState,
  type PetTrigger,
} from "../lib/pet-dialogues";

const TALK_FRAME_MS = 130;
const CLICK_WINDOW_MS = 900;
const LONG_IDLE_MS = 34000;
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

type AboutPetCompanionProps = {
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

export function AboutPetCompanion({
  lang,
  portraitAlt,
  reducedMotion = false,
}: AboutPetCompanionProps) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [petState, setPetState] = useState<PetState>("idle");
  const [talkingFrame, setTalkingFrame] = useState<0 | 1>(0);
  const [activeDialogue, setActiveDialogue] = useState<PetDialogue | null>(
    null,
  );
  const [dialogueKey, setDialogueKey] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [visibleOptions, setVisibleOptions] = useState<readonly DialogueOption[]>(
    PET_DEFAULT_OPTIONS,
  );

  const usedIdsRef = useRef(new Set<string>());
  const busyRef = useRef(false);
  const activeDialogueRef = useRef<PetDialogue | null>(null);
  const clickTimesRef = useRef<number[]>([]);
  const lastActivityRef = useRef(0);
  const historyRef = useRef<string[]>([]);
  const firstVisitDoneRef = useRef(false);
  const aboutOpenDoneRef = useRef(false);

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

  const triggerDialogue = useCallback(
    (trigger: PetTrigger) => {
      if (busyRef.current) return;
      playDialogue(pickDialogue(trigger, usedIdsRef.current));
    },
    [playDialogue],
  );

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
    setVisibleOptions(dialogue?.options?.length ? dialogue.options : PET_DEFAULT_OPTIONS);
  }, []);

  useEffect(() => {
    if (petState !== "talking" || reducedMotion) return;
    const id = window.setInterval(() => {
      setTalkingFrame((f) => (f === 0 ? 1 : 0));
    }, TALK_FRAME_MS);
    return () => window.clearInterval(id);
  }, [petState, reducedMotion]);

  useEffect(() => {
    if (!ready || firstVisitDoneRef.current) return;
    if (pathname === "/about") {
      firstVisitDoneRef.current = true;
      return;
    }
    const t = window.setTimeout(() => {
      firstVisitDoneRef.current = true;
      triggerDialogue("firstVisit");
    }, 800);
    return () => window.clearTimeout(t);
  }, [ready, pathname, triggerDialogue]);

  useEffect(() => {
    if (!ready) return;
    if (pathname !== "/about") {
      aboutOpenDoneRef.current = false;
      return;
    }
    if (aboutOpenDoneRef.current) return;
    const t = window.setTimeout(() => {
      aboutOpenDoneRef.current = true;
      triggerDialogue("aboutOpen");
    }, 700);
    return () => window.clearTimeout(t);
  }, [pathname, ready, triggerDialogue]);

  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => {
      if (busyRef.current) return;
      if (Date.now() - lastActivityRef.current >= LONG_IDLE_MS) {
        lastActivityRef.current = Date.now();
        triggerDialogue("longIdle");
      }
    }, 4000);
    return () => window.clearInterval(id);
  }, [ready, triggerDialogue]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState !== "visible") return;
      lastActivityRef.current = Date.now();
      if (!busyRef.current) triggerDialogue("return");
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [triggerDialogue]);

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
      triggerDialogue(triggerFromClickCount(burst));
      return;
    }

    if (!activeDialogue) {
      playDialogue(getDialogue("root-hello")!);
      return;
    }

    if (typingDone) {
      playDialogue(getDialogue("root-again") ?? getDialogue("root-hello")!);
    }
  };

  const onAvatarKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onAvatarClick();
    }
  };

  const visibleKey = activeFrameKey(petState, talkingFrame);
  const bubbleIdle = !activeDialogue;

  return (
    <aside
      className={`madbak-pet${ready ? " is-ready" : ""}${reducedMotion ? " is-reduced" : ""}`}
      aria-label="Madbak companion"
    >
      <div className="madbak-pet__stack">
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
              <p className="madbak-pet__placeholder">yo. what do you wanna know?</p>
            )}
          </div>
          <span className="madbak-pet__tail" aria-hidden />
        </div>

        <button
          type="button"
          className="madbak-pet__avatar"
          onClick={onAvatarClick}
          onKeyDown={onAvatarKeyDown}
          aria-label="Talk to Madbak"
        >
          <span className="madbak-pet__pc">
            <Image
              src="/pet/old-pc.png"
              alt=""
              width={980}
              height={980}
              sizes="368px"
              priority
              draggable={false}
              aria-hidden
              className="madbak-pet__pc-frame"
            />
            <span className="madbak-pet__screen">
              {FRAME_KEYS.map((key) => (
                <Image
                  key={key}
                  src={PET_CHARACTER_SRC[key]}
                  alt={key === visibleKey ? portraitAlt : ""}
                  width={320}
                  height={320}
                  sizes="160px"
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
          </span>
        </button>

        {visibleOptions.length > 0 && (bubbleIdle || typingDone) ? (
          <ul className="madbak-pet__options">
            {visibleOptions.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  className="madbak-pet__option"
                  onClick={() => selectOption(option.nextDialogueId)}
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
