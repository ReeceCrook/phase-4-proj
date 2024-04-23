import { useState } from "react";
import { Link } from "react-router-dom";


function NewPost({ user }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [selectedBlogId, setSelectedBlogId] = useState(null);

    if (!user) return <Link to="/login">Login</Link>;


    function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        fetch("/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                description,
                content,
                blog_id: selectedBlogId,
            }),
        }).then((r) => {
            setIsLoading(false);
            if (r.ok) {
                console.log(r);
            } else {
                r.json().then((err) => setErrors(err.Message));
            }
        });
    }

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
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    rows="10"
                    cols="50"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    rows="10"
                    cols="50"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <label htmlFor="blog">Select Blog</label>
                <select
                    id="blog"
                    value={selectedBlogId ? selectedBlogId : 0}
                    onClick={() => getBlogs()}
                    onChange={(e) => setSelectedBlogId(e.target.value)}
                >
                    <option value="blog_id" id="blog_id">Select a blog</option>
                    {blogs.map((blog) => (
                        <option key={blog.id} value={blog.id}>
                            {blog.name}
                        </option>
                    ))}
                </select>
                <button type="submit">
                    {isLoading ? "Loading..." : "Submit Post"}
                </button>
            </form>
            <div>{errors}</div>
        </div>
    );
}

export default NewPost;
