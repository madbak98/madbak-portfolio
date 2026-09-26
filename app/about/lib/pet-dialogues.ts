export type PetEmotion = "smile" | "angry" | "sleepy";
export type PetState = "idle" | "talking" | PetEmotion;

export type PetTrigger =
  | "firstVisit"
  | "hover"
  | "click"
  | "repeatedClick"
  | "spamClick"
  | "longIdle"
  | "return"
  | "aboutOpen";

export type DialogueOption = {
  id: string;
  label: string;
  nextDialogueId: string;
};

export type PetDialogue = {
  id: string;
  text: string;
  emotion: PetEmotion;
  options?: readonly DialogueOption[];
  /** Ambient / reaction dialogues keyed by interaction trigger */
  trigger?: PetTrigger;
};

export const PET_CHARACTER_SRC = {
  idle: "/pet/smile.jpeg",
  smile: "/pet/smile.jpeg",
  angry: "/pet/angry.jpeg",
  sleepy: "/pet/sleepy.jpeg",
  talking1: "/pet/talking1.jpeg",
  talking2: "/pet/talking2.jpeg",
} as const;

const TOPICS: readonly DialogueOption[] = [
  { id: "opt-who", label: "Who is Madbak?", nextDialogueId: "about-who" },
  { id: "opt-build", label: "What does he build?", nextDialogueId: "work-build" },
  { id: "opt-vibe", label: "What's his design style?", nextDialogueId: "design-style" },
  { id: "opt-random", label: "Tell me something random", nextDialogueId: "fun-random" },
];

export const PET_DEFAULT_OPTIONS = TOPICS;

const BACK: DialogueOption = {
  id: "opt-back",
  label: "← topics",
  nextDialogueId: "root-menu",
};

const MORE_BANTER: readonly DialogueOption[] = [
  { id: "opt-impress", label: "Okay, impress me", nextDialogueId: "banter-impress" },
  { id: "opt-cute", label: "you're kinda cute", nextDialogueId: "banter-cute" },
  { id: "opt-annoy", label: "you're annoying", nextDialogueId: "banter-annoy" },
  { id: "opt-back2", label: "← topics", nextDialogueId: "root-menu" },
];

