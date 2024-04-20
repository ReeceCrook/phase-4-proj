import { useEffect, useState } from "react";

function BlogList() {
    const [blogs, setBlogs] = useState([])

    useEffect(() => {
        fetch("/blog")
            .then((r) => r.json())
            .then(setBlogs);
    }, []);
    return (
        <div>
            {blogs.length > 0 ? blogs.map((blog) => {
                return (
                    <div key={blog.id}>
                        <h2>Title: {blog.name}</h2>
                        <p>
                            Description:<br />
                            {blog.description}<br />

                            Date Created:<br />
                            {blog.date_created}
                        </p>
                        This post was created by: {blog.users.map((user) => {
                            return (
                                <div key={user.id}>
                                    <h3>{user.username}</h3>
                                </div>
                            )
                        })}
                    </div>
                )
            }) :
                <div>
                    <h2>No Blogs Found</h2>
                    {/* <button as={Link} to="/new-blog">
                        Start a Blog
                    </button> */}
                </div>
            }
        </div>
    )
}


export default BlogList