import React, { useState } from 'react';
import Modal from 'react-modal';
import './CustomModal.css';

Modal.setAppElement('#root');

const CustomModal = ({ isOpen, onRequestClose, onConfirm }) => {
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    onConfirm(inputValue);
    onRequestClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }else if (e.key === 'Escape') {
      onRequestClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="CustomModalOverlay"
      className="CustomModalContent"
      contentLabel="Input Modal"
    >
      <div className='Content'>
        <h2>Enter "Logout" to log out:</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus 
        />
        {/* <button onClick={handleConfirm}>OK</button>
        <button onClick={onRequestClose}>Cancel</button> */}
      </div>
    </Modal>
  );
};

export default CustomModal;
