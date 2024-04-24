import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/PostList.css"

function PostList() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch("/post")
            .then((r) => r.json())
            .then(setPosts);
    }, []);

    return (
        <div className="posts-wrapper">
            {posts.length > 0 ? posts.map((post) => {
                return (
                    <div key={post.id} className="posts">
                        <h2>Title: <br /> {post.title}</h2>
                        <p >
                            Description:<br></br>
                            {post.description}

                        </p>
                        <p>
                            Content:<br></br>
                            {post.content}
                        </p>
                    </div>
                )
            }) :
                <div>
                    <h2>No Posts Found</h2>
                    <button as={Link} to="/new-post">
                        Make a New Post
                    </button>
                </div>
            }
        </div>
    )
}


export default PostList