import '../css/NewPost.css'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { addPost } from '../actions/postActions'
import { setUserBlogs } from "../actions/userBlogActions";


function NewPost() {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    // const blogs = useSelector((state) => state.blogs.blogs);
    const nav = useNavigate()
    const dispatch = useDispatch()
    // const posts = useSelector((state) => state.posts.posts);
    const user = useSelector((state) => state.user.user);
    const userBlogs = useSelector((state) => state.userBlogs.userBlogs);

    const formSchema = yup.object().shape({
        title: yup.string().required("Must enter a title").max(50).min(5),
        description: yup.string().required("Must enter a description").max(250).min(15),
        content: yup.string().required("Post must have content").max(4000).min(20),
        blog_id: yup.number().required("Must select what blog this post is for")
    });

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            content: "",
            blog_id: 0,
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            setIsLoading(true);
            fetch("/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            }).then((r) => {
                setIsLoading(false)
                if (r.ok) {
                    r.json().then(r => dispatch(addPost(r)))
                    nav('/profile')
                } else {
                    console.log(r)
                }
            });
        },
    });
    if (!user) return <Link to="/login">Please Login First</Link>;
    else if (userBlogs.length === 0) {
        return <Link to="/new-blog">Please Create a Blog First</Link>;
    }
    console.log(userBlogs)
    // else if (user.blogs.length === 0) return <Link to="/new-blog">Please Create a Blog First</Link>;

    function getUserBlogs() {
        setIsLoading(true);
        fetch(`/blog-by-user/${user.id}`)
            .then((r) => {
                if (r.ok) {
                    return r.json();
                } else {
                    throw new Error("Failed to fetch blogs");
                }
            })
            .then((res) => {
                dispatch(setUserBlogs(res));
                setIsLoading(false);
            })
            .catch((error) => {
                setErrors([error.message]);
                setIsLoading(false);
            });
    }
    return (
        <div className="new-post-wrapper">
            <h2>Create Post</h2>
            <form onSubmit={formik.handleSubmit}>
                <label className='new-post-label' htmlFor="title">Title:</label><br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    className='new-post-formfield'
                    value={formik.values.title}
                    onChange={formik.handleChange}
                /><br /><br />
                <p style={{ color: "red" }}> {formik.errors.title}</p>
                <label className='new-post-label' htmlFor="description">Description:</label><br />
                <textarea
                    id="description"
                    name="description"
                    className='new-post-formfield'
                    rows="10"
                    cols="50"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}> {formik.errors.description}</p>
                <label className='new-post-label' htmlFor="content">Content:</label><br />
                <textarea
                    id="content"
                    name="content"
                    className='new-post-formfield'
                    rows="10"
                    cols="50"
                    value={formik.values.content}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}> {formik.errors.content}</p>
                <select
                    id="blog_id"
                    name="blog_id"
                    className='new-post-formfield'
                    value={formik.values.blog_id}
                    onClick={() => getUserBlogs()}
                    onChange={formik.handleChange}
                >
                    <option value="blog_id" id="blog_id">Select a blog</option>
                    {userBlogs && userBlogs.length ? userBlogs.map((blog) => (
                        <option key={blog.id} value={blog.id}>
                            {blog.name}
                        </option>
                    )) : 'No Blogs'}
                </select>
                <p style={{ color: "red" }}> {formik.errors.blog_id}</p>
                <button type="submit" className='submitPost'>
                    {isLoading ? "Loading..." : "Submit Post"}
                </button>
            </form>
            <div>{errors}</div>
        </div>
    );
}

export default NewPost;
