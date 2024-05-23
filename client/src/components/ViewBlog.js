import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../css/BlogList.css"

function ViewBlog() {
    const { id } = useParams();
    const [blog, setBlog] = useState({})
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch(`/blog/${id}`)
            .then((r) => r.json().then(r => setBlog(r)))
    }, [id])

    useEffect(() => {
        if (Object.keys(blog).length) {
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

    return (
        <div>
            {blog.name ? (
                <div>
                    <h1><strong>Title:</strong> {blog.name}</h1><br />
                    <h3><strong>Created By:</strong> {blog.owner.username}</h3><br />
                    <h4><strong>Desciption:</strong> {blog.description}</h4> <br />
                    <div className='blogs-wrapper'>
                        {posts.length > 0 ? (
                            posts.map((post) => {
                                return (
                                    <div key={post.id} className="blogs" >
                                        <h2>Title: {post.title}</h2>
                                        <h4>Desciption: {post.description}</h4>
                                        <p>{post.content}</p>
                                    </div>
                                )
                            })
                        ) : (
                            <div>No posts Found</div>
                        )}
                    </div>

                </div>
            ) : (
                <div>No Blog Found</div>
            )
            }
        </div >
    )
}


export default ViewBlog