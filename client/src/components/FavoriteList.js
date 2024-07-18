import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFavorites, deleteFavorite as deleteFavoriteAction } from "../actions/favoriteActions";
import { Link } from "react-router-dom";
import "../css/FavoriteList.css"


function FavoriteList() {
    const user = useSelector((state) => state.user.user)
    const favorites = useSelector((state) => state.favorites.favorites);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            fetch(`/user/${user.id}`)
                .then((r) => {
                    if (r.ok) {
                        return r.json();
                    } else {
                        throw new Error(r.statusText);
                    }
                }).then(r => dispatch(setFavorites(r.favorite_blogs)))
        }
    }, [user])

    function deleteFavorite(id) {
        fetch(`/favorite/${id}`, {
            method: "DELETE",
        }).then((r) => {
            if (!r.ok) {
                throw new Error(r.statusText);
            }
            dispatch(deleteFavoriteAction(id));
        }).catch(error => {
            console.error('Error deleting favorite:', error);
        });
    };

    return (
        <div className="favorites-wrapper">
            {user && favorites.length ? favorites.map((favorite) => {
                return (
                    <div key={favorite.id} className="favorite">
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