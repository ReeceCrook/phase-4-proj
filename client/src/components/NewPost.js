import { useState } from "react";

function NewPost() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [content, setContent] = useState("")
    const [isLoading, setIsLoading] = useState(false);


    function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true)
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
        }).then((r) => {
            setIsLoading(false)
            console.log(r)
        })
    }

    return (
        <div>
            <h2>Create Post</h2>
            <form onSubmit={handleSubmit}>
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
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                >
                </textarea>
                <button type="submit">{isLoading ? "Loading..." : "Submit Post"}</button>
            </form>

        </div>
    )
}


export default NewPost