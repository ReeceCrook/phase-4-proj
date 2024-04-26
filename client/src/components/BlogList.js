import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/BlogList.css"

function BlogList({ user, blogs, setBlogs, setFavorites, isLoading, setIsLoading }) {
    const nav = useNavigate()

    // useEffect(() => {
    //     fetch("/blog")
    //         .then((r) => r.json())
    //         .then((r) => {
    //             setBlogs(r)
    //             setIsLoading(false)
    //         }).then(console.log("IN SET BLOGS"))
    // }, []);

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
                return r.json();
            }
        }).then((res) => {
            setFavorites((favs) => [...favs, res])
            setIsLoading(false)
        }).catch((error) => {
            console.error("Error:", error);
            setIsLoading(false)
        });
    }

    return (
        <div className="blogs-wrapper">
            {isLoading ? <h1 style={{ position: "absolute", top: "30%", left: "45%" }}>Loading Blogs...</h1> : blogs.length > 0 ? blogs.map((blog) => {
                return (
                    <div key={blog.id} className="blogs" name={blog.name}>
                        <button onClick={() => favoriteBlog(blog.id)} style={{ float: "left" }}>Favorite This Blog</button>
                        <button onClick={() => nav(`/blogs/${blog.id}`)} style={{ float: "right" }}>View this Blogs Posts</button>
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
                                <li>{blog.owner.username}</li>
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