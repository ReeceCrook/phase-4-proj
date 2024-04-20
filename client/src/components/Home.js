import React, { useState } from 'react';
import { Link } from "react-router-dom";


function Home({ user }) {

    function logout() {
        fetch("/logout", {
            method: "DELETE",
        }).then((r) => {
            console.log(r)
            window.location.reload();
        });
    }

    return (
        <div className='homeDiv'>
            THIS IS HOME!!!!!!!!!!!!!!!!!!
            {user ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}
        </div>
    )
}

export default Home