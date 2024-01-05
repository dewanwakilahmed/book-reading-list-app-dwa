/* NAVBAR COMPONENT FILE */

// Styles Imports
import '@/components/Navbar.css';

// Custom Hook Imports
import { useTheme } from '@/hooks/useTheme';

// React Icon Imports
import { GiSpellBook } from 'react-icons/gi';
import { SiGithub, SiYoutube } from 'react-icons/si';
import { HiMiniMoon, HiMiniSun } from 'react-icons/hi2';

// theme toggle button sub-component
const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button className='theme-toggle-btn' onClick={() => toggleDarkMode()}>
      {isDarkMode ? (
        <HiMiniMoon className='theme-toggle-btn--dark' />
      ) : (
        <HiMiniSun className='theme-toggle-btn--light' />
      )}
    </button>
  );
};

// navbar component
const Navbar = () => {
  return (
    <header className='navbar'>
      <div className='navbar__container'>
        <div className='navbar__content'>
          <div className='navbar__row'>
            <div className='navbar__start'>
              <a href='/' className='navbar__link'>
                <GiSpellBook className='size-full' />
              </a>
            </div>

            <div className='flex flex-1 items-center justify-end'>
              <nav className='flex items-center space-x-1'>
                <ThemeToggle />

                <a
                  href=''
                  target='_blank'
                  className='text-primary size-10 p-2 hover:text-[#ff0000] dark:hover:text-[#ff0000]'
                >
                  <SiYoutube className='h-full w-full' />
                </a>

                <a
                  href=''
                  target='_blank'
                  className='text-primary size-10 p-2 hover:text-[#4078c0] dark:hover:text-[#4078c0]'
                >
                  <SiGithub className='h-full w-full' />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
