import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import NotesPage from './components/NotesPage'; 

const App = () => {
  return (
    <Router>
      <div className="header">
        <h1>Keep Notes</h1>
        <div className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/notes">Notes</Link>
          <Link to="/account">Account</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>
      <div>
        <nav>
          <Link to="/">Homepage</Link> / <Link to="/signup">Signup Page</Link> / <Link to="/login">Login Page</Link>
        </nav>
      </div>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/notes" element={<NotesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
