import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";


function NewPost({ user, setPosts }) {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const nav = useNavigate()


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
                    r.json().then(r => setPosts((posts) => [...posts, r]))
                    nav('/profile')
                } else {
                    console.log(r)
                }
            });
        },
    });

    if (!user) return <Link to="/login">Please Login First</Link>;
    else if (user.blogs.length === 0) return <Link to="/new-blog">Please Create a Blog First</Link>;

    function getBlogs() {
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
                setBlogs(res);
                setIsLoading(false);
            })
            .catch((error) => {
                setErrors([error.message]);
                setIsLoading(false);
            });
    }
    return (
        <div>
            <h2>Create Post</h2>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}> {formik.errors.title}</p>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows="10"
                    cols="50"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}> {formik.errors.description}</p>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    name="content"
                    rows="10"
                    cols="50"
                    value={formik.values.content}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}> {formik.errors.content}</p>
                <label htmlFor="blog">Select Blog</label>
                <select
                    id="blog_id"
                    name="blog_id"
                    value={formik.values.blog_id}
                    onClick={() => getBlogs()}
                    onChange={formik.handleChange}
                >
                    <option value="blog_id" id="blog_id">Select a blog</option>
                    {blogs.map((blog) => (
                        <option key={blog.id} value={blog.id}>
                            {blog.name}
                        </option>
                    ))}
                </select>
                <p style={{ color: "red" }}> {formik.errors.blog_id}</p>
                <button type="submit">
                    {isLoading ? "Loading..." : "Submit Post"}
                </button>
            </form>
            <div>{errors}</div>
        </div>
    );
}

export default NewPost;
