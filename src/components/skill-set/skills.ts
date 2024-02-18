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
    icon: "./solidjs.svg",
    name: "Solid",
    type: "front" as SkillType,
    url: "https://codesandbox.io/p/devbox/portfolio-solidjs-for-a-more-detailed-view-press-shift-command-a-mgl2cp?file=%2Fsrc%2FApp.tsx%3A39%2C1",
  },
  // {
  //   icon: "./svelte.svg",
  //   name: "Svelte",
  //   type: "front" as SkillType,
  //   url: "https://svelte.dev/repl/0e74345bb09748db84342fd317cd8eba?version=4.2.11",
  // },
  {
    icon: "./qwik.svg",
    name: "Qwik",
    type: "fullstack" as SkillType,
    url: "https://codesandbox.io/p/devbox/portfolio-qwik-2rwk2f?embed=1&file=%2Fsrc%2Fapp.tsx",
  },
  {
    icon: "./node.svg",
    name: "Node",
    type: "back" as SkillType,
    url: "https://codesandbox.io/p/devbox/portfolio-nodejs-35y97d?embed=1&file=%2Findex.js",
  },
  {
    icon: "./nest.svg",
    name: "Nest",
    type: "back" as SkillType,
    url: "https://codesandbox.io/p/devbox/portfolio-nestjs-fxxzct?embed=1&file=%2Fsrc%2Fapp.controller.ts",
  },

  {
    icon: "./rust.svg",
    name: "Rust",
    type: "back" as SkillType,
    url: "https://codesandbox.io/p/devbox/portfolio-rust-j7xz55?embed=1&file=%2Fsrc%2Fmain.rs",
  },
  {
    icon: "./python.svg",
    name: "Python",
    type: "back" as SkillType,
    url: "https://codesandbox.io/p/devbox/portfolio-python-qmllml?embed=1&file=%2Fmain.py",
  },
  {
    icon: "./astro.svg",
    name: "Astro",
    type: "fullstack" as SkillType,
    url: "https://meddahabdallah.pro",
  },
  {
    icon: "./next.svg",
    name: "Next",
    type: "fullstack" as SkillType,
    url: "https://codesandbox.io/p/devbox/portfolio-nextjs-vscymz?embed=1&file=%2Fapp%2Fpage.tsx",
  }
] as const;