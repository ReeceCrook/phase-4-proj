import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import '../css/UserProfile.css'

function UserProfile({ user }) {
    const [allBlogs, setAllBlogs] = useState([])
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [activeTab, setActiveTab] = useState('blogs');
    const [postByBlog, setPostByBlog] = useState([])
    const [openUserNameSettings, setOpenUserNameSettings] = useState(false)
    const [openPasswordSettings, setOpenPasswordSettings] = useState(false)
    const [newUserName, setNewUserName] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")

    const nav = useNavigate()

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            getAllBlogs()
            Promise.all(user.blogs.map((blog) =>
                fetch(`/post-by-blog/${blog.id}`)
                    .then((r) => {
                        if (r.ok) {
                            return r.json();
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

    function logout() {
        fetch("/logout", {
            method: "DELETE",
        }).then((r) => {
            console.log(r)
            window.location.reload();
        });
    }

    function getAllBlogs() {
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
                setAllBlogs(res);
                setIsLoading(false);
            })
            .catch((error) => {
                setErrors([error.message]);
                setIsLoading(false);
            });
    }

    function getPostsByBlog(id) {
        setActiveTab('')
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

    function deleteBlog(id) {
        fetch(`/blog/${id}`, {
            method: "DELETE",
        }).then((r) => {
            if (r.ok) {
                console.log(r)
                window.location.reload();
            } else {
                console.log("Failed", r)
            }

        });
    }
    function handleDeleteBlog(id) {
        const isConfirmed = window.confirm("Are you sure you want to permanently delete this Blog? This action cannot be reversed.");
        if (isConfirmed) {
            deleteBlog(id);
        }
    };

    function deletePost(id) {
        fetch(`/post/${id}`, {
            method: "DELETE",
        }).then((r) => {
            if (r.ok) {
                console.log(r)
                window.location.reload();
            } else {
                console.log("Failed", r)
            }

        });
    }
    function handleDeletePost(id) {
        const isConfirmed = window.confirm("Are you sure you want to permanently delete this Blog? This action cannot be reversed.");
        if (isConfirmed) {
            deletePost(id);
        }
    };

    function handleNewUserNameSubmit(e) {
        e.preventDefault()
        if (newUserName.length > 3) {
            fetch(`/user/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: newUserName
                }),
            })

                .then((r) => {
                    if (r.ok) {
                        window.location.reload();
                        return r.json()
                    }

                }).catch((error) => {
                    setErrors([error.Message]);
                    setIsLoading(false);
                });
        }
    }
    function handleNewPasswordSubmit(e) {
        e.preventDefault()
        if (newPassword === confirmNewPassword && newPassword.length > 5) {
            fetch(`/user/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password: newPassword
                }),
            })

                .then((r) => {
                    if (r.ok) {
                        window.location.reload();
                        return r.json()
                    }
                }).catch((error) => {
                    setErrors([error.Message]);
                    setIsLoading(false);
                });
        }
    }


    if (!user) return <Link to="/login">Login</Link>;
    if (openUserNameSettings) {
        return (
            <div>
                <form onSubmit={handleNewUserNameSubmit}>
                    <label htmlFor="newUserName">New Username: </label>
                    <input
                        id="newUserName"
                        type="text"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                </form>
                <button onClick={() => setOpenUserNameSettings(false)}>Cancel</button>
            </div>
        )
    } else if (openPasswordSettings) {
        return (
            <div>
                <form onSubmit={handleNewPasswordSubmit}>
                    <label htmlFor="newPassword">New Password: </label>
                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <label htmlFor="confirmNewPassword">Confirm New Password: </label>
                    <input
                        id="confirmNewPassword"
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                </form>
                <button onClick={() => setOpenPasswordSettings(false)}>Cancel</button>
            </div>
        )
    }

    const { id, username, date_joined, blogs } = user;

    return (
        <div className="user-profile-wrapper">
            <button onClick={logout}>Logout</button>
            <button onClick={() => handleDeleteProfile()}>Perminently delete this profile?</button>
            <div className="test">
                <button onClick={() => setOpenUserNameSettings(true)}>Change username</button>
                <button onClick={() => setOpenPasswordSettings(true)}>Change password</button>

                <strong>ID:</strong> {id}<br />
                <strong>Username:</strong> {username}<br />

                <strong>Date Joined:</strong> {date_joined}<br /><br />

                <div className="tab-buttons">
                    <button onClick={() => setActiveTab('blogs')} className={activeTab === 'blogs' ? 'active' : ''}>Your Personal Blogs</button>
                    <button onClick={() => setActiveTab('shared-blogs')}>All Blogs</button>
                    <button onClick={() => setActiveTab('posts')} className={activeTab === 'posts' ? 'active' : ''}>Your Posts</button>
                    <button onClick={() => nav('/new-blog')}>Create New Blog</button>
                    {postByBlog.length > 0 ? <button onClick={() => setPostByBlog([])}>Return to Blogs</button> : ''}
                    {postByBlog.length > 0 ? <button onClick={() => nav('/new-post')}>Add New Post</button> : ''}
                </div>

                {postByBlog.length > 0 && activeTab === '' ? (
                    <div>
                        {postByBlog.map((post) => (
                            <div key={post.id} className="user-posts">
                                <button onClick={() => handleDeletePost(post.id)}>Perminently delete this post?</button>
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
                                <button onClick={() => handleDeleteBlog(blog.id)}>Perminently delete this blog?</button>
                            </div>
                        ))}
                    </div>
                ) : activeTab === 'shared-blogs' ? (
                    <div className="user-blogs-wrapper tab-content">
                        {allBlogs.length > 0 ? (
                            allBlogs.map((blog) => {
                                return (
                                    <div key={blog.id} className="user-blogs">
                                        <h2><strong>Title:</strong><br /> {blog.name}</h2>
                                        <p><strong>Date Created:</strong><br /> {blog.date_created}</p>
                                        <p><strong>Description:</strong><br /> {blog.description}</p>
                                        <button onClick={() => getPostsByBlog(blog.id)}>View This Blogs Posts</button>

                                        {/* <button onClick={() => handleDeleteBlog(blog.id)}>Perminently delete this blog?</button> */}
                                    </div>
                                )

                            })
                        ) : (
                            <div>No Blogs Found</div>
                        )}
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
