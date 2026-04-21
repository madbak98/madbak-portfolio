"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Mail } from "lucide-react";
import { useRef, type SVGProps } from "react";

import {
  CONTACT_EMAIL,
  SOCIAL_LINKS,
  TRANSLATIONS,
  type LangKey,
} from "../lib/portfolio-data";
import {
  bodyProse,
  contactAvailableTrack,
  contactFooterLabel,
  contactFooterMono,
  contactMonoLabel,
  contactSansEm,
  contactSocialLabel,
  localeCase,
} from "../lib/locale-ui";

function ContactXIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M18.9 2h3.68l-8.04 9.2L24 22h-7.41l-5.8-7.02L4.64 22H.95l8.6-9.83L0 2h7.6l5.25 6.37L18.9 2Zm-1.29 17.8h2.04L6.49 4.08H4.3L17.61 19.8Z" />
    </svg>
  );
}

function InstagramGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

const HANDLES = { x: "@Lilosama98", instagram: "@madbak98" } as const;

const socialItems = [
  {
    key: "x" as const,
    labelKey: "contact_social_x" as const,
    url: SOCIAL_LINKS.x,
    handle: HANDLES.x,
    Icon: ContactXIcon,
  },
  {
    key: "instagram" as const,
    labelKey: "contact_social_ig" as const,
    url: SOCIAL_LINKS.instagram,
    handle: HANDLES.instagram,
    Icon: InstagramGlyph,
  },
];

type TFn = (key: keyof (typeof TRANSLATIONS)["en"]) => string;

export function ContactSection({
  t,
  lang,
}: {
  t: TFn;
  lang: LangKey;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3, 1], [100, 0, 0]);

  const mailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("MADBAK — contact")}`;

  return (
    <section
      id="contact"
      ref={ref}
      className="relative flex min-h-[68vh] scroll-mt-[5.5rem] items-center justify-center overflow-hidden bg-[#ff2a2a] px-4 py-12 pb-[max(3rem,env(safe-area-inset-bottom))] pt-[max(3rem,env(safe-area-inset-top))] text-[#0A0A0A] sm:min-h-[75vh] sm:px-6 sm:py-16 md:px-8 md:py-20 lg:min-h-[82vh] lg:px-14"
    >
      <div className="absolute inset-0 bg-noise opacity-30 mix-blend-multiply" />

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 mx-auto w-full max-w-4xl"
      >
        <div className="mb-6">
          <span
            className={`font-mono text-xs text-[#0A0A0A] ${localeCase(lang)} ${contactMonoLabel(lang)}`}
          >
            {t("contact_label")}
          </span>
        </div>

        <h2
          className={`mb-8 font-black sm:mb-12 ${localeCase(lang)} ${lang === "fa" ? "tracking-tight" : "tracking-[-0.02em]"}`}
          style={{
            fontSize: "clamp(2rem, 7vw, 5rem)",
            lineHeight: lang === "fa" ? 1.08 : 0.95,
          }}
        >
          {t("contact_title_1")}
          <br />
          {t("contact_title_2")}
        </h2>

        <motion.a
          href={mailHref}
          initial={{ opacity: 0, x: lang === "fa" ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className={`group mb-12 flex w-fit max-w-full min-h-[48px] items-center gap-3 sm:mb-16 sm:gap-4 ${lang === "fa" ? "flex-row-reverse" : ""}`}
        >
          <Mail
            size={24}
            className="shrink-0 text-[#0A0A0A]"
            aria-hidden
          />
          <span
            className="font-sans transition-colors duration-300 group-hover:text-black/80"
            style={{
              fontSize: "clamp(1.25rem, 3vw, 2rem)",
              letterSpacing: lang === "fa" ? "0.02em" : "0.05em",
            }}
          >
            {CONTACT_EMAIL}
          </span>
        </motion.a>

        <div className="mb-12 grid grid-cols-1 gap-6 sm:mb-16 sm:gap-8 md:grid-cols-2">
          {socialItems.map((social, index) => (
            <motion.a
              key={social.key}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className="group min-h-[52px] border-s-2 border-black/20 py-4 ps-6 transition-all duration-300 hover:border-[#0A0A0A]"
            >
              <div
                className={`mb-2 flex items-center gap-3 ${lang === "fa" ? "flex-row-reverse" : ""}`}
              >
                <social.Icon
                  width={social.key === "x" ? 18 : 20}
                  height={social.key === "x" ? 18 : 20}
                  className="block shrink-0 text-[#0A0A0A]"
                  aria-hidden
                />
                <span
                  className={`font-mono text-sm text-black/60 ${localeCase(lang)} ${contactSocialLabel(lang)}`}
                >
                  {t(social.labelKey)}
                </span>
              </div>
              <span
                className={`font-sans text-lg text-[#0A0A0A] ${contactSansEm(lang)}`}
              >
                {social.handle}
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 h-[2px] w-full origin-start bg-black/25"
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"
        >
          <div className="max-w-xl text-start">
            <p
              className={`mb-2 font-sans text-xs text-black/70 ${localeCase(lang)} ${contactFooterLabel(lang)} ${bodyProse(lang)}`}
            >
              {t("contact_commissions")}
            </p>
            <p
              className={`font-mono text-xs text-black/50 ${contactFooterMono(lang)}`}
            >
              {t("contact_rights")}
            </p>
          </div>

          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`flex shrink-0 items-center gap-2 ${lang === "fa" ? "flex-row-reverse" : ""}`}
          >
            <div className="h-2 w-2 shrink-0 rounded-full bg-[#0A0A0A]" />
            <span
              className={`font-mono text-xs text-[#0A0A0A] ${localeCase(lang)} ${contactAvailableTrack(lang)}`}
            >
              {t("contact_available")}
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        viewport={{ once: true }}
        className="pointer-events-none absolute top-0 left-0 z-[1] h-full w-[2px] origin-top bg-[#0A0A0A]/35"
      />
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        viewport={{ once: true }}
        className="pointer-events-none absolute top-0 right-0 z-[1] h-full w-[2px] origin-top bg-[#0A0A0A]/35"
      />
    </section>
  );
}
