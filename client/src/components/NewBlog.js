import { useState } from "react"
import { Link } from "react-router-dom";

function NewBlog({ user }) {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isShared, setIsShared] = useState(0);
    const [coOwnerId, setCoOwnerId] = useState(0);

    if (!user) return <Link to="/login">Login</Link>;

    function handleSubmit(e) {
        e.preventDefault()
        setIsLoading(true);
        fetch("/blog", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
                co_owner_id: coOwnerId,
                is_shared: isShared
            }),
        }).then((r) => {
            setIsLoading(false);
            if (r.ok) {
                console.log(r);
            } else {
                console.log(r)
            }
        });
    }

    return (
        <div>
            <h2>Create Blog</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Title</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    rows="10"
                    cols="50"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="checkbox"
                    checked={isShared}
                    onChange={() => setIsShared((current) => current === 0 ? 1 : 0)}
                />
                {isShared ? (
                    <div>
                        <label htmlFor="coOwnerId">co owner smile</label>
                        <input
                            type="number"
                            id="coOwnerId"
                            value={coOwnerId}
                            onChange={(e) => setCoOwnerId(e.target.value)}
                        />
                    </div>
                ) : ""}
                <button type="submit">
                    {isLoading ? "Loading..." : "Submit"}
                </button>
            </form>
        </div>
    )
}

export default NewBlog