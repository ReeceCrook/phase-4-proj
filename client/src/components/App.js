import '../css/App.css';
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from './NavBar';
import Home from './Home';
import Login from './Login';
import PostList from './PostList';
import NewPost from './NewPost';
import UserProfie from './UserProfile';
import BlogList from './BlogList';
import FavoriteList from './FavoriteList';

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
      <NavBar user={user} />
      <Routes>
        <Route exact path="/" element={<Home user={user} />} />
        <Route exact path="/login" element={<Login setUser={setUser} />} />
        <Route exact path="/posts" element={<PostList />} />
        <Route exact path="/blogs" element={<BlogList />} />
        <Route exact path="/new-post" element={<NewPost user={user} />} />
        <Route exact path="/profile" element={<UserProfie user={user} />} />
        <Route exact path="/favorites" element={<FavoriteList user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
