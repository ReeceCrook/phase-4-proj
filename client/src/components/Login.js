import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

function Login({ setUser, user }) {
    const [showLogin, setShowLogin] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        if (submitted) {
            nav("/");
            window.location.reload();
        }

    }, [submitted])

    function logout() {
        fetch("/logout", {
            method: "DELETE",
        }).then((r) => {
            console.log(r)
            window.location.reload();
        });
    }

    return (
        <div>
            {user ? (
                <div>
                    Already logged in<br />
                    <button onClick={logout}>Logout</button>
                </div>) :
                showLogin ?
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