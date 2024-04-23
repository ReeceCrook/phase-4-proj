import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/BlogList.css"

function BlogList() {
    const [blogs, setBlogs] = useState([])
    const nav = useNavigate()

    useEffect(() => {
        fetch("/blog")
            .then((r) => r.json())
            .then(setBlogs);
    }, []);

    function favoriteBlog(id) {
        fetch("/favorite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                blog_id: id
            }),
        }).then((r) => {
            if (r.ok) {
                console.log(r);
                window.location.reload();
            } else {
                console.log(r);
            }
        });
    }

    return (
        <div className="blogs-wrapper">
            {blogs.length > 0 ? blogs.map((blog) => {
                return (
                    <div key={blog.id} className="blogs">
                        <button onClick={() => favoriteBlog(blog.id)}>Favorite This Blog</button>
                        <button onClick={() => nav(`/blogs/${blog.id}`)}>View this Blogs Posts</button>
                        <h2><strong>Title:</strong> {blog.name}</h2>
                        <p>
                            <strong>Description:</strong><br />
                            {blog.description}<br />

                            <strong>Date Created:</strong><br />
                            {blog.date_created}
                        </p>
                        {blog.users.length > 0 ? (
                            <div>
                                <h3><strong>This blog was created by:</strong></h3>
                                {blog.users.map((user) => {
                                    return (
                                        <li key={user.id}>
                                            <h4>{user.username}</h4>
                                        </li>
                                    )
                                })}
                            </div>
                        ) : (
                            <div><strong>Owner:</strong> {blog.owner.username}</div>
                        )}

                    </div>
                )
            }) :
                <div>
                    <h2>No Blogs Found</h2>
                    <button onClick={() => nav("/new-blog")}>
                        Create a Blog
                    </button>
                </div>
            }
        </div>
    )
}


export default BlogList