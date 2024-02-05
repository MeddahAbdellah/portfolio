export const experienceList = [
  {
    name: "Citron",
    location: "Paris",
    workedTime: "April 2023 - Present",
    jobTitle: "Lead Frontend Engineer",
    website: "https://citron.io/",
    role: "Leader tasks",
    missions: [
      "✨ Improved overall app state management, through the use of Ngrx and Rxjs.",
      "✅ Added CI/CD pipe to the project to test, build, and lint each PR of the project.",
      "🏛 Coached the team on typescript to improve the typing of the codebase.",
      "🏛 Coached the team on declarative code and reactive code in Angular.",
      "⬆️ Upgraded Angular to version 16 and coached the team on functional programming.",
      "👬 Improved the tech team's Jira workflows and helped provide tools for the QA through Jira integrations.",
      "🚀 Added a stack deployment functionality in the CI/CD pipeline for any PR in order to enable manual testing before the merge.",
      "🎨 Put in place a Design-system and a storybook in collaboration with the UX/UI team.",
      "✨ Lead many feature projects to fruition.",
    ],
    technologies: [
      "Angular",
      "React",
      "Ngrx",
      "Cypress",
      "Github actions",
      "Mango",
      "Docker",
      "Figma",
      "NodeJs",
      "NestJs",
      "Jira",
      "Swagger",
      "Aws",
      "Terraform",
    ],
  },
  {
    name: "Padoa",
    location: "Paris",
    workedTime: "March 2020 - March 2023",
    jobTitle: "Fullstack Developer",
    website: "https://padoa.fr/",
    role: "Senior Dev tasks",
    missions: [
      "✨ Developed an online consultation room.",
      "🚀 Lead user stories from creation to completion by dividing them into small, well analyzed and described tasks.",
      "✨ Connected multiple devices to the application.",
      "✨ Developed an Employee portal.",
      "✨ Developed a PWA and deployed it to chromebooks and IPads trough MDMs.",
      "✨ Integrated Government APIs for identity verification.",
      "✨ Integrated Connected Health APIs for medical data.",
    ],
    technologies: [
      "Angular",
      "Ngrx",
      "Cypress",
      "Github actions",
      "PostgreSQL",
      "Docker",
      "Figma",
      "NodeJs",
      "C#",
      "Notion",
      "Swagger",
      "Elastic search",
      "scss",
    ],
  },

  {
    name: "Ursum",
    location: "Tallinn",
    jobTitle: "Embedded Systems Engineer",
    workedTime: "2018 - March 2019",
    website: "https://ursum.ee/",
    role: "Junior Dev tasks",
    missions: [
      "🚀 AWS server setup to host an MQTT broker using MQTT and WebSockets, and a web application as an admin panel",
      "🎨 Developed an Android/IOS application to tune and control over MQTT of the actuator.",
      "✨ Implementation of the MQTT protocol to manage high data rates needed for closed-loop control system",
      "🎨 Developed a web application to visualize the data collected by the Data Logger and control the actuators.",
      "✨ Designed and implemented a Data Logger based on ESP32 and an actuator for a machine",
    ],
    technologies: [
      "ESP32",
      "Multi-threading",
      "C/C++",
      "NodeJs",
      "AWS",
      "Phonegap",
    ],
  },
  {
    name: "Freelancer.com",
    location: "Worldwide",
    jobTitle: "Embedded Systems Engineer/Fullstack Developer",
    workedTime: "2018 - 2020",
    role: "Versatile Dev tasks",
    website: "https://www.freelancer.com/u/MeddahAbdellah",
    missions: [
      "✨ Developed an Android/IOS application to tune and control over MQTT the developed ESP32-based Data Logger and actuator.",
      "✨ Developed a web application to visualize the data collected by the Data Logger and control the actuators.",
      "✨ Worked on the backend of the web application to improve the performance of the application.",
    ],
    technologies: [
      "ESP32",
      "Multi-threading",
      "C/C++",
      "NodeJs",
      "AWS",
      "jQuery",
      "Phonegap",
    ],
  }
] as const;
