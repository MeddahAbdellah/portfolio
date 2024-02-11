import { text } from "./code-sample.json";

export function codeShuffleGeneratorFn(
  offset = 200,
  lengthOfShownText = 30000,
) {
  const codeSample = text.repeat(10);
  let index = 0;
  return () => {
    index =
      Math.floor(Math.random() * (codeSample.length - lengthOfShownText)) +
      offset;
    return codeSample
      .split("")
      .slice(index, index + lengthOfShownText)
      .join("");
  };
}
