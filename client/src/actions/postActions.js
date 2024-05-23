export const SET_POSTS = 'SET_POSTS'
export const ADD_POST = 'ADD_POST';
export const DELETE_POST = 'DELETE_POST';


export const setPosts = (post) => ({
    type: SET_POSTS,
    payload: post,
});

export const addPost = (post) => ({
    type: ADD_POST,
    payload: post,
});

export const deletePost = (id) => ({
    type: DELETE_POST,
    payload: id,
});