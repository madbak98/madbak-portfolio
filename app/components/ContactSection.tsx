"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Mail } from "lucide-react";
import { useRef, type ComponentType, type SVGProps } from "react";

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

/** Filled glyphs — same visual system (currentColor, 24×24 viewBox) as original X / Instagram contact icons. */
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

/** Telegram / WhatsApp: filled brand-style marks scaled to match X / IG optical weight. */
function TelegramGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.44-.63-.28-1.13-.44-1.09-.94.02-.26.38-.52 1.07-.8 4.21-1.83 7.03-3.04 8.45-3.64 2.01-.88 2.43-.98 2.71-.98.06 0 .21.01.31.1.08.07.1.17.09.27-.01.05-.01.13-.02.21z" />
    </svg>
  );
}

function WhatsAppGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.421 1.03 7.393 2.995a9.87 9.87 0 012.222 3.377 9.87 9.87 0 01.677 3.634c0 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const HANDLES = {
  x: "@Lilosama98",
  instagram: "@madbak98",
  telegram: "@Lilosaama",
  /** UI only — full MSISDN stays on `SOCIAL_LINKS.whatsapp` / `wa.me` for clicks. */
  whatsapp: "+90 xxxx xxxx 0395",
} as const;

const socialItems: {
  key: "x" | "instagram" | "telegram" | "whatsapp";
  labelKey: keyof (typeof TRANSLATIONS)["en"];
  url: string;
  handle: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  {
    key: "x",
    labelKey: "contact_social_x",
    url: SOCIAL_LINKS.x,
    handle: HANDLES.x,
    Icon: ContactXIcon,
  },
  {
    key: "instagram",
    labelKey: "contact_social_ig",
    url: SOCIAL_LINKS.instagram,
    handle: HANDLES.instagram,
    Icon: InstagramGlyph,
  },
  {
    key: "telegram",
    labelKey: "contact_social_tg",
    url: SOCIAL_LINKS.telegram,
    handle: HANDLES.telegram,
    Icon: TelegramGlyph,
  },
  {
    key: "whatsapp",
    labelKey: "contact_social_wa",
    url: SOCIAL_LINKS.whatsapp,
    handle: HANDLES.whatsapp,
    Icon: WhatsAppGlyph,
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
          className={`mb-8 font-black sm:mb-12 ${localeCase(lang)} ${lang === "fa" ? "tracking-[0]" : "tracking-[-0.02em]"}`}
          style={{
            fontSize: "clamp(2rem, 7vw, 5rem)",
            lineHeight: lang === "fa" ? 1.12 : 0.95,
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
            className={`transition-colors duration-300 group-hover:text-black/80 ${lang !== "fa" ? "font-sans" : ""}`}
            style={{
              fontSize: "clamp(1.25rem, 3vw, 2rem)",
              letterSpacing: lang === "fa" ? "0" : "0.05em",
            }}
          >
            {CONTACT_EMAIL}
          </span>
        </motion.a>

        <div
          className="mb-12 grid w-full grid-cols-1 grid-flow-row gap-6 sm:mb-16 sm:grid-cols-2 sm:items-stretch sm:gap-8"
          role="list"
        >
          {socialItems.map((social, index) => (
            <motion.a
              key={social.key}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              role="listitem"
              aria-label={`${t(social.labelKey)} — ${social.handle}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className="group flex h-full min-h-[52px] min-w-0 flex-col border-s-2 border-black/20 py-5 ps-6 pe-4 transition-[border-color,background-color,box-shadow] duration-300 ease-out hover:border-[#0A0A0A] hover:bg-[#0A0A0A]/[0.05] hover:shadow-[inset_0_0_0_1px_rgba(10,10,10,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#ff2a2a]"
            >
              <div
                className={`mb-2 flex min-h-[1.5rem] items-center gap-3 ${lang === "fa" ? "flex-row-reverse" : ""}`}
              >
                <social.Icon
                  width={social.key === "x" ? 18 : 20}
                  height={social.key === "x" ? 18 : 20}
                  className="block shrink-0 text-[#0A0A0A]"
                  aria-hidden
                />
                <span
                  className={`font-mono text-sm text-black/60 transition-colors duration-300 group-hover:text-black/75 ${localeCase(lang)} ${contactSocialLabel(lang)}`}
                >
                  {t(social.labelKey)}
                </span>
              </div>
              <span
                dir={social.key === "whatsapp" ? "ltr" : undefined}
                className={`block min-w-0 break-words text-lg text-[#0A0A0A] transition-[color,text-decoration-color] duration-300 group-hover:text-[#050505] group-hover:underline group-hover:decoration-black/25 group-hover:underline-offset-[0.22em] ${social.key === "whatsapp" ? "unicode-bidi-isolate tabular-nums" : ""} ${lang !== "fa" ? "font-sans" : ""} ${contactSansEm(lang)}`}
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
              className={`mb-2 text-xs text-black/70 ${lang !== "fa" ? "font-sans" : ""} ${localeCase(lang)} ${contactFooterLabel(lang)} ${bodyProse(lang)}`}
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
