import BookModel from "../../../models/Book";
import BookmarkModel from "../../../models/Bookmark";
import NoteModel from "../../../models/Note";

export interface CardListProps {
  currentBook: BookModel;
  bookmarks: BookmarkModel[];
  chapters: any;
  books: BookModel[];
  cards: NoteModel[];
  mode: string;
  isCollapsed: boolean;
  noteSortCode: { sort: number; order: number };
  handleReadingBook: (currentBook: BookModel) => void;
  handleNoteKey: (noteKey: string) => void;
  t: (title: string) => string;
  handleShowPopupNote: (isShowPopupNote: boolean) => void;
}
export interface CardListStates {
  displayedCards: NoteModel[];
  currentPage: number;
  itemsPerPage: number;
  isLoading: boolean;
}
