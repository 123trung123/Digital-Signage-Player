import { useEffect } from 'react';

const useKeyCombo = (combo, callback) => {
  useEffect(() => {
    let keysPressed = new Set();

    const handleKeyDown = (event) => {
      keysPressed.add(event.key.toLowerCase());

      const comboMatched = combo.every(key => keysPressed.has(key.toLowerCase()));
      if (comboMatched) {
        callback();
      }
    };

    const handleKeyUp = (event) => {
      keysPressed.delete(event.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [combo, callback]);
};

export default useKeyCombo;
