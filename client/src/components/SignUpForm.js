import React, { useState } from "react";
import { useFormik } from "formik";

function SignUpForm({ setSubmitted, formSchema }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true)
        fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        }).then((r) => {
            setIsLoading(false)
            if (r.ok) {
                setSubmitted(true);
            }
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
                type="text"
                id="username"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
            />
            &nbsp;<button type="submit">{isLoading ? "Loading..." : "Sign Up"}</button>
        </form>
    );
}

export default SignUpForm;