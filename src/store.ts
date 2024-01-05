/* CLIENT STATE MANAGEMENT FILE */

// Dependencies and their Functions Imports
import { create } from 'zustand';

// define Book type
export type Book = {
  key: string;
  title: string;
  author_name: string[];
  first_publish_year: number;
  number_of_pages_median: number | null;
  listType: 'done' | 'inProgress' | 'backlog';
};

// define BookState interface
interface BookState {
  books: Book[];
}

// define BookStore interface
interface BookStore extends BookState {
  addBook: (newBook: Book) => void;
  removeBook: (bookToRemove: Book) => void;
  moveBook: (bookToMove: Book, newListType: Book['listType']) => void;
  loadBooksFromLocalStorage: () => void;
  reorderBooks: (
    listType: Book['listType'],
    initialIndex: number,
    newIndex: number
  ) => void;
}

// initialBooks books array
const initialBooks: Book[] = [
  {
    key: '/works/OL262758W',
    title: 'The Hobbit',
    author_name: ['J.R.R Tolkien'],
    first_publish_year: 1937,
    number_of_pages_median: 312,
    listType: 'inProgress',
  },
  {
    key: '/works/OL82548W',
    title: 'Harry Potter and the Order of the Phoenix',
    author_name: ['J. K. Rowling'],
    first_publish_year: 2003,
    number_of_pages_median: 893,
    listType: 'inProgress',
  },
  {
    key: '/works/OL14933414W',
    title: 'The Fellowship of the Ring',
    author_name: ['J.R.R Tolkien'],
    first_publish_year: 1954,
    number_of_pages_median: 496,
    listType: 'backlog',
  },
  {
    key: '/works/OL27479W',
    title: 'The Two Towers',
    author_name: ['J.R.R Tolkien'],
    first_publish_year: 1954,
    number_of_pages_median: 440,
    listType: 'backlog',
  },
  {
    key: '/works/OL27516W',
    title: 'The Return of the King',
    author_name: ['J.R.R Tolkien'],
    first_publish_year: 1950,
    number_of_pages_median: 482,
    listType: 'backlog',
  },
  {
    key: '/works/OL8324629W',
    title: 'The Ethnic Cleansing of Palestine',
    author_name: ['Ilan Pappe', 'Luis Noriega'],
    first_publish_year: 2006,
    number_of_pages_median: 320,
    listType: 'done',
  },
  {
    key: '/works/OL2733666W',
    title: 'The Holocaust Industry',
    author_name: ['Norman G Finkelstein'],
    first_publish_year: 2000,
    number_of_pages_median: 203,
    listType: 'done',
  },
];

// create and export appStore store
export const appStore = create<BookStore>((set) => ({
  // books array
  books: [],

  // function to add a new book to the books array
  addBook: (newBook) =>
    set((state: BookState) => {
      const updatedBooks: Book[] = [
        ...state.books,
        {
          key: newBook.key,
          title: newBook.title,
          author_name: newBook.author_name,
          first_publish_year: newBook.first_publish_year,
          number_of_pages_median: newBook.number_of_pages_median || null,
          listType: newBook.listType || 'backlog',
        },
      ];

      localStorage.setItem('readingList', JSON.stringify(updatedBooks));
      return { books: updatedBooks };
    }),

  // function to remove a book from the books array
  removeBook: (bookToRemove) =>
    set((state: BookState) => {
      if (window.confirm('Are you sure you want to remove this book?')) {
        const updatedBooks = state.books.filter(
          (book) => book.key !== bookToRemove.key
        );

        localStorage.setItem('readingList', JSON.stringify(updatedBooks));
        return { books: updatedBooks };
      }

      return state;
    }),

  // function to move a book from one list to another
  moveBook: (bookToMove, newListType) =>
    set((state: BookState) => {
      const updatedBooks: Book[] = state.books.map((book) =>
        book.key === bookToMove.key ? { ...book, listType: newListType } : book
      );

      localStorage.setItem('readingList', JSON.stringify(updatedBooks));
      return { books: updatedBooks };
    }),

  // function to reorder books by drag and drop
  reorderBooks: (listType, initialIndex, newIndex) =>
    set((state: BookState) => {
      const filteredBooks = state.books.filter(
        (book) => book.listType === listType
      );

      const [reorderedBook] = filteredBooks.splice(initialIndex, 1);

      filteredBooks.splice(newIndex, 0, reorderedBook);

      const updatedBooks = state.books.map((book) =>
        book.listType === listType ? filteredBooks.shift() || book : book
      );

      localStorage.setItem('readingList', JSON.stringify(updatedBooks));
      return { books: updatedBooks };
    }),

  // function to load books from local storage to books array
  loadBooksFromLocalStorage: () => {
    const storedBooks = localStorage.getItem('readingList');

    if (storedBooks) {
      set({
        books: JSON.parse(storedBooks),
      });
    } else {
      set({
        books: initialBooks,
      });
    }
  },
}));
