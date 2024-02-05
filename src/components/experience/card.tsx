import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { experienceList } from "./experience-list";
import { Badge } from "../ui/badge";
import styles from "./card.module.css";

const nameClassNameMap: {
  [key in (typeof experienceList)[number]["name"]]: string;
} = {
  Citron: "citron",
  Padoa: "padoa",
  Ursum: "ursum",
  "Freelancer.com": "freelancerCom",
};

export function ExperienceCard({
  name,
}: {
  name: (typeof experienceList)[number]["name"];
}) {
  const experience = experienceList.find(
    (experience) => experience.name === name,
  );
  return (
    <a className="contents relative" href={experience?.website} target="_blank">
      <Card
        style={{
          gridArea: name
            .toLocaleLowerCase()
            .replace(" ", "-")
            .replace(".", "-"),
        }}
        className={`${styles[nameClassNameMap[name]]} ${styles.background} w-full flex flex-col cursor-pointer`}
      >
        <CardHeader>
          <CardTitle>{experience?.name}</CardTitle>
          <CardDescription>{experience?.jobTitle}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 px-6 h-full">
          {experience?.technologies?.map((technology) => (
            <Badge key={technology} className="mx-1" variant="secondary">
              {technology}
            </Badge>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between text-sm">
          <p>
            {experience?.workedTime} - {experience?.location}
          </p>
        </CardFooter>
      </Card>
    </a>
  );
}
