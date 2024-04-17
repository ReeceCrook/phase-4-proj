import React, { useEffect, useState } from 'react'

function Home() {

    function logout() {
        fetch("/logout", {
            method: "DELETE",
        }).then((r) => {
            console.log(r)
        });
    }

    return (
        <div className='homeDiv'>
            THIS IS HOME!!!!!!!!!!!!!!!!!!
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Home