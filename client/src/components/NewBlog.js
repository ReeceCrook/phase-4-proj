import "../css/NewBlog.css"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { addBlog } from '../actions/blogActions'

function NewBlog() {
    const user = useSelector((state) => state.user.user);
    //const blogs = useSelector((state) => state.blogs.blogs);
    const dispatch = useDispatch()

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
                    r.json().then((blog) => dispatch(addBlog((blog))));
                    nav("/profile")
                } else {
                    console.log(r)
                }
            });
        },
    });
    if (!user) return <Link to="/login">Please Login first</Link>;
    return (
        <div className="new-blog-wrapper">
            <h2>Create Blog</h2>
            <form onSubmit={formik.handleSubmit}>
                <label className='new-blog-label' htmlFor="name">Title</label><br />
                <input
                    type="text"
                    id="name"
                    className='new-blog-formfield'
                    value={formik.values.name}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}> {formik.errors.name}</p>
                <br /><br /><label className='new-blog-label' htmlFor="description">Description</label><br />
                <textarea
                    id="description"
                    name="description"
                    className='new-blog-formfield'
                    rows="10"
                    cols="50"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}> {formik.errors.description}</p>
                <label className='new-blog-label isShared' htmlFor="isShared">Add a  Co-Owner?</label>
                <input
                    type="checkbox"
                    id="isShared"
                    name="isShared"
                    className='new-blog-formfield'
                    checked={formik.values.isShared}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}> {formik.errors.isShared}</p>
                <br />
                {formik.values.isShared ? (
                    <div>
                        <label className='new-blog-label' htmlFor="coOwnerId">co-owner's user ID</label>
                        <input
                            className='new-blog-formfield'
                            type="number"
                            id="coOwnerId"
                            name="coOwnerId"
                            value={formik.values.coOwnerId}
                            onChange={formik.handleChange}
                        />
                        <p style={{ color: "red" }}> {formik.errors.coOwnerId}</p>
                    </div>
                ) : ""}
                <button className="new-blog-submit" type="submit">
                    {isLoading ? "Loading..." : "Submit"}
                </button>
            </form>
        </div>
    )
}

export default NewBlog