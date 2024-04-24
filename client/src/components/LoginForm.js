import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";


function LoginForm({ setUser, setSubmitted }) {
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = yup.object().shape({
        username: yup.string().required("Must enter a username").max(15).min(3),
        password: yup.string().required("Must enter password").max(20).min(5),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
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

    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
                type="text"
                id="username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
            />
            <p style={{ color: "red" }}> {formik.errors.username}</p>
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                name="password"
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