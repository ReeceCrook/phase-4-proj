import { useEffect, useState } from "react";
import { Link } from "react-router-dom";



function FavoriteList({ user, favorites, setFavorites }) {

    useEffect(() => {
        if (user) {
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
                setFavorites((currentFavorites) => {
                    const updatedFavorites = responses.filter(newFavorite =>
                        !currentFavorites.some(oldFavorite => oldFavorite.id === newFavorite.id)
                    );
                    return [...currentFavorites, ...updatedFavorites];
                });
            })
        }
    }, [user]);

    function deleteFavorite(id) {
        fetch(`/favorite/${id}`, {
            method: "DELETE",
        }).then((r) => {
            if (!r.ok) {
                throw new Error(r.statusText);
            }
        }).then(() => {
            setFavorites(favs => favs.filter(fav => fav.id !== id))

        }).catch(error => {
            console.error('Error deleting favorite:', error);
        });
    };

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
                    <Link to="/">
                        Browse Blogs
                    </Link>
                </div>
            }
        </div>
    )
}


export default FavoriteList