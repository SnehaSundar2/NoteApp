import React, { useState } from 'react';
import './AddNoteModal.css';

const AddNoteModal = ({ isOpen, onClose, onAddNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAddNote = () => {
    if (title && content) {
      onAddNote({ title, content });
      setTitle('');
      setContent('');
      onClose(); // Close the modal after adding the note
    } else {
      alert('Please fill in both the title and content.');
    }
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Add Notes</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-title"
        />
        <textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input-content"
        />
        <div className="modal-buttons">
          <button className="add-btn" onClick={handleAddNote}>Add</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddNoteModal;
  
