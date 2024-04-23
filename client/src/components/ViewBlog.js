import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ViewBlog() {
    const { id } = useParams();
    const [blog, setBlog] = useState({})
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch(`/blog/${id}`)
            .then((r) => r.json())
            .then((r) => {
                setBlog(r)
            })
    }, [id])

    useEffect(() => {
        if (Object.keys(blog).length > 0) {
            fetch(`/post-by-blog/${blog.id}`)
                .then((r) => {
                    if (r.ok) {
                        return r.json()
                    }
                })
                .then((r) => {
                    setPosts(r)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }

    }, [blog])

    console.log("POSTS ==>", posts)
    return (
        <div>
            {blog.name ? (
                <div className='view-blog-wrapper'>
                    <h1><strong>Title:</strong> {blog.name}</h1>
                    <h3><strong>Created By:</strong> {blog.owner.username}</h3>
                    <h4><strong>Desciption:</strong> {blog.description}</h4> <br />
                    {posts.length > 0 ? (
                        posts.map((post) => {
                            return (
                                <div key={post.id}>
                                    <h2>TITLE!: {post.title}</h2>
                                    <h4>{post.description}</h4>
                                    <p>{post.content}</p>
                                </div>
                            )
                        })
                    ) : (
                        <div>No posts Found</div>
                    )}
                </div>
            ) : (
                <div>No Blog Found</div>
            )}

        </div>
    )
}


export default ViewBlog