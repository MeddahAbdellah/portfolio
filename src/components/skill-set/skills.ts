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
    url: "https://stackblitz.com/edit/vitejs-vite-gncvwa",
  },
  {
    icon: "./solidjs.svg",
    name: "Solid",
    type: "front" as SkillType,
    url: "https://stackblitz.com/edit/solidjs-templates-m7tz2r",
  },
  {
    icon: "./qwik.svg",
    name: "Qwik",
    type: "fullstack" as SkillType,
    url: "https://stackblitz.com/edit/qwik-starter-etwwhh",
  },
  {
    icon: "./node.svg",
    name: "Node",
    type: "back" as SkillType,
    url: "https://replit.com/@meddahabdellahs/Nodejs-portfolio?embed=true",
  },
  {
    icon: "./nest.svg",
    name: "Nest",
    type: "back" as SkillType,
    url: "https://stackblitz.com/edit/stackblitz-starters-k7zt3f",
  },

  {
    icon: "./rust.svg",
    name: "Rust",
    type: "back" as SkillType,
    url: "https://replit.com/@meddahabdellahs/Rust-portfolio?embed=true",
  },
  {
    icon: "./python.svg",
    name: "Python",
    type: "back" as SkillType,
    url: "https://replit.com/@meddahabdellahs/Python-portfolio?embed=true",
  },
  {
    icon: "./astro.svg",
    name: "Astro",
    type: "fullstack" as SkillType,
    url: "https://stackblitz.com/edit/typescript-fnpafgaqdqza",
  },
  {
    icon: "./next.svg",
    name: "Next",
    type: "fullstack" as SkillType,
    url: "https://stackblitz.com/edit/typescript-fnpafgaza",
  }
] as const;