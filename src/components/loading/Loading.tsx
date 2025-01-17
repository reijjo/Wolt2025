import "./Loading.css";

type LoadingProps = {
  loadingText?: string;
};

export const Loading = ({ loadingText = "Loading..." }: LoadingProps) => (
  <div className="loading">
    <span className="loader"></span>
    <p>{loadingText}</p>
  </div>
);
