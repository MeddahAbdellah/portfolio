export type SkillType = 'front' | 'back' | 'fullstack';
export const skills = [
  {
    icon: "./angular.svg",
    name: "Angular",
    type: "front" as SkillType,
    url: "https://stackblitz.com/edit/stackblitz-starters-vsqw3r",
  },
  {
    icon: "./react.svg",
    name: "React",
    type: "front" as SkillType,
    url: "https://stackblitz.com/edit/stackblitz-starters-4wkctw",
  },
  {
    icon: "./react.svg",
    name: "React (My way)",
    type: "front" as SkillType,
    url: "https://stackblitz.com/edit/stackblitz-starters-kyrzpw",
  },
  {
    icon: "./svelte.svg",
    name: "Svelte",
    type: "front" as SkillType,
    url: "https://stackblitz.com/edit/typescript-fnpafza?file=index.ts",
  },
  {
    icon: "./solidjs.svg",
    name: "Solid",
    type: "front" as SkillType,
    url: "https://stackblitz.com/edit/typescript-fnpafqa?file=index.ts",
  },
  {
    icon: "./qwik.svg",
    name: "Qwik",
    type: "front" as SkillType,
    url: "https://stackblitz.com/edit/typescript-fnpafga?file=index.ts",
  },
  {
    icon: "./node.svg",
    name: "Node",
    type: "back" as SkillType,
    url: "https://stackblitz.com/edit/stackblitz-starters-vsqw333r",
  },
  {
    icon: "./nest.svg",
    name: "Nest",
    type: "back" as SkillType,
    url: "https://stackblitz.com/edit/stackblitz-starters-4wkcsstw",
  },

  {
    icon: "./rust.svg",
    name: "Rust",
    type: "back" as SkillType,
    url: "https://stackblitz.com/edit/typescript-fnpassfqa?file=index.ts",
  },
  {
    icon: "./python.svg",
    name: "Python",
    type: "back" as SkillType,
    url: "https://stackblitz.com/edit/typescript-fnpssafga?file=index.ts",
  },
  {
    icon: "./astro.svg",
    name: "Astro",
    type: "fullstack" as SkillType,
    url: "https://stackblitz.com/edit/typescript-fnpafgaqdqza?file=index.ts",
  },
  {
    icon: "./next.svg",
    name: "Next",
    type: "fullstack" as SkillType,
    url: "https://stackblitz.com/edit/typescript-fnpafgaza?file=index.ts",
  }
] as const;