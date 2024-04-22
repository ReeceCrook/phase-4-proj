import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import '../css/UserProfile.css'

function UserProfile({ user }) {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [activeTab, setActiveTab] = useState('blogs');
    const [postByBlog, setPostByBlog] = useState([])

    const nav = useNavigate()

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            Promise.all(user.blogs.map((blog) =>
                fetch(`/post-by-blog/${blog.id}`)
                    .then((r) => {
                        if (r.ok) {
                            return r.json();
                        } else {

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

    function getPostsByBlog(id) {
        fetch(`/post-by-blog/${id}`)
            .then((r) => {
                if (r.ok) {
                    return r.json()
                } else {
                    throw new Error(r.statusText);
                }
            }).then((res) => {
                console.log(res)
                setPostByBlog(res)

            }).catch((error) => {
                setErrors([error.Message]);
                setIsLoading(false);
            });
    }

    function deleteProfile() {
        fetch(`/user/${user.id}`, {
            method: "DELETE",
        }).then((r) => {
            console.log(r)
            window.location.reload();
        });
    }
    function handleDeleteProfile() {
        const isConfirmed = window.confirm("Are you sure you want to permanently delete this profile? This action cannot be reversed.");
        if (isConfirmed) {
            deleteProfile();
        }
    };


    if (!user) return <Link to="/login">Login</Link>;

    const { id, username, date_joined, blogs } = user;

    return (
        <div className="user-profile-wrapper">
            <button onClick={() => handleDeleteProfile()}>Perminently delete this profile?</button>
            <div className="test">
                <strong>ID:</strong> {id}<br />
                <strong>Username:</strong> {username}<br />

                <strong>Date Joined:</strong> {date_joined}<br /><br />

                <div className="tab-buttons">
                    <button onClick={() => setActiveTab('blogs')} className={activeTab === 'blogs' ? 'active' : ''}>Your Blogs</button>
                    <button onClick={() => setActiveTab('posts')} className={activeTab === 'posts' ? 'active' : ''}>Your Posts</button>
                    <button onClick={() => nav('/new-blog')}>Create New Blog</button>
                    {postByBlog.length > 0 ? <button onClick={() => setPostByBlog([])}>Return to Blogs</button> : ''}
                    {postByBlog.length > 0 ? <button onClick={() => nav('/new-post')}>Add New Post</button> : ''}
                </div>

                {postByBlog.length > 0 ? (
                    <div>
                        {postByBlog.map((post) => (
                            <div key={post.id} className="user-posts">
                                <h2><strong>Title:</strong><br /> {post.title}</h2>
                                <p><strong>Date Created:</strong><br /> {post.date_created}</p>
                                <p><strong>Description:</strong><br /> {post.description}</p>
                                <p><strong>Content:</strong><br /> {post.content}</p>
                            </div>
                        ))}
                    </div>
                ) : activeTab === 'blogs' ? (
                    <div className="user-blogs-wrapper tab-content">
                        {blogs.map((blog) => (
                            <div key={blog.id} className="user-blogs">
                                <h2><strong>Title:</strong><br /> {blog.name}</h2>
                                <p><strong>Date Created:</strong><br /> {blog.date_created}</p>
                                <p><strong>Description:</strong><br /> {blog.description}</p>
                                <button onClick={() => getPostsByBlog(blog.id)}>View This Blogs Posts</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="user-posts-wrapper tab-content">
                        {isLoading ? <p>Loading...</p> : (
                            posts.map((post) => (
                                <div key={post.id} className="user-posts">
                                    <h2><strong>Title:</strong><br /> {post.title}</h2>
                                    <p><strong>Date Created:</strong><br /> {post.date_created}</p>
                                    <p><strong>Description:</strong><br /> {post.description}</p>
                                    <p><strong>Content:</strong><br /> {post.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            {
                errors.length > 0 && errors.map((error, index) => (
                    <p key={index} style={{ color: 'red' }}>{error}</p>
                ))
            }
        </div >
    );
}

export default UserProfile;
