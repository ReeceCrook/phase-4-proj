import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function UserProfile({ user }) {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            Promise.all(user.blogs.map((blog) =>
                fetch(`/post-by-blog/${blog.id}`)
                    .then((r) => {
                        if (r.ok) {
                            return r.json();
                        } else {
                            throw new Error(r.statusText);
                        }
                    })
            )).then((responses) => {
                setPosts(responses.flat());
                setIsLoading(false);
            }).catch((error) => {
                setErrors([error.Message]);
                setIsLoading(false);
            });
        }
    }, [user]);

    if (!user) return <Link to="/login">Login</Link>;

    const { id, username, image_url, date_joined, blogs } = user;

    return (
        <div>
            <div>
                ID: {id}<br />
                Username: {username}<br />
                Image URL: {image_url}<br />
                Date Joined: {date_joined}<br />
                Blogs: {blogs.map((blog) => (
                    <div key={blog.id}>
                        <h2>{blog.name}</h2>
                        <p>{blog.description}</p>
                        <p>{blog.date_created}</p>
                    </div>
                ))}
            </div>
            <div>
                <h3>User Posts:</h3>
                {isLoading ? <p>Loading...</p> : (
                    posts.map((post) => (
                        <div key={post.id}>
                            <h4>{post.title}</h4>
                            <p>{post.description}</p>
                        </div>
                    ))
                )}
            </div>
            {errors.length > 0 && errors.map((error, index) => (
                <p key={index} style={{ color: 'red' }}>{error}</p>
            ))}
        </div>
    );
}

export default UserProfile;
