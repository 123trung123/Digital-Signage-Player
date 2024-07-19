import React from 'react';
import './WaitingScreen.css';

const WaitingScreen = () => {
  return (
    <div className="waiting-screen">
      <div className="spinner"></div>
      <p>Loading media...</p>
    </div>
  );
};

export default WaitingScreen;
