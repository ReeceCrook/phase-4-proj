import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

function NewBlog({ user }) {
    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate()

    const formSchema = yup.object().shape({
        name: yup.string().required("Must enter a title").max(50).min(5),
        description: yup.string().required("Must enter a description").max(250).min(15),
        isShared: yup.boolean().required(),
        coOwnerId: yup.number().when('isShared', {
            is: (value) => value === true,
            then: () => yup.number().required('Co Owner is required'),
            otherwise: (schema) => schema
        })
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            isShared: false,
            coOwnerId: 0,
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            setIsLoading(true);
            fetch("/blog", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            }).then((r) => {
                setIsLoading(false)
                if (r.ok) {
                    nav("/profile")
                    window.location.reload();
                } else {
                    console.log(r)
                }
            });
        },
    });
    if (!user) return <Link to="/login">Please Login first</Link>;
    return (
        <div>
            <h2>Create Blog</h2>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="name">Title</label>
                <input
                    type="text"
                    id="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}> {formik.errors.name}</p>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    rows="10"
                    cols="50"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}> {formik.errors.description}</p>
                <label htmlFor="isShared">Add a  Co-Owner?</label>
                <input
                    type="checkbox"
                    id="isShared"
                    checked={formik.values.isShared}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}> {formik.errors.isShared}</p>

                {formik.values.isShared ? (
                    <div>
                        <label htmlFor="coOwnerId">co-owner's user ID</label>
                        <input
                            type="number"
                            id="coOwnerId"
                            value={formik.values.coOwnerId}
                            onChange={formik.handleChange}
                        />
                        <p style={{ color: "red" }}> {formik.errors.coOwnerId}</p>
                    </div>
                ) : ""}
                <button type="submit">
                    {isLoading ? "Loading..." : "Submit"}
                </button>
            </form>
        </div>
    )
}

export default NewBlog