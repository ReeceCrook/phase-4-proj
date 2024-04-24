import React from "react";
import { NavLink } from "react-router-dom";
import "../css/NavBar.css"

function NavBar({ user }) {


    return (
        <div className='nav-wrapper'>
            <NavLink
                to="/"
                exact="true"
                className="nav"
                activeclassname="active"
            >
                Home
            </NavLink>
            <NavLink
                to="/posts"
                exact="true"
                className="nav"
                activeclassname="active"
            >
                Posts
            </NavLink>
            <NavLink
                to="/new-blog"
                exact="true"
                className="nav"
                activeclassname="active"
            >
                Start new Blog
            </NavLink>

            <NavLink
                to="/new-post"
                exact="true"
                className="nav"
                activeclassname="active"
            >
                Add new Post
            </NavLink>
            <NavLink
                to="/profile"
                exact="true"
                className="nav"
                activeclassname="active"
            >
                Profile
            </NavLink>
            {user ?
                <NavLink
                    to="/favorites"
                    exact="true"
                    className="nav"
                    activeclassname="active"
                >
                    My Favorites
                </NavLink> : ""}
        </div>
    );
}


export default NavBar