import { SET_BLOGS, ADD_BLOG, DELETE_BLOG } from '../actions/blogActions';

const initialState = {
    blogs: [],
};

const blogsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_BLOGS:
            return {
                ...state,
                blogs: action.payload,
            };
        case ADD_BLOG:
            return {
                ...state,
                blogs: [...state.blogs, action.payload],
            };
        case DELETE_BLOG:
            return {
                ...state,
                blogs: state.blogs.filter(blog => blog.id !== action.payload),
            };
        default:
            return state;
    }
};

export default blogsReducer;