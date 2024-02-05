import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import styles from "./experience.module.css";
import { experienceList as experience } from "./experience-list";

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
      className={`${props.selected ? "bg-accent" : "bg-background"} hover:bg-accent w-full text-left p-8 cursor-pointer transition-all rounded-lg`}
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
  const [selectedCompany, setSelectedCompany] = useState<string>(
    experience[0].name,
  );
  return (
    <section
      id="xp"
      className="h-full w-dvw flex p-8 snap-start snap-always gap-4"
    >
      <div className="w-1/3 flex flex-col gap-4 p-4 border border-solid border-zinc-600 rounded-lg">
        <h2 className="text-3xl font-bold ml-4">Experience</h2>
        {experience.map((experience) => {
          return (
            <Tab
              key={experience.name}
              title={experience.jobTitle}
              company={experience.name}
              dateInterval={experience.workedTime}
              location={experience.location}
              selected={selectedCompany === experience.name}
              onClick={() => {
                setSelectedCompany(experience.name);
              }}
            ></Tab>
          );
        })}
      </div>
      <div className={`${styles.changelog} w-2/3 flex flex-col`}>
        <h2 className="text-2xl font-bold mb-4">Changelog since I arrived</h2>

        <ul className="flex flex-col">
          {experience
            .find((experience) => experience.name === selectedCompany)
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
          {experience
            .find((experience) => experience.name === selectedCompany)
            ?.technologies?.map((technologie) => (
              <Badge key={technologie}>{technologie}</Badge>
            ))}
        </div>
      </div>
    </section>
  );
}
