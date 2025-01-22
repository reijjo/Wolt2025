import "./Loading.css";

import { HTMLAttributes } from "react";

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  loadingText?: string;
}

export const Loading = ({
  loadingText = "Loading...",
  ...props
}: LoadingProps) => (
  <div className="loading" {...props}>
    <span className="loader"></span>
    <h2>{loadingText}</h2>
  </div>
);
