/* BOOK LIST COMPONENT FILE */

// React Beautiful DND Component Imports
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';

// Shadcn Components Imports
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Components Imports
import { StrictModeDroppable } from './StrictModeDroppable';

// State Management Imports
import { appStore } from '@/store';

// Types Imports
import { Book } from '@/store';

import {
  GiBookPile,
  GiBookshelf,
  GiBookmarklet,
  GiBurningBook,
} from 'react-icons/gi';

import { BookSearch } from './BookSearch';

// book list component
export const BookList = () => {
  // destructure state variables and functions from the store
  const { books, removeBook, moveBook, reorderBooks } = appStore(
    (state) => state
  );

  // book item rendered in card component
  const renderBookItem = (
    book: Book,
    index: number,
    listType: Book['listType']
  ) => {
    return (
      <Card
        key={index}
        className='rounded none first:mt-0 first:rounded-t-lg last:rounded-b-lg'
      >
        <CardHeader>
          <CardTitle>{book.title}</CardTitle>
          <CardDescription>{book.author_name}</CardDescription>
        </CardHeader>

        <CardFooter className='flex justify-between'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='destructive' onClick={() => removeBook(book)}>
                <GiBurningBook className='size-5' />
              </Button>
            </TooltipTrigger>

            <TooltipContent>Delete from my reading list</TooltipContent>
          </Tooltip>

          <div className='inline-flex gap-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  onClick={() => moveBook(book, 'inProgress')}
                  disabled={listType === 'inProgress'}
                >
                  <GiBookmarklet className='size-4' />
                </Button>
              </TooltipTrigger>

              <TooltipContent>Mark as "Currently Reading"</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  onClick={() => moveBook(book, 'backlog')}
                  disabled={listType === 'backlog'}
                >
                  <GiBookPile className='size-5' />
                </Button>
              </TooltipTrigger>

              <TooltipContent>Mark as "For Later"</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  onClick={() => moveBook(book, 'done')}
                  disabled={listType === 'done'}
                >
                  <GiBookshelf className='size-5 pb-0.5' />
                </Button>
              </TooltipTrigger>

              <TooltipContent>Mark as "Done"</TooltipContent>
            </Tooltip>
          </div>
        </CardFooter>
      </Card>
    );
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const listType = result.source.droppableId as Book['listType'];

    reorderBooks(listType, sourceIndex, destinationIndex);
  };

  const renderDraggableBookList = (listType: Book['listType']) => {
    const filteredBooks = books.filter((book) => book.listType === listType);

    return (
      <StrictModeDroppable droppableId={listType}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {filteredBooks.map((book, index) => (
              <Draggable key={book.key} draggableId={book.key} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className='my-2'
                  >
                    <div {...provided.dragHandleProps}>
                      {renderBookItem(book, index, listType)}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    );
  };

  return (
    <div className='space-y-8 p-4'>
      <div className='flex gap-2 max-sm:flex-col sm:items-center sm:justify-between'>
        <h2 className='mb-4 text-2xl font-bold'>My Reading List</h2>
        <div className='h-full'>
          <BookSearch />
        </div>
      </div>

      {/* render books in progress list */}
      <h3 className='my-2 flex items-end gap-2 text-xl font-semibold'>
        Currently Reading
        <GiBookmarklet className='size-6' />
      </h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='rounded-lg border bg-muted p-4'>
          {books.filter((book) => book.listType === 'inProgress').length > 0 ? (
            <>{renderDraggableBookList('inProgress')}</>
          ) : (
            <div className='p-4'>
              <p className='text-primary'>A rolling stone gathers no moss.</p>
            </div>
          )}
        </div>
      </DragDropContext>

      {/* render books in backlog list */}
      <h3 className='my-2 flex items-end gap-2 text-xl font-semibold'>
        For Later <GiBookPile className='size-7' />
      </h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='rounded-lg border bg-muted p-4'>
          {books.filter((book) => book.listType === 'backlog').length > 0 ? (
            <>{renderDraggableBookList('backlog')}</>
          ) : (
            <div className='p-4'>
              <p className='text-primary'>
                Look before, or you'll find yourself behind.
              </p>
            </div>
          )}
        </div>
      </DragDropContext>

      {/* render books in done list */}
      <h3 className='my-2 flex items-end gap-2 text-xl font-semibold'>
        Done <GiBookshelf className='size-7 pb-0.5' />
      </h3>
      {books.filter((book) => book.listType === 'done').length > 0 ? (
        <>
          <div>
            {books
              .filter((book) => book.listType === 'done')
              .map((book, index) => renderBookItem(book, index, 'done'))}
          </div>
        </>
      ) : (
        <div className='p-4'>
          <p className='text-primary'>Well done is better than well said.</p>
        </div>
      )}
    </div>
  );
};