export const PET_DIALOGUES: readonly PetDialogue[] = [
  // ——— conversation roots ———
  {
    id: "root-hello",
    text: "yo. what's up?",
    emotion: "smile",
    options: TOPICS,
  },
  {
    id: "root-menu",
    text: "pick your chaos.",
    emotion: "smile",
    options: [
      ...TOPICS,
      { id: "opt-banter", label: "just banter", nextDialogueId: "banter-hub" },
    ],
  },
  {
    id: "root-return",
    text: "oh, you're back.",
    emotion: "smile",
    options: TOPICS,
  },
  {
    id: "root-again",
    text: "still here. still pixel. still judging softly.",
    emotion: "sleepy",
    options: TOPICS,
  },

  // ——— ABOUT ———
  {
    id: "about-who",
    text: "he's a designer who got tired of stopping at Figma.",
    emotion: "smile",
    options: [
      { id: "a1", label: "What does he build?", nextDialogueId: "work-build" },
      { id: "a2", label: "What's his background?", nextDialogueId: "about-bg" },
      { id: "a3", label: "What does MADBAK mean?", nextDialogueId: "about-name" },
      BACK,
    ],
  },
  {
    id: "about-bg",
    text: "graphic design first. then code showed up like an uninvited co-founder. now he does both on purpose.",
    emotion: "smile",
    options: [
      { id: "b1", label: "Where is he based?", nextDialogueId: "about-where" },
      { id: "b2", label: "What does he use?", nextDialogueId: "work-tech" },
      { id: "b3", label: "What's his vibe?", nextDialogueId: "design-vibe" },
      BACK,
    ],
  },
  {
    id: "about-where",
    text: "Istanbul base. global chaos. timezone: vibes.",
    emotion: "smile",
    options: [
      { id: "w1", label: "What does he build?", nextDialogueId: "work-build" },
      { id: "w2", label: "What is he into?", nextDialogueId: "interest-into" },
      BACK,
    ],
  },
  {
    id: "about-name",
    text: "MADBAK is the creative identity. Babak is the human. I'm the floating PR department.",
    emotion: "smile",
    options: [
      { id: "n1", label: "Who is Madbak?", nextDialogueId: "about-who" },
      { id: "n2", label: "What's his personality like?", nextDialogueId: "fun-personality" },
      BACK,
    ],
  },
  {
    id: "about-do",
    text: "design × code × motion × weird ideas that somehow become websites.",
    emotion: "smile",
    options: [
      { id: "d1", label: "What kind of websites?", nextDialogueId: "work-websites" },
      { id: "d2", label: "Does he build AI products?", nextDialogueId: "work-ai" },
      BACK,
    ],
  },

  // ——— WORK ———
  {
    id: "work-build",
    text: "he makes websites and then spends an unreasonable amount of time making one button feel expensive.",
    emotion: "smile",
    options: [
      { id: "wb1", label: "What kind of websites?", nextDialogueId: "work-websites" },
      { id: "wb2", label: "What technologies?", nextDialogueId: "work-tech" },
      { id: "wb3", label: "Why motion?", nextDialogueId: "design-motion" },
      BACK,
    ],
  },
  {
    id: "work-websites",
    text: "premium, cinematic, slightly unhinged. not the 'we used a template and cried' kind.",
    emotion: "smile",
    options: [
      { id: "ww1", label: "Why brutalism?", nextDialogueId: "design-brutal" },
      { id: "ww2", label: "Why 3D?", nextDialogueId: "design-3d" },
      { id: "ww3", label: "What makes it MADBAK?", nextDialogueId: "design-signature" },
      BACK,
    ],
  },
  {
    id: "work-ai",
    text: "yes — when AI is a tool, not a personality transplant. he builds with it, he doesn't cosplay as it.",
    emotion: "smile",
    options: [
      { id: "wa1", label: "What technologies?", nextDialogueId: "work-tech" },
      { id: "wa2", label: "What's his creative obsession?", nextDialogueId: "interest-obsession" },
      BACK,
    ],
  },
  {
    id: "work-tech",
    text: "React, Next, TypeScript, GSAP, Three.js, shaders, motion systems… basically a toolbox that refuses to stay quiet.",
    emotion: "smile",
    options: [
      { id: "wt1", label: "Why Next.js?", nextDialogueId: "tech-next" },
      { id: "wt2", label: "Does he use Three.js?", nextDialogueId: "tech-three" },
      { id: "wt3", label: "What AI tools?", nextDialogueId: "tech-ai-tools" },
      BACK,
    ],
  },
  {
    id: "tech-next",
    text: "because shipping fast without looking temporary is a personality trait.",
    emotion: "smile",
    options: [
      { id: "tn1", label: "Does he use React?", nextDialogueId: "tech-react" },
      { id: "tn2", label: "What does he build?", nextDialogueId: "work-build" },
      BACK,
    ],
  },
  {
    id: "tech-react",
    text: "yes. extensively. sometimes lovingly. sometimes argumentatively.",
    emotion: "smile",
    options: [
      { id: "tr1", label: "What stack?", nextDialogueId: "work-tech" },
      { id: "tr2", label: "Why motion?", nextDialogueId: "design-motion" },
      BACK,
    ],
  },
  {
    id: "tech-three",
    text: "when the idea needs depth that CSS can't emotionally afford — yes.",
    emotion: "smile",
    options: [
      { id: "tt1", label: "Why 3D?", nextDialogueId: "design-3d" },
      { id: "tt2", label: "What AI tools?", nextDialogueId: "tech-ai-tools" },
      BACK,
    ],
  },
  {
    id: "tech-ai-tools",
    text: "as leverage, not as a ghostwriter for his taste. tools accelerate. they don't replace the point of view.",
    emotion: "smile",
    options: [
      { id: "ta1", label: "Does he build AI products?", nextDialogueId: "work-ai" },
      { id: "ta2", label: "Tell me something random", nextDialogueId: "fun-random" },
      BACK,
    ],
  },

  // ——— DESIGN ———
  {
    id: "design-vibe",
    text: "editorial. cinematic. minimal. slightly weird. like a gallery that learned JavaScript.",
    emotion: "smile",
    options: [
      { id: "dv1", label: "What's his design style?", nextDialogueId: "design-style" },
      { id: "dv2", label: "Why brutalism?", nextDialogueId: "design-brutal" },
      { id: "dv3", label: "Rate my vibe", nextDialogueId: "banter-rate" },
      BACK,
    ],
  },
  {
    id: "design-style",
    text: "strong type, intentional negative space, motion with purpose. no purple gradient trauma.",
    emotion: "smile",
    options: [
      { id: "ds1", label: "Why motion?", nextDialogueId: "design-motion" },
      { id: "ds2", label: "What makes a site feel MADBAK?", nextDialogueId: "design-signature" },
      BACK,
    ],
  },
  {
    id: "design-brutal",
    text: "because soft UI can be a personality eraser. brutalism keeps the edges sharp — literally and spiritually.",
    emotion: "angry",
    options: [
      { id: "db1", label: "Why 3D?", nextDialogueId: "design-3d" },
      { id: "db2", label: "What's his vibe?", nextDialogueId: "design-vibe" },
      BACK,
    ],
  },
  {
    id: "design-3d",
    text: "because flat wasn't dramatic enough. depth is just another font if you use it right.",
    emotion: "smile",
    options: [
      { id: "d3d1", label: "Why motion?", nextDialogueId: "design-motion" },
      { id: "d3d2", label: "What visual stuff does he like?", nextDialogueId: "interest-visual" },
      BACK,
    ],
  },
  {
    id: "design-motion",
    text: "motion isn't decoration. it's punctuation. if it doesn't change how you feel, delete it.",
    emotion: "smile",
    options: [
      { id: "dm1", label: "What does he build?", nextDialogueId: "work-build" },
      { id: "dm2", label: "What makes it MADBAK?", nextDialogueId: "design-signature" },
      BACK,
    ],
  },
  {
    id: "design-signature",
    text: "point of view. atmosphere. craft. if it could belong to anyone after removing the logo… start over.",
    emotion: "smile",
    options: [
      { id: "dsg1", label: "What's his personality like?", nextDialogueId: "fun-personality" },
      { id: "dsg2", label: "Tell me something random", nextDialogueId: "fun-random" },
      BACK,
    ],
  },

  // ——— INTERESTS ———
  {
    id: "interest-into",
    text: "games, cinema, fashion, 3D, architecture, music, digital art, tech — basically anything with taste and texture.",
    emotion: "smile",
    options: [
      { id: "ii1", label: "What games?", nextDialogueId: "interest-games" },
      { id: "ii2", label: "Creative obsession?", nextDialogueId: "interest-obsession" },
      { id: "ii3", label: "Visual stuff he likes?", nextDialogueId: "interest-visual" },
      BACK,
    ],
  },
  {
    id: "interest-games",
    text: "the kind where worlds feel designed, not just leveled. also: anything that makes him forget to sleep.",
    emotion: "sleepy",
    options: [
      { id: "ig1", label: "Does he sleep?", nextDialogueId: "fun-sleep" },
      { id: "ig2", label: "Is he always working?", nextDialogueId: "fun-always-work" },
      BACK,
    ],
  },
  {
    id: "interest-obsession",
    text: "making interfaces feel alive without looking like they need a wellness app.",
    emotion: "smile",
    options: [
      { id: "io1", label: "Why motion?", nextDialogueId: "design-motion" },
      { id: "io2", label: "Something weird about him?", nextDialogueId: "fun-weird" },
      BACK,
    ],
  },
  {
    id: "interest-visual",
    text: "pixel moods, brutal type, vapor skies, weird lighting, and anything that looks expensive accidentally.",
    emotion: "smile",
    options: [
      { id: "iv1", label: "What's his design style?", nextDialogueId: "design-style" },
      { id: "iv2", label: "Tell me something random", nextDialogueId: "fun-random" },
      BACK,
    ],
  },

  // ——— FUN ———
  {
    id: "fun-random",
    text: "he will redesign a spacing scale at 2am and call it 'a small tweak.'",
    emotion: "smile",
    options: [
      { id: "fr1", label: "Does he sleep?", nextDialogueId: "fun-sleep" },
      { id: "fr2", label: "Something weird?", nextDialogueId: "fun-weird" },
      { id: "fr3", label: "What's his personality?", nextDialogueId: "fun-personality" },
      BACK,
    ],
  },
  {
    id: "fun-sleep",
    text: "define sleep. if staring at a component counts, he's an athlete.",
    emotion: "sleepy",
    options: [
      { id: "fs1", label: "Is he always working?", nextDialogueId: "fun-always-work" },
      { id: "fs2", label: "just banter", nextDialogueId: "banter-hub" },
      BACK,
    ],
  },
  {
    id: "fun-always-work",
    text: "yes. emotionally. physically he pretends to rest while thinking about kerning.",
    emotion: "sleepy",
    options: [
      { id: "fa1", label: "Do you ever stop working?", nextDialogueId: "banter-stop" },
      { id: "fa2", label: "Tell me something random", nextDialogueId: "fun-random" },
      BACK,
    ],
  },
  {
    id: "fun-personality",
    text: "deadpan. ambitious. soft heart under sharp UI. will fight a template for sport.",
    emotion: "smile",
    options: [
      { id: "fp1", label: "Are you actually cool?", nextDialogueId: "banter-cool" },
      { id: "fp2", label: "Why is this site so dramatic?", nextDialogueId: "banter-dramatic" },
      BACK,
    ],
  },
  {
    id: "fun-weird",
    text: "he'll spend forty minutes choosing between two nearly identical blacks. and he'll be right.",
    emotion: "smile",
    options: [
      { id: "fw1", label: "What's his vibe?", nextDialogueId: "design-vibe" },
      { id: "fw2", label: "okay impress me", nextDialogueId: "banter-impress" },
      BACK,
    ],
  },

  // ——— BANTER ———
  {
    id: "banter-hub",
    text: "oh we're doing this. okay.",
    emotion: "smile",
    options: [
      { id: "bh1", label: "Are you actually cool?", nextDialogueId: "banter-cool" },
      { id: "bh2", label: "You look suspicious", nextDialogueId: "banter-suspicious" },
      { id: "bh3", label: "Can I ask something stupid?", nextDialogueId: "banter-stupid" },
      { id: "bh4", label: "Rate my vibe", nextDialogueId: "banter-rate" },
    ],
  },
  {
    id: "banter-cool",
    text: "i'm a talking pixel in a hoodie. the bar was on the floor and i vaulted it.",
    emotion: "smile",
    options: MORE_BANTER,
  },
  {
    id: "banter-stop",
    text: "ask the commit history. it has trust issues.",
    emotion: "sleepy",
    options: MORE_BANTER,
  },
  {
    id: "banter-dramatic",
    text: "because subtlety is overrated and clouds look better when they mean something.",
    emotion: "smile",
    options: MORE_BANTER,
  },
  {
    id: "banter-serious",
    text: "only until someone clicks me. then it's open mic night.",
    emotion: "smile",
    options: MORE_BANTER,
  },
  {
    id: "banter-stupid",
    text: "please. stupid questions are my cardio.",
    emotion: "smile",
    options: MORE_BANTER,
  },
  {
    id: "banter-rate",
    text: "solid. curious. slightly chaotic. approved — conditionally.",
    emotion: "smile",
    options: MORE_BANTER,
  },
  {
    id: "banter-overdo",
    text: "overdoing it is the brand strategy. welcome.",
    emotion: "angry",
    options: MORE_BANTER,
  },
  {
    id: "banter-suspicious",
    text: "that's the glasses. and the personality. package deal.",
    emotion: "smile",
    options: MORE_BANTER,
  },
  {
    id: "banter-impress",
    text: "you opened a website and found a talking pixel guy. honestly, we're already doing pretty well.",
    emotion: "smile",
    options: MORE_BANTER,
  },
  {
    id: "banter-cute",
    text: "finally, someone with functioning vision.",
    emotion: "smile",
    options: MORE_BANTER,
  },
  {
    id: "banter-annoy",
    text: "and yet here you are.",
    emotion: "angry",
    options: MORE_BANTER,
  },
  {
    id: "banter-talkmuch",
    text: "only when people keep clicking me.",
    emotion: "angry",
    options: MORE_BANTER,
  },

  // ——— ambient / reaction (no tree options required) ———
  {
    id: "ambient-first-01",
    trigger: "firstVisit",
    text: "oh hey.",
    emotion: "smile",
    options: TOPICS,
  },
  {
    id: "ambient-first-02",
    trigger: "firstVisit",
    text: "you found me. dangerous.",
    emotion: "smile",
    options: TOPICS,
  },
  {
    id: "ambient-about-01",
    trigger: "aboutOpen",
    text: "home turf. behave.",
    emotion: "smile",
    options: TOPICS,
  },
  {
    id: "ambient-about-02",
    trigger: "aboutOpen",
    text: "about page energy. ambitious of you.",
    emotion: "smile",
    options: TOPICS,
  },
  {
    id: "ambient-hover-01",
    trigger: "hover",
    text: "careful. i bite… digitally.",
    emotion: "smile",
    options: TOPICS,
  },
  {
    id: "ambient-hover-02",
    trigger: "hover",
    text: "yes?",
    emotion: "sleepy",
    options: TOPICS,
  },
  {
    id: "ambient-return-01",
    trigger: "return",
    text: "oh, you're back.",
    emotion: "smile",
    options: TOPICS,
  },
  {
    id: "ambient-return-02",
    trigger: "return",
    text: "tab hoppers unite.",
    emotion: "smile",
    options: TOPICS,
  },
  {
    id: "ambient-idle-01",
    trigger: "longIdle",
    text: "bro… i was sleeping.",
    emotion: "sleepy",
    options: TOPICS,
  },
  {
    id: "ambient-idle-02",
    trigger: "longIdle",
    text: "five more minutes.",
    emotion: "sleepy",
    options: TOPICS,
  },
  {
    id: "ambient-idle-03",
    trigger: "longIdle",
    text: "why are we awake?",
    emotion: "sleepy",
    options: TOPICS,
  },
  {
    id: "ambient-rep-01",
    trigger: "repeatedClick",
    text: "bro, are we having a conversation or are you testing the button?",
    emotion: "angry",
    options: TOPICS,
  },
  {
    id: "ambient-rep-02",
    trigger: "repeatedClick",
    text: "okay… we get it.",
    emotion: "angry",
    options: [
      { id: "ar1", label: "just banter", nextDialogueId: "banter-hub" },
      BACK,
    ],
  },
  {
    id: "ambient-spam-01",
    trigger: "spamClick",
    text: "okay. you've officially broken the social contract.",
    emotion: "angry",
    options: [
      { id: "as1", label: "sorry", nextDialogueId: "banter-annoy" },
      BACK,
    ],
  },
  {
    id: "ambient-spam-02",
    trigger: "spamClick",
    text: "WHY ARE YOU STILL CLICKING ME?",
    emotion: "angry",
    options: TOPICS,
  },
  {
    id: "ambient-click-01",
    trigger: "click",
    text: "yo. what do you wanna know?",
    emotion: "smile",
    options: TOPICS,
  },
  {
    id: "ambient-click-02",
    trigger: "click",
    text: "oh hey.",
    emotion: "smile",
    options: TOPICS,
  },
  {
    id: "ambient-click-03",
    trigger: "click",
    text: "speak. or pick a topic. either works.",
    emotion: "smile",
    options: TOPICS,
  },
];

const BY_ID = new Map(PET_DIALOGUES.map((d) => [d.id, d]));

export function getDialogue(id: string): PetDialogue | undefined {
  return BY_ID.get(id);
}

export function pickDialogue(
  trigger: PetTrigger,
  usedIds: ReadonlySet<string>,
): PetDialogue {
  const pool = PET_DIALOGUES.filter((d) => d.trigger === trigger);
  if (pool.length === 0) {
    return BY_ID.get("root-hello")!;
  }
  const unused = pool.filter((d) => !usedIds.has(d.id));
  const source = unused.length > 0 ? unused : pool;
  return source[Math.floor(Math.random() * source.length)] ?? pool[0]!;
}

export function triggerFromClickCount(count: number): PetTrigger {
  if (count >= 6) return "spamClick";
  if (count >= 3) return "repeatedClick";
  return "click";
}
