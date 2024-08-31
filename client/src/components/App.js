import '../css/App.css';
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavBar from './NavBar';
import Login from './Login';
import PostList from './PostList';
import NewPost from './NewPost';
import UserProfie from './UserProfile';
import BlogList from './BlogList';
import FavoriteList from './FavoriteList';
import NewBlog from './NewBlog';
import ViewBlog from './ViewBlog';
import { setBlogs } from "../actions/blogActions"
import { setUser } from "../actions/userActions"

function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  // const [posts, setPosts] = useState([])
  const user = useSelector((state) => state.user.user);
  const blogs = useSelector((state) => state.blogs.blogs);
  const dispatch = useDispatch()

  const nav = useNavigate();

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => dispatch(setUser(user)));
      }
    });
  }, []);

  useEffect(() => {
    fetch("/blog")
      .then((r) => r.json())
      .then((r) => {
        dispatch(setBlogs(r))
        setIsLoading(false)
      });
  }, [dispatch]);

  function logout() {
    fetch("/logout", {
      method: "DELETE",
    }).then((r) => {
      dispatch(setUser(null))
    });
  }
  return (
    <div className="App">
      {user ? <button onClick={logout} className='logoutButton'>Logout</button> : <button className='logoutButton' onClick={() => nav("/login")}>Login</button>}
      <NavBar user={user} />
      <Routes>
        <Route exact path="/" element={<BlogList setIsLoading={setIsLoading} isLoading={isLoading} />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/posts" element={<PostList />} />
        <Route exact path="/new-post" element={<NewPost user={user} />} />
        <Route path='/blogs/:id' element={<ViewBlog />} />
        <Route exact path="/new-blog" element={<NewBlog user={user} setBlogs={setBlogs} />} />
        <Route exact path="/profile" element={<UserProfie user={user} setUser={setUser} blogs={blogs} setBlogs={setBlogs} />} />
        <Route exact path="/favorites" element={<FavoriteList user={user} favorites={favorites} setFavorites={setFavorites} />} />
      </Routes>
    </div>
  );
}

export default App;
