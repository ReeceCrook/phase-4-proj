import React from "react";
import { NavLink } from "react-router-dom";
import "../css/NavBar.css"

function NavBar({ user }) {


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
                to="/blogs"
                exact="true"
                activeclassname="active"
            >
                Blogs
            </NavLink>
            &nbsp;<NavLink
                to="/profile"
                exact="true"
                activeclassname="active"
            >
                Profile
            </NavLink>
            {user ? <div>
                &nbsp;<NavLink
                    to="/favorites"
                    exact="true"
                    activeclassname="active"
                >
                    My Favorites
                </NavLink> </div> : ""}
        </div>
    );
}


export default NavBar