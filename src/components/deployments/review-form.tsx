import {
  type Dispatch,
  type FC,
  type MutableRefObject,
  type SetStateAction,
  useRef,
  useState,
} from "react";
import {
  useForm,
  type FieldErrors,
  type UseFormSetError,
} from "react-hook-form";
import { getByPath } from "./get-by-path";

import { Spinner } from "../ui/spinner";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      resolve(e.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}

function toError(errors: FieldErrors<CreatePrForm>): string {
  if (!errors) return "";
  return [
    "name",
    "jobTitle",
    "review",
    "file",
    "root.tooManyRequests",
    "root.serverError",
  ]
    .map((key) => {
      const error = getByPath(errors, key);
      if (error && !("message" in error)) {
        return;
      }
      return error?.message || undefined;
    })
    .filter((error): error is string => !!error)
    .at(0) as string;
}

function onSubmit(
  setError: UseFormSetError<CreatePrForm>,
  setPrUrl: Dispatch<SetStateAction<string>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
): (formData: CreatePrForm) => Promise<void> {
  return (formData: Required<CreatePrForm>): Promise<void> => {
    setLoading(true);
    return toBase64(formData.file[0] as File)
      .then((base64File) =>
        fetch("https://www.meddahabdallah.pro/api/review", {
          method: "POST",
          body: JSON.stringify({ ...formData, profilePic: base64File }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            setLoading(false);
            if (res.status === 429) {
              setError("root.tooManyRequests", {
                message: "Too many reviews from the same user",
              });
            }
            return res;
          })
          .catch(() => {
            setLoading(false);
            setError("root.serverError", {
              message: "Something went wrong",
            });
          }),
      )
      .then((res) => (res ? res.json() : null))
      .then((res) => {
        setPrUrl(res?.prUrl);
      });
  };
}

function onFileButtonClicked(
  fileInputRef: MutableRefObject<HTMLInputElement | null>,
): () => void {
  return () => {
    fileInputRef.current?.click();
  };
}

export const ReviewForm: FC = () => {
  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreatePrForm>();
  const [prUrl, setPrUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * We want to trigger a file input open on another button click event
   * Thus it is necessary to get the fileInput ref and give to both
   * regiter function of the form, and to the button
   */
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { ref, ...filtInputRegistration } = register("file", {
    required: "Profile picture is missing",
  });

  return (
    <>
      {prUrl ? (
        <Card className="w-2/5 mt-4 mb-[68px] max-h-96 overflow-auto flex flex-col justify-center">
          <CardContent className="text-sm text-center">
            PR submitted successfuly 🎉 <br />
            <a className="text-emerald-300" href={prUrl} target="_blank">
              Click here to see it
            </a>
          </CardContent>
        </Card>
      ) : (
        <form
          className="contents"
          onSubmit={handleSubmit(onSubmit(setError, setPrUrl, setLoading))}
        >
          <Card className="w-2/5 mt-4 mb-[68px] max-h-96 overflow-auto">
            <CardHeader>
              <h2>Leave a review</h2>
              <p className="text-xs">
                The review will be published on the website
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <fieldset className="flex gap-2">
                <fieldset className="w-full">
                  <Input
                    type="text"
                    placeholder="Name"
                    {...register("name", { required: "Name is missing" })}
                  />
                </fieldset>
                <fieldset className="w-full">
                  <Input
                    type="text"
                    placeholder="Job Title"
                    {...register("jobTitle", {
                      required: "Job Title profile is missing",
                    })}
                  />
                </fieldset>
              </fieldset>
              <Button
                variant={"outline"}
                className="w-full h-fit text-balance"
                type="button"
                onClick={onFileButtonClicked(fileInputRef)}
              >
                {watch().file?.[0]?.name ?? "Upload a picture file"}
              </Button>
              <input
                className="hidden"
                {...filtInputRegistration}
                ref={(inputRef) => {
                  ref(inputRef);
                  fileInputRef.current = inputRef;
                }}
                type="file"
              />
              <fieldset>
                <Textarea
                  placeholder="Leave a review here..."
                  {...register("review", { required: "Review is missing" })}
                />
              </fieldset>
            </CardContent>
            <CardFooter className="flex justify-between">
              <span>{toError(errors)}</span>
              <Button variant="outline" type="submit">
                {loading ? <Spinner /> : "Envoyer"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </>
  );
};

interface CreatePrForm {
  name: string;
  jobTitle: string;
  review: string;
  file: File[];
}
