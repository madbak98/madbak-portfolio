"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "motion/react";

const BOOT_LINES = [
  "> user detected",
  "> initializing session...",
  "> enter your name:",
] as const;

const MS_PER_CHAR = 14;

type Phase = "boot" | "name" | "shell" | "out";

type LogEntry = { id: string; text: string; kind: "sys" | "user" };

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const RARE_EMPTY = [
  "> …",
  "> static.",
  "> you weren’t supposed to see that.",
  "> listening on dead channel 7.",
];

const RARE_UNKNOWN = [
  "> trace incomplete.",
  "> request logged.",
  "> pattern: unknown.",
];

export function SecretTerminal({
  onClose,
  onNavigateProjects,
}: {
  onClose: () => void;
  onNavigateProjects: () => void;
}) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("boot");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [typing, setTyping] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [shellInput, setShellInput] = useState("");
  const [glitch, setGlitch] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const shellRef = useRef<HTMLInputElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cancelledRef = useRef(false);

  const pushLog = useCallback((text: string, kind: LogEntry["kind"]) => {
    setLog((prev) => [...prev, { id: uid(), text, kind }]);
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  }, []);

  const typeLine = useCallback(
    (line: string): Promise<void> => {
      if (cancelledRef.current) return Promise.resolve();
      if (reduce) {
        pushLog(line, "sys");
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        let i = 0;
        const tick = () => {
          if (cancelledRef.current) {
            resolve();
            return;
          }
          i += 1;
          setTyping(line.slice(0, i));
          if (i >= line.length) {
            pushLog(line, "sys");
            setTyping("");
            schedule(() => resolve(), 32);
            return;
          }
          schedule(tick, MS_PER_CHAR);
        };
        schedule(tick, MS_PER_CHAR);
      });
    },
    [pushLog, reduce, schedule],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [log, typing]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setGlitch(true));
    const t = setTimeout(() => setGlitch(false), 200);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    document.body.style.overflow = "hidden";

    let alive = true;
    (async () => {
      for (const line of BOOT_LINES) {
        if (!alive || cancelledRef.current) return;
        await typeLine(line);
      }
      if (!alive || cancelledRef.current) return;
      setPhase("name");
      schedule(() => nameRef.current?.focus(), 60);
    })();

    return () => {
      alive = false;
      cancelledRef.current = true;
      clearTimers();
      document.body.style.overflow = "";
    };
  }, [clearTimers, schedule, typeLine]);

  useEffect(() => {
    if (phase === "name") nameRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    if (phase === "shell") shellRef.current?.focus();
  }, [phase]);

  const submitName = useCallback(() => {
    const raw = nameInput.trim();
    const display = raw.length > 0 ? raw : "(anonymous)";
    const name = raw.length > 0 ? raw : "visitor";
    setNameInput("");
    pushLog(`> ${display}`, "user");

    (async () => {
      if (name.toLowerCase() === "babak") {
        await typeLine("> We already know that.");
      } else {
        await typeLine(`> welcome, ${name}.`);
      }
      if (cancelledRef.current) return;
      await typeLine("> session open. commands: help, about, projects, exit.");
      if (cancelledRef.current) return;
      setPhase("shell");
      schedule(() => shellRef.current?.focus(), 40);
    })();
  }, [nameInput, pushLog, typeLine, schedule]);

  const runCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      setShellInput("");

      if (raw.trim()) {
        pushLog(`> ${raw.trim()}`, "user");
      }

      if (!cmd) {
        if (Math.random() < 0.14) {
          const line = RARE_EMPTY[Math.floor(Math.random() * RARE_EMPTY.length)]!;
          void typeLine(line);
        }
        return;
      }

      void (async () => {
        if (cmd === "help") {
          await typeLine("> available commands: help, about, projects, exit");
        } else if (cmd === "about") {
          await typeLine(
            "> MADBAK is built at the intersection of design, motion, and code.",
          );
        } else if (cmd === "projects") {
          await typeLine("> navigating to projects…");
          if (!cancelledRef.current) onNavigateProjects();
        } else if (cmd === "exit") {
          await typeLine("> session closed.");
          if (!cancelledRef.current) {
            setPhase("out");
            schedule(onClose, 400);
          }
        } else if (cmd === "madbak") {
          await typeLine("> operator channel acknowledged.");
        } else if (Math.random() < 0.08) {
          const line =
            RARE_UNKNOWN[Math.floor(Math.random() * RARE_UNKNOWN.length)]!;
          await typeLine(line);
        } else {
          await typeLine("> unknown. type 'help'.");
        }
        if (!cancelledRef.current) {
          schedule(() => shellRef.current?.focus(), 20);
        }
      })();
    },
    [onClose, onNavigateProjects, pushLog, schedule, typeLine],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-[500] flex flex-col bg-[#030303] font-mono text-[13px] leading-relaxed text-[#c8c4bc] antialiased ${
        glitch ? "secret-terminal-glitch" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Secret session"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,42,42,0.07),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#ff2a2a]/25" />

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-10 pb-4 sm:px-8 sm:pt-12 md:px-12"
      >
        <p className="mb-6 text-[10px] tracking-[0.35em] text-[#ff2a2a]/80">
          MADBAK // SECRET_MODE
        </p>
        <div className="space-y-1 whitespace-pre-wrap break-words">
          {log.map((entry) => (
            <p
              key={entry.id}
              className={
                entry.kind === "user" ? "text-[#8a8680]" : "text-[#e8e4dc]"
              }
            >
              {entry.text}
            </p>
          ))}
          {typing ? (
            <p className="text-[#e8e4dc]">
              {typing}
              <span className="secret-terminal-caret ml-[1px] inline-block h-[1.05em] w-[2px] translate-y-[0.12em] bg-[#ff2a2a]" />
            </p>
          ) : null}
        </div>
      </div>

      <div className="shrink-0 border-t border-white/[0.06] bg-[#050505]/95 px-5 py-4 sm:px-8 md:px-12">
        {phase === "name" && (
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              submitName();
            }}
          >
            <span className="shrink-0 text-[#ff2a2a]">{" > "}</span>
            <input
              ref={nameRef}
              type="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="min-w-0 flex-1 border-none bg-transparent py-2 text-[#e8e4dc] outline-none placeholder:text-[#5c5a56]"
              placeholder="name"
              aria-label="Your name"
            />
          </form>
        )}
        {(phase === "shell" || phase === "out") && (
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (phase === "out") return;
              runCommand(shellInput);
            }}
          >
            <span className="shrink-0 text-[#ff2a2a]">{" > "}</span>
            <input
              ref={shellRef}
              type="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={shellInput}
              onChange={(e) => setShellInput(e.target.value)}
              disabled={phase === "out"}
              className="min-w-0 flex-1 border-none bg-transparent py-2 text-[#e8e4dc] outline-none placeholder:text-[#5c5a56] disabled:opacity-40"
              placeholder="command"
              aria-label="Command"
            />
          </form>
        )}
        <button
          type="button"
          onClick={onClose}
          className="mt-3 text-[10px] tracking-[0.2em] text-[#5c5a56] transition hover:text-[#ff2a2a]/90"
        >
          close [esc]
        </button>
      </div>
    </div>
  );
}
