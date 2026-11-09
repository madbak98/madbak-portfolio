"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState, type FormEvent } from "react";

import { submitSubscription, validateEmail } from "../../lib/newsletter";
import { ArrowRightIcon, CheckIcon } from "./icons";

type Status = "idle" | "submitting" | "success";

export function SubscribeForm({
  autoFocus = false,
  tone = "light",
}: {
  autoFocus?: boolean;
  tone?: "light" | "dark";
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const dark = tone === "dark";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateEmail(email);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    setStatus("submitting");
    const result = await submitSubscription(email.trim());
    if (result.ok) {
      setStatus("success");
    } else {
      setError(result.message);
      setStatus("idle");
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          role="status"
          className={`flex items-start gap-3 border-2 px-4 py-4 ${dark ? "border-white/50 bg-white/10 text-white" : "border-(--a-ink) bg-(--a-lavender) text-(--a-ink)"}`}
        >
          <span
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center ${dark ? "bg-white text-(--a-purple)" : "bg-(--a-purple) text-white"}`}
          >
            <CheckIcon className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-sm font-semibold">You’re on the list.</p>
            <p className={`mt-1 text-[0.8rem] ${dark ? "text-white/70" : "text-(--a-muted)"}`}>
              Demo mode — the newsletter isn’t connected yet, so no email was sent to{" "}
              <span className="font-medium">{email.trim()}</span>.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -6 }}
          onSubmit={onSubmit}
          noValidate
          className="w-full"
        >
          <label htmlFor={`${id}-email`} className="sr-only">
            Email address
          </label>
          <div
            className={`flex items-center gap-2 border-2 p-1.5 pl-4 transition-colors ${
              error
                ? dark
                  ? "border-white"
                  : "border-red-500 [.articles-root[data-articles-theme=dark]_&]:border-red-400"
                : dark
                  ? "border-white/45 focus-within:border-white"
                  : "border-(--a-ink) bg-(--a-surface) focus-within:border-(--a-purple)"
            }`}
          >
            <input
              id={`${id}-email`}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoFocus={autoFocus}
              placeholder="you@studio.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError(null);
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              className={`min-w-0 flex-1 bg-transparent py-2 text-[1rem] font-medium outline-none placeholder:opacity-60 ${dark ? "text-white placeholder:text-white" : "text-(--a-ink)"}`}
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className={`a-label group inline-flex h-12 shrink-0 items-center gap-2 px-5 font-semibold transition-[background-color,color,opacity] disabled:opacity-70 ${
                dark
                  ? "bg-white text-(--a-purple) hover:bg-(--a-purple-black) hover:text-white"
                  : "bg-(--a-purple) text-white hover:bg-(--a-ink) hover:text-(--a-on-ink)"
              }`}
            >
              {status === "submitting" ? "Subscribing…" : "Subscribe"}
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
          <p
            id={`${id}-error`}
            aria-live="polite"
            className={`mt-2 min-h-5 text-[0.85rem] font-medium ${dark ? "text-white" : "text-red-600 [.articles-root[data-articles-theme=dark]_&]:text-red-400"}`}
          >
            {error}
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
