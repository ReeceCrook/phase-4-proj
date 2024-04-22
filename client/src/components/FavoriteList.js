import { useEffect, useState } from "react";
import { Link } from "react-router-dom";



function FavoriteList({ user }) {
    const [favorites, setFavorites] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            Promise.all(user.favorite_blogs.map((blog) =>
                fetch(`/blog/${blog.id}`)
                    .then((r) => {
                        if (r.ok) {
                            return r.json();
                        } else {
                            throw new Error(r.statusText);
                        }
                    })
            )).then((responses) => {
                setFavorites(responses.flat());
                setIsLoading(false);
            })
        }
    }, [user]);

    function deleteFavorite(id) {
        fetch(`/favorite/${id}`, {
            method: "DELETE",
        }).then((r) => {
            console.log(r)
            window.location.reload();
        });
    }

    return (
        <div>
            {favorites.length > 0 ? favorites.map((favorite) => {
                return (
                    <div key={favorite.id}>
                        <h2>Title: {favorite.name}</h2>
                        <p>
                            Description:<br />
                            {favorite.description}<br />

                            Date Created:<br />
                            {favorite.date_created}
                        </p>
                        This post was created by: {favorite.users.map((user) => {
                            return (
                                <div key={user.id}>
                                    <h3>{user.username}</h3>
                                </div>
                            )
                        })}
                        <button onClick={() => deleteFavorite(favorite.id)}>Delete Favorite</button>
                    </div>
                )
            }) :
                <div>
                    <h2>No favorites Found</h2>
                    <Link to="/blogs">
                        Browse Blogs
                    </Link>
                </div>
            }
        </div>
    )
}


export default FavoriteList