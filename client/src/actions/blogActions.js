export const SET_BLOGS = 'SET_BLOGS'
export const ADD_BLOG = 'ADD_BLOG';
export const DELETE_BLOG = 'DELETE_BLOG';


export const setBlogs = (blog) => ({
    type: SET_BLOGS,
    payload: blog,
});

export const addBlog = (blog) => ({
    type: ADD_BLOG,
    payload: blog,
});

export const deleteBlog = (id) => ({
    type: DELETE_BLOG,
    payload: id,
});