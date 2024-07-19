import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'; 
import Home from './components/Home';
import Login from './components/Login/Login';
import firebaseConfig from './components/Config/firebaseConfig'; 
import { initializeApp } from 'firebase/app';
import Footer from './components/Footer/Footer'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 

const App = () => {
  const [user, setUser] = useState(null);
  const [isOnline, ] = useState(true);
  const [otherMachineStatus, ] = useState({});
  const [userUid, setUserUid] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setUserUid(user ? user.uid : '');
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setUserUid(userCredential.user.uid); 
      return <Navigate to="/" />;
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

return (
  <Router>
    <div style={{ margin: '100px auto', textAlign: 'center' }}>
      <nav>
        <div style={{ marginBottom: '20px' }}>
          {user ? (
            <Navigate to="/">Home</Navigate>
          ) : (
            <Navigate to="/login" style={{ textDecoration: 'none', color: 'white', background: 'blue', padding: '15px 30px', borderRadius: '10px', fontSize: '20px', fontWeight: 'bold' }}>Login</Navigate>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/" element={user ? <Home isOnline={isOnline} otherMachineStatus={otherMachineStatus} userUid={userUid} /> : <Navigate to="/login" />} />
      </Routes>
    </div>
    <Footer />
  </Router>
  );
};

export default App;