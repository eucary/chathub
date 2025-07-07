import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landingpage from './Landingpage';
import Login from './Login';
import './index.css';
import Faq from './Faq';
import About from './About';
import Profile from './Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landingpage" element={<Landingpage />} />
        <Route path="/" element={<Login />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/about" element={<About />} /> {/* ✅ fixed */}
        <Route path="/profile" element={<Profile />} /> {/* ✅ fixed */}
      </Routes>
    </Router>
  );
}

export default App;
