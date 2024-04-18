import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";


function Home({ user }) {
    const [trigger, setTrigger] = useState(false)

    function logout() {
        fetch("/logout", {
            method: "DELETE",
        }).then((r) => {
            console.log(r)
            setTrigger((current) => !current)
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