import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EntryForm from './components/EntryForm';
import Dashboard from './components/Dashboard';
import KidsData from './components/KidsData';
import { KidsProvider } from './context/KidsContext';

import './App.css';

function App() {
  return (
    <KidsProvider>
      <Router>
        <div className="App">
          <header className="app-header">
              <h1>Astro Jumping Park</h1>
          </header>
          <nav className="navigation">
            <Link to="/" className="nav-link">Registro</Link>
            <Link to="/dashboard" className="nav-link">Tablero</Link>
          </nav>
          
          <Routes>
            <Route path="/" element={<EntryForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/data" element={<KidsData />} />
          </Routes>
        </div>
      </Router>
    </KidsProvider>
  );
}

export default App;
