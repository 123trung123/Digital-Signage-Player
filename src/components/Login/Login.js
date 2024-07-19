import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import '../../App.css';

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await handleLogin(email, password);
    if (success) {
      setLoggedIn(true);
    } else {
      setError('Invalid email or password.');
    }
  };

  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <div className="title-container">
        <h1><span>Login <img src="../icon.png" alt="Icon" className="title-icon"/></span></h1>
        <div className="separator"></div>
      </div>
      <form onSubmit={handleSubmit}>
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="button" type="submit">Login</button>
      </form>
      {error && <div className="errorMessage">{error}</div>}
    </div>
  );
};

export default Login;
