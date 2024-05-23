import { SET_POSTS, ADD_POST, DELETE_POST } from '../actions/postActions';

const initialState = {
    posts: [],
};

const postsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_POSTS:
            return {
                ...state,
                posts: action.payload,
            };
        case ADD_POST:
            return {
                ...state,
                posts: [...state.posts, action.payload],
            };
        case DELETE_POST:
            console.log(state.posts.filter(post => post.id === action.payload))
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.payload),
            };
        default:
            return state;
    }
};

export default postsReducer;