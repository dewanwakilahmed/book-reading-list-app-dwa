/* BOOK SEARCH COMPONENT FILE */

// Dependencies and their Functions Imports
import axios from 'axios';
import { useState } from 'react';

// React Icons Imports
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { SlArrowRight, SlArrowLeft } from 'react-icons/sl';

// Shadcn Components Imports
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

// Custom Hooks Imports
import { useMediaQuery } from '@/hooks/useMediaQuery';

// State Management Imports
import { appStore } from '@/store';

// Types Imports
import { Book } from '@/store';
import { GiBookPile } from 'react-icons/gi';

// book search component
export const BookSearch = () => {
  // destructure state variables and functions from the store
  const { books, addBook } = appStore((state) => state);

  // initialize the state and other variables
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 100;

  // define the SearchResult type
  type SearchResult = {
    docs: any[];
    numFound: number;
  };

  // define the searchBooks function for searching books from the OpenLibrary API
  const searchBooks = async (page: number = 1) => {
    if (!query) return;

    setIsLoading(true);

    try {
      const response = await axios.get<SearchResult>(
        `https://openlibrary.org/search.json?q=${query}&page=${page}&limit=${resultsPerPage}`
      );

      setResults(response.data.docs);
      setTotalResults(response.data.numFound);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching OpenLibrary API data', error);
    }

    setIsLoading(false);
  };

  // define the handleKeyPress function for calling book search function on pressing 'Enter Key'
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      searchBooks();
    }
  };

  // define the handlePreviousClick function for loading the previous page of book search results
  const handlePreviousClick = () => {
    if (currentPage > 1) {
      searchBooks(currentPage - 1);
    }
  };

  // define the handleNextClick function for loading the next page of book search results
  const handleNextClick = () => {
    if (currentPage < Math.ceil(totalResults / resultsPerPage)) {
      searchBooks(currentPage + 1);
    }
  };

  // define variables for keeping track of the start and end index of a certain page search results
  const startIndex = (currentPage - 1) * resultsPerPage + 1;
  const endIndex = Math.min(startIndex + resultsPerPage - 1, totalResults);

  const SearchInput = (
    <div className='flex flex-col items-center gap-3 px-4 py-3 sm:flex-row'>
      <div className='relative w-full sm:max-w-xs'>
        <Input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder='Search your next book!'
        />
      </div>

      <Button
        className='max-sm:w-full sm:max-w-xs'
        onClick={() => searchBooks()}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <AiOutlineLoading3Quarters className='mr-2 h-4 w-4 animate-spin' />
            Searching...
          </>
        ) : (
          'Search'
        )}
      </Button>
    </div>
  );

  const SearchResults = (
    <div className='block max-h-[200px] overflow-y-auto sm:max-h-[300px] [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 [&::-webkit-scrollbar-track:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-slate-700 [&::-webkit-scrollbar]:w-2'>
      {query.length > 0 && results.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className='hidden sm:table-cell'>Year</TableHead>
              <TableHead className='hidden sm:table-cell'>Page Count</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className='overflow-y-auto'>
            {results.map((book, index) => (
              <TableRow key={index}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author_name}</TableCell>
                <TableCell className='hidden sm:table-cell'>
                  {book.first_publish_year}
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  {book.number_of_pages_median || '-'}
                </TableCell>
                <TableCell>
                  <Button
                    variant='secondary'
                    onClick={() => {
                      addBook({
                        ...book,
                        listType: 'backlog',
                      });
                    }}
                    disabled={books.some((b) => b.key === book.key)}
                  >
                    <GiBookPile className='size-5' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className='flex max-h-60 items-center justify-center p-16'>
          <p className='text-gray-600 dark:text-gray-400'>Start your search!</p>
        </div>
      )}
    </div>
  );

  const SearchPagination = (
    <div className='flex w-full flex-col items-center gap-3 border-t px-6 py-4 sm:flex-row sm:justify-between'>
      <div>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {totalResults > 0 ? (
            <>
              Showing{' '}
              <span className='font-semibold text-gray-800 dark:text-gray-200'>
                {startIndex} - {endIndex}
              </span>{' '}
              out of{' '}
              <span className='font-semibold text-gray-800 dark:text-gray-200'>
                {totalResults}
              </span>{' '}
              results
            </>
          ) : (
            '0 results'
          )}
        </p>
      </div>
      <div className='inline-flex gap-2'>
        <Button
          variant='outline'
          onClick={handlePreviousClick}
          disabled={currentPage <= 1 || isLoading}
        >
          <SlArrowLeft className='size-4' />
        </Button>

        <Button
          variant='outline'
          onClick={handleNextClick}
          disabled={
            currentPage >= Math.ceil(totalResults / resultsPerPage) || isLoading
          }
        >
          <SlArrowRight className='size-4' />
        </Button>
      </div>
    </div>
  );

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline'>Add a new book</Button>
        </DialogTrigger>

        <DialogContent className='sm:max-w-xl'>
          <DialogHeader>
            <DialogTitle>Add a new book</DialogTitle>
            <DialogDescription>
              Search for a book by title, author, or ISBN.
            </DialogDescription>
            {SearchInput}
          </DialogHeader>

          {SearchResults}
          {SearchPagination}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='outline'>Add a new book</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Add a new book</DrawerTitle>
          <DrawerDescription>Search</DrawerDescription>
          {SearchInput}
        </DrawerHeader>

        {SearchResults}

        <DrawerFooter>{SearchPagination}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
