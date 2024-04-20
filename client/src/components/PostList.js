import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function PostList() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch("/post")
            .then((r) => r.json())
            .then(setPosts);
    }, []);

    return (
        <div>
            {posts.length > 0 ? posts.map((post) => {
                return (
                    <div key={post.id}>
                        <h2>Title: {post.title}</h2>
                        <p>
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