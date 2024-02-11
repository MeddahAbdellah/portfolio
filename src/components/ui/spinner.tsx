import styles from "./spinner.module.css";

export function Spinner({
  style,
  className,
}: {
  style?: { "--portfolio-spinner-size": string };
  className?: string;
}): React.JSX.Element {
  return (
    <i style={style} className={`${styles.spinner} ${className ?? ""}`}></i>
  );
}
