import React from "react";
import { NavLink } from "react-router-dom";
import "../css/NavBar.css"

function NavBar() {



    return (
        <div className='NavWrapper'>
            &nbsp;<NavLink
                to="/"
                activeclassname="active"
                exact="true"
            >
                Home
            </NavLink>
            &nbsp;<NavLink
                to="/login"
                exact="true"
                activeclassname="active"
            >
                Login
            </NavLink>
            &nbsp;<NavLink
                to="/posts"
                exact="true"
                activeclassname="active"
            >
                Posts
            </NavLink>
            &nbsp;<NavLink
                to="/new-post"
                exact="true"
                activeclassname="active"
            >
                New Post
            </NavLink>
        </div>
    );
}


export default NavBar