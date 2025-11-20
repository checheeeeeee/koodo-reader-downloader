import BookModel from "../../models/Book";
import NoteModel from "../../models/Note";

export interface BookListProps {
  books: BookModel[];
  notes: NoteModel[];
  shelfTitle: string;
  deletedBooks: BookModel[];
  searchResults: number[];
  isSelectBook: boolean;
  isSearch: boolean;
  isCollapsed: boolean;
  selectedBooks: string[];
  handleAddDialog: (isShow: boolean) => void;
  t: (title: string) => string;
  handleDeleteDialog: (isShow: boolean) => void;
  handleSelectBook: (isSelectBook: boolean) => void;
  handleSelectedBooks: (selectedBooks: string[]) => void;
}
export interface BookListState {
  isShowExport: boolean;
  isOpenDelete: boolean;
  favoriteBooks: number;
}
