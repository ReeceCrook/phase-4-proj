import React, { useState } from "react";
import { useFormik } from "formik";

function LoginForm({ setUser, setSubmitted, formSchema }) {
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: "",
            password: "",
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            setIsLoading(true);
            fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            }).then((r) => {
                setIsLoading(false);
                if (r.ok) {
                    setSubmitted(true);
                    r.json().then((user) => setUser(user));
                }
            });
        },
    });

    // function handleSubmit(e) {
    //     e.preventDefault();
    //     setIsLoading(true);
    //     fetch("/login", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ username, password }),
    //     }).then((r) => {
    //         setIsLoading(false);
    //         if (r.ok) {
    //             setSubmitted(true);
    //             r.json().then((user) => setUser(user));
    //         }
    //     });
    // }

    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
                type="text"
                id="username"
                value={formik.values.username}
                onChange={formik.handleChange}
            />
            <p style={{ color: "red" }}> {formik.errors.username}</p>
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
            />
            <p style={{ color: "red" }}> {formik.errors.password}</p>
            &nbsp;<button type="submit">
                {isLoading ? "Loading..." : "Login"}
            </button>

        </form>
    );
}

export default LoginForm;