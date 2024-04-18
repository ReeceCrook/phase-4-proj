import { useState } from "react";

function NewPost() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [content, setContent] = useState("")

    function handleSubmit(e) {
        e.preventDefault();
        fetch("/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                description,
                content: content,
            }),
        })
    }

    return (
        <div>
            <h2>Create Post</h2>
            <form>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    rows="10"
                    cols="50"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                >
                </textarea>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    rows="10"
                    cols="50"
                    value={title}
                    onChange={(e) => setContent(e.target.value)}
                >
                </textarea>
            </form>
            <button type="submit" onSubmit={handleSubmit}>Submit Post</button>
        </div>
    )
}


export default NewPost