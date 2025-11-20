export interface EmptyPageProps {
  mode: string;
  isCollapsed: boolean;
  isSelectBook: boolean;
  shelfTitle: string;
  handleShelf: (shelfTitle: string) => void;
  handleMode: (mode: string) => void;
}
export interface EmptyPageState {
  isOpenDelete: boolean;
}
