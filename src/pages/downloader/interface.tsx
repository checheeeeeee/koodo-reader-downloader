import { RouteComponentProps } from "react-router-dom";

export interface DownloaderRouteParams {
  electronicBookId: string;
  format?: string;
  name?: string;
}

export interface DownloaderProps extends RouteComponentProps<DownloaderRouteParams> {}

export interface DownloaderState {
  status: "idle" | "loading" | "error";
  message?: string;
}