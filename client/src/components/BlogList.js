import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BlogList() {
    const [blogs, setBlogs] = useState([])
    const nav = useNavigate()

    useEffect(() => {
        fetch("/blog")
            .then((r) => r.json())
            .then(setBlogs);
    }, []);
    return (
        <div>
            {blogs.length > 0 ? blogs.map((blog) => {
                console.log(blog.owner)
                return (
                    <div key={blog.id}>
                        <h2>Title: {blog.name}</h2>
                        <p>
                            Description:<br />
                            {blog.description}<br />

                            Date Created:<br />
                            {blog.date_created}
                        </p>
                        This blog was created by: {blog.users.length > 0 ? (
                            blog.users.map((user) => {
                                return (
                                    <li key={user.id}>
                                        <h3>{user.username}</h3>
                                    </li>
                                )
                            })
                        ) : (
                            <div>OWNER: {blog.owner}</div>
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