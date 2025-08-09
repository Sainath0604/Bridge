import type { IconProps } from "../types";

export const BackIcon: React.FC<IconProps> = ({
  height = "1em",
  width = "1em",
  className,
}) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height={height}
      width={width}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M321.94 98 158.82 237.78a24 24 0 0 0 0 36.44L321.94 414c15.57 13.34 39.62 2.28 39.62-18.22v-279.6c0-20.5-24.05-31.56-39.62-18.18z"></path>
    </svg>
  );
};

export const SingleTickIcon: React.FC<IconProps> = ({
  height = "1em",
  width = "1em",
  className,
}) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height={height}
      width={width}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M416 128 192 384l-96-96"
      ></path>
    </svg>
  );
};

export const DoubleTickIcon: React.FC<IconProps> = ({
  height = "1em",
  width = "1em",
  className,
}) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height={height}
      width={width}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M464 128 240 384l-96-96m0 96-96-96m320-160L232 284"
      ></path>
    </svg>
  );
};
