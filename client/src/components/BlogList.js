import { useSelector, useDispatch } from "react-redux";
import { addFavorite } from "../actions/favoriteActions";

import { useNavigate } from "react-router-dom";
import "../css/BlogList.css"

function BlogList({ isLoading, setIsLoading }) {
    const blogs = useSelector((state) => state.blogs.blogs);
    const user = useSelector((state) => state.user.user);


    const dispatch = useDispatch();
    const nav = useNavigate();

    function favoriteBlog(id) {
        if (user) {
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
                dispatch(addFavorite(res));
                setIsLoading(false)
            }).catch((error) => {
                console.error("Error:", error);
                setIsLoading(false)
            });
        } else {
            window.alert("Please Login or Signup to Favorite")
        }

    }
    return (
        <div className="blogs-wrapper">
            {isLoading ? <h1 style={{ position: "absolute", top: "30%", left: "45%" }}>Loading Blogs...</h1> : blogs.length > 0 ? blogs.map((blog) => {
                return (
                    <div key={blog.id} className="blogs" name={blog.name}>
                        <button onClick={() => favoriteBlog(blog.id)} className="favoriteButton">Favorite This Blog</button>
                        <button onClick={() => nav(`/blogs/${blog.id}`)} className="viewBlogButton">View this Blogs Posts</button>
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