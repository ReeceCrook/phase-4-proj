export const SET_FAVORITES = 'SET_FAVORITES';
export const ADD_FAVORITE = 'ADD_FAVORITE'
export const DELETE_FAVORITE = 'DELETE_FAVORITE';

export const setFavorites = (favorites) => ({
    type: SET_FAVORITES,
    payload: favorites,
});

export const addFavorite = (favorite) => ({
    type: ADD_FAVORITE,
    payload: favorite,
});

export const deleteFavorite = (id) => ({
    type: DELETE_FAVORITE,
    payload: id,
});