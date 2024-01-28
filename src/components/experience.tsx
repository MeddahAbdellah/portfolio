import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import styles from "./experience.module.css";

const companies = [
  {
    name: "Citron",
    location: "Paris",
    workedTime: "April 2023 - Present",
    jobTitle: "Lead Frontend Engineer",
    website: "https://citron.io/",
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
      "PostreSQL",
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
    name: "Art-IA Engineering",
    location: "Tallinn",
    jobTitle: "Embedded Systems Engineer",
    workedTime: "August 2018 - March 2020",
    missions: [
      "✨ Developed an Android/IOS application to tune and control over MQTT the developped ESP32-based Data Logger and actuator.",
      "✨ Developed a web application to visualize the data collected by the Data Logger and control the actuators.",
      "✨ Worked on the backend of the web application to improve the performance of the application.",
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
] as const;

function Tab(props: {
  title: string;
  company: string;
  dateInterval: string;
  location: string;
  selected: boolean;
  onClick: (company: string) => void;
}) {
  return (
    <div
      className={`bg-background ${props.selected ? "bg-accent" : ""} hover:bg-accent w-full text-left p-8 cursor-pointer transition-all rounded-lg`}
      onClick={() => props.onClick(props.company)}
    >
      <h3 className="text-xl font-bold">{props.title}</h3>
      <p className="text-md font-regular text-zinc-300">{props.company}</p>
      <p className="text-sm text-zinc-500">
        {props.dateInterval} | {props.location}
      </p>
    </div>
  );
}

export function Experience(): React.JSX.Element {
  // Make This Navigation Based
  const [selectedCompany, setSelectedCompany] = useState<string>(
    companies[0].name,
  );
  return (
    <section className="h-full w-dvw flex p-8 snap-start gap-4">
      <div className="w-1/3 flex flex-col gap-4 p-4 border border-solid border-zinc-600 rounded-lg">
        <h2 className="text-3xl font-bold ml-4">Experience</h2>
        {companies.map((company) => {
          return (
            <Tab
              key={company.name}
              title={company.jobTitle}
              company={company.name}
              dateInterval={company.workedTime}
              location={company.location}
              selected={selectedCompany === company.name}
              onClick={() => {
                setSelectedCompany(company.name);
              }}
            ></Tab>
          );
        })}
      </div>
      <div className={`${styles.changelog} w-2/3 flex flex-col`}>
        <h2 className="text-2xl font-bold mb-4">Changelog since I arrived</h2>

        <ul className="flex flex-col">
          {companies
            .find((company) => company.name === selectedCompany)
            ?.missions?.map((mission) => (
              <li
                key={mission}
                className="text-zinc-100 p-2 rounded-lg transition-all"
              >
                {mission}
              </li>
            ))}
        </ul>
        <div className="flex flex-wrap gap-2 pb-8 mt-auto">
          {companies
            .find((company) => company.name === selectedCompany)
            ?.technologies?.map((technologie) => (
              <Badge key={technologie}>{technologie}</Badge>
            ))}
        </div>
      </div>
    </section>
  );
}
