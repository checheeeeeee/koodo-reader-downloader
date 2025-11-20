export interface RedirectProps {
  handleLoadingDialog: (isShowLoading: boolean) => void;
  t: (title: string) => string;
  history: any;
}

export interface RedirectState {
  isAuthed: boolean;
  isError: boolean;
  token: string;
}
