/* MAIN APP COMPONENT FILE */

// Dependencies and their Functions Imports
import { useEffect } from 'react';

// Shadcn Components Imports
import { TooltipProvider } from '@/components/ui/tooltip';

// Components Imports
import { BookList } from '@/components/BookList';
import { Layout } from '@/components/Layout';

// State Management Imports
import { appStore } from '@/store';

// default exported component
const App = () => {
  const { loadBooksFromLocalStorage } = appStore((state) => state);

  useEffect(() => {
    loadBooksFromLocalStorage();
  }, [loadBooksFromLocalStorage]);

  return (
    <Layout>
      <TooltipProvider>
        <BookList />
      </TooltipProvider>
    </Layout>
  );
};

export default App;
