import '../css/App.css';
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from './NavBar';
import Home from './Home';
import LoginForm from './LoginForm';
import SignUpForm from './SignUp';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<LoginForm setUser={setUser} />} />
        <Route exact path="/sign-up" element={<SignUpForm />} />
      </Routes>
    </div>
  );
}

export default App;
