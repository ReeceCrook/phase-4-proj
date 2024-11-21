import "../css/PostList.css"
import { useSelector } from "react-redux";


function PostList() {
    const posts = useSelector((state) => state.posts.posts);


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
                <h1 style={{ position: "absolute", top: "30%", left: "45%" }}>Loading Posts...</h1>
            }
        </div>
    )
}


export default PostList