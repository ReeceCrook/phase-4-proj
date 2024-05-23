import { SET_USER_BLOGS, ADD_USER_BLOG, DELETE_USER_BLOG } from '../actions/userBlogActions';

const initialState = {
    userBlogs: [],
};

const userBlogsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_BLOGS:
            return {
                ...state,
                userBlogs: action.payload,
            };
        case ADD_USER_BLOG:
            return {
                ...state,
                userBlogs: [...state.userBlogs, action.payload],
            };
        case DELETE_USER_BLOG:
            return {
                ...state,
                userBlogs: state.userBlogs.filter(blog => blog.id !== action.payload),
            };
        default:
            return state;
    }
};

export default userBlogsReducer;