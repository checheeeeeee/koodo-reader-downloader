import BookModel from "../../../models/Book";

export interface BookListProps {
  books: BookModel[];
  deletedBooks: BookModel[];
  mode: string;
  selectedBooks: string[];
  isBookSort: boolean;
  isCollapsed: boolean;
  isSelectBook: boolean;

  viewMode: string;
  bookSortCode: { sort: number; order: number };
  noteSortCode: { sort: number; order: number };
  handleFetchList: () => void;
  handleMode: (mode: string) => void;
  handleDeleteDialog: (isShow: boolean) => void;
  handleFetchBooks: () => void;
}
export interface BookListState {
  isRefreshing: boolean;
}
