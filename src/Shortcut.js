import { useEffect, useState } from 'react';

const Shortcut = (combo, callback) => {
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Control') return; // Skip Control key alone
      setKeys((prevKeys) => [...prevKeys, event.key].slice(-combo.length));
    };

    const handleKeyUp = (event) => {
      if (keys.join('+') === combo.join('+')) {
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keys, combo, callback]);

  return null;
};

export default Shortcut;
