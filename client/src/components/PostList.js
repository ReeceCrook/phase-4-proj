import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/PostList.css"
import { setPosts } from '../actions/postActions'
import { useSelector, useDispatch } from "react-redux";


function PostList() {
    const dispatch = useDispatch()
    const posts = useSelector((state) => state.posts.posts);

    useEffect(() => {
        fetch("/post")
            .then((r) => r.json())
            .then((r) => dispatch(setPosts(r)));
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
                    <Link to="/new-post">
                        Make a New Post
                    </Link>
                </div>
            }
        </div>
    )
}


export default PostList