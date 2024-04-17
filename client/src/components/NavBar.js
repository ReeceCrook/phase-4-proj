import React from "react";
import { NavLink } from "react-router-dom";
import "../css/NavBar.css"

function NavBar() {


    return (
        <div className='NavWrapper'>
            <NavLink
                to="/"
                activeclassname="active"
                exact="true"
            >
                Home
            </NavLink>
            <NavLink
                to="/sign-up"
                exact="true"
                activeclassname="active"
            >
                Sign Up
            </NavLink>
            <NavLink
                to="/login"
                exact="true"
                activeclassname="active"
            >
                Login
            </NavLink>
            <NavLink
                to="/check"
                exact="true"
                activeclassname="active"
            >
                Check Session
            </NavLink>
        </div>
    );
}


export default NavBar