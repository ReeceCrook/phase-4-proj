import { combineReducers } from 'redux';
import blogsReducer from './blogReducer';
import favoritesReducer from './favoriteReducer';
import userReducer from './userReducer';
import userBlogReducer from './userBlogReducer'
import postsReducer from './postReducer';

const rootReducer = combineReducers({
    user: userReducer,
    blogs: blogsReducer,
    userBlogs: userBlogReducer,
    posts: postsReducer,
    favorites: favoritesReducer,
});

export default rootReducer;