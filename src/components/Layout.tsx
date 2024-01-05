/* LAYOUT COMPONENT FILE */

// Styles Imports
import '@/components/Layout.css';

// Components Imports
import Navbar from '@/components/Navbar';

// layout component
export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='layout'>
      <Navbar className='layout__navbar' />

      <main className='layout__main'>
        <div className='layout__content'>{children}</div>
      </main>
    </div>
  );
};
