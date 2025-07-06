import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contact, setContact] = useState('');
  const [displayname, setDisplayname] = useState('');
  const navigate = useNavigate();

  // Login handler
  const handleLogin = async (e) => {
e.preventDefault();
  const res = await fetch('http://localhost:3001/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem('userEmail', email); // <-- ADD THIS LINE
    navigate('/landingpage'); // Only redirect if login is successful
    alert('Login  successful!');
  } else {
    alert(data.message || data.error || 'Login failed');
  }
  };

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const res = await fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        contact,
        displayname
      })
    });
    const data = await res.json();
    if (data.success) {
      alert('Registration successful!');
      setShowRegister(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setContact('');
      setDisplayname('');
    } else {
      alert(data.error || 'Registration failed');
    }
  };

  return (
    <div className="login-container">
      <div className="logoside">
        <img src="/logo.png" alt="Logo" />
        <h1>Chathub</h1>
      </div>
      <div className="login">
        <div className="login-form">
          {!showRegister ? (
            <>
              <span className="welcome-text">Welcome to Chathub</span>
              <span className="form-title">Login your account</span>
              <form onSubmit={handleLogin}>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <div className="button-container">
                  <button type="submit">Login</button>
                  <button
                    type="button"
                    className="register-button"
                    onClick={() => setShowRegister(true)}
                  >
                    Register
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <span className="welcome-text">Welcome to Chathub</span>
              <span className="form-title">Register a new account</span>
              <form onSubmit={handleRegister}>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                <label>Display Name</label>
                <input
                  type="text"
                  value={displayname}
                  onChange={e => setDisplayname(e.target.value)}
                  required
                />
                <label>Contact no.</label>
                <input
                  type="tel"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  required
                />
                <div className="button-container">
                  <button type="submit">Register</button>
                  <button
                    type="button"
                    className="login-button"
                    onClick={() => setShowRegister(false)}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;