import '../css/App.css';
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import NavBar from './NavBar';
import Home from './Home';
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

  const formSchema = yup.object().shape({
    username: yup.string().required("Must enter a username").max(15).min(3),
    password: yup.string().required("Must enter password").max(20).min(5),
    title: yup.string().required("Must enter a title").max(50).min(5),
    description: yup.string().required("Must enter a description").max(250).min(10),
    content: yup.string().required("Must enter content").max(1500).min(40)
  });

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
        <Route exact path="/login" element={<Login setUser={setUser} user={user} formSchema={formSchema} />} />
        <Route exact path="/posts" element={<PostList />} />
        <Route exact path="/new-post" element={<NewPost user={user} />} />
        <Route exact path="/blogs" element={<BlogList />} />
        <Route path='/blogs/:id' element={<ViewBlog />} />
        <Route exact path="/new-blog" element={<NewBlog user={user} />} />
        <Route exact path="/profile" element={<UserProfie user={user} />} />
        <Route exact path="/favorites" element={<FavoriteList user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
