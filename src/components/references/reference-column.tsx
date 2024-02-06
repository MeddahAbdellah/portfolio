import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type references from "../../../public/references.json";

export function ReferenceColumn({
  referenceColumn,
}: {
  referenceColumn: typeof references;
}) {
  return (
    <div className="flex flex-col gap-4 min-w-[300px] flex-1">
      {referenceColumn.map((reference) => {
        return (
          <Card className="referenceCard duration-300 w-full h-fit flex flex-col cursor-pointer rounded">
            <CardHeader>
              <img
                className="w-full object-fit"
                src={reference.profilePic}
              ></img>
            </CardHeader>
            <CardContent className="p-0 px-6 h-full">
              <CardTitle className="text-lg">{reference.name}</CardTitle>
              <CardDescription className="text-sm">
                {reference.jobTitle}
              </CardDescription>
              <p className="text">{reference.review}</p>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        );
      })}
    </div>
  );
}