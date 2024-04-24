import '../css/App.css';
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import NavBar from './NavBar';
import Login from './Login';
import PostList from './PostList';
import NewPost from './NewPost';
import UserProfie from './UserProfile';
import BlogList from './BlogList';
import FavoriteList from './FavoriteList';
import NewBlog from './NewBlog';
import ViewBlog from './ViewBlog';

function App() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  function logout() {
    fetch("/logout", {
      method: "DELETE",
    }).then((r) => {
      console.log(r)
      window.location.reload();
    });
  }

  return (
    <div className="App">
      {user ? <button onClick={logout} className='logoutButton'>Logout</button> : <button className='logoutButton' onClick={() => nav("/login")}>Login</button>}
      <NavBar user={user} />
      <Routes>
        <Route exact path="/" element={<BlogList user={user} />} />
        <Route exact path="/login" element={<Login setUser={setUser} user={user} />} />
        <Route exact path="/posts" element={<PostList />} />
        <Route exact path="/new-post" element={<NewPost user={user} />} />
        <Route path='/blogs/:id' element={<ViewBlog />} />
        <Route exact path="/new-blog" element={<NewBlog user={user} />} />
        <Route exact path="/profile" element={<UserProfie user={user} />} />
        <Route exact path="/favorites" element={<FavoriteList user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
