import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

function Login({ setUser }) {
    const [showLogin, setShowLogin] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (submitted) {
            navigate("/");
        }

    }, [submitted])


    return (
        <div>
            {showLogin ?
                <div>
                    <LoginForm setUser={setUser} setSubmitted={setSubmitted} />
                    <p>
                        Don't have an account? &nbsp;
                        <button onClick={() => setShowLogin(false)}>
                            Sign Up
                        </button>
                    </p>
                </div> :
                <div>
                    <SignUpForm setSubmitted={setSubmitted} />
                    <p>
                        Already have an account? &nbsp;
                        <button onClick={() => setShowLogin(true)}>
                            Log In
                        </button>
                    </p>
                </div>
            }
        </div>

    )

}


export default Login;