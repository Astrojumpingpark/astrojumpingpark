import React from 'react';

function WarningModal({ isOpen, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img 
          src="/warning-icon.png" 
          alt="Warning" 
          className="warning-icon"
        />
        <p className="warning-message">{message}</p>
        <button onClick={onClose} className="modal-button">OK</button>
      </div>
    </div>
  );
}

export default WarningModal;