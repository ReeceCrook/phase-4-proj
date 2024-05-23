import { SET_FAVORITES, DELETE_FAVORITE, ADD_FAVORITE } from '../actions/favoriteActions';

const initialState = {
    favorites: [],
};

const favoritesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FAVORITES:
            return {
                ...state,
                favorites: action.payload,
            };
        case ADD_FAVORITE:
            return {
                ...state,
                favorites: [...state.favorites, action.payload],
            };
        case DELETE_FAVORITE:
            return {
                ...state,
                favorites: state.favorites.filter(post => post.id !== action.payload),
            };
        default:
            return state;
    }
};

export default favoritesReducer;