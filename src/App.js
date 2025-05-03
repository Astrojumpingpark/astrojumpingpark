import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EntryForm from './components/EntryForm';
import Dashboard from './components/Dashboard';
import KidsData from './components/KidsData';
import InactiveKids from './components/InactiveKids';
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
            <Link to="/" className="nav-link">Preparando despegue</Link>
            <Link to="/dashboard" className="nav-link">En vuelo</Link>
            <Link to="/inactive" className="nav-link">Aterrizajes</Link>
          </nav>
          
          <Routes>
            <Route path="/" element={<EntryForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/data" element={<KidsData />} />
            <Route path="/inactive" element={<InactiveKids />} />
          </Routes>
        </div>
      </Router>
    </KidsProvider>
  );
}

export default App;
