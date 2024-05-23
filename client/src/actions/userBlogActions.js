export const SET_USER_BLOGS = 'SET_USER_BLOGS'
export const ADD_USER_BLOG = 'ADD_USER_BLOG';
export const DELETE_USER_BLOG = 'DELETE_USER_BLOG';


export const setUserBlogs = (blogs) => ({
    type: SET_USER_BLOGS,
    payload: blogs,
});

export const addUserBlog = (blog) => ({
    type: ADD_USER_BLOG,
    payload: blog,
});


export const deleteUserBlog = (id) => ({
    type: DELETE_USER_BLOG,
    payload: id,
});