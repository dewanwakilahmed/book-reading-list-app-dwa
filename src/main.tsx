/* REACT MAIN ENTRY POINT FILE */

// Dependencies Imports
import React from 'react';
import ReactDOM from 'react-dom/client';

// Components Imports
import App from './App.tsx';

// Styles Imports
import './index.css';

// Create React Root to Render the App
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
