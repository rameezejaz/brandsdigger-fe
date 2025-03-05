// src/App.tsx
import React from 'react';
import Chat from './components/Chat';
import 'bootstrap/dist/css/bootstrap.min.css';  // Importing Bootstrap CSS
import styles from './styles/App.module.css';  // Importing App-level module CSS

const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <header className="bg-dark text-white p-4">
        <h1>Welcome to BrandsDigger</h1>
      </header>
      <main>
        <Chat />
      </main>
    </div>
  );
};

export default App;
