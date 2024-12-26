import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import NotesPage from './components/NotesPage';
import axios from 'axios'; // Import axios for API calls

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [userId, setUserId] = useState(1); // Ideally, replace with dynamic user ID after login
  const [message, setMessage] = useState('');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNoteTitle('');
    setNoteContent('');
  };

  const handleSubmit = async () => {
    try {
      // Prepare data for the request
      const data = {
        note_title: noteTitle,
        note_content: noteContent,
        user_id: userId
      };

      // Send POST request to backend API using axios
      const response = await axios.post('http://localhost:5000/api/notes', data);

      if (response.status === 201) {
        setMessage('Note added successfully!');
        closeModal(); // Close the modal after successful note creation
      }
    } catch (error) {
      console.error('Error adding note:', error);
      setMessage('Error adding note. Please try again.');
    }
  };

  return (
    <Router>
      <div className="header">
        <h1>Keep Notes</h1>
        <div className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/notes" onClick={openModal}>Notes</Link>
          <Link to="/account">Account</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>

      <div>
        <nav>
          <Link to="/">Homepage</Link> / <Link to="/signup">Signup Page</Link> / <Link to="/login">Login Page</Link>
        </nav>
      </div>

      {/* Modal Structure */}
      {isModalOpen && (
        <div className="modal open">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>×</button>
            <h2>Add a Note</h2>
            <input
              type="text"
              className="input-title"
              placeholder="Title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <textarea
              className="input-content"
              placeholder="Write your note here..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="add-btn" onClick={handleSubmit}>Add Note</button>
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/notes" element={<NotesPage />} />
      </Routes>

      {message && <p>{message}</p>} {/* Display feedback message */}
    </Router>
  );
};

export default App;
