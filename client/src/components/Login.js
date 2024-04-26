import { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

function Login({ setUser, user }) {
    const [showLogin, setShowLogin] = useState(true);

    function logout() {
        fetch("/logout", {
            method: "DELETE",
        }).then((r) => {
            setUser(null)
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
                        <LoginForm setUser={setUser} />
                        <p>
                            Don't have an account? &nbsp;
                            <button onClick={() => setShowLogin(false)}>
                                Sign Up
                            </button>
                        </p>
                    </div> :
                    <div>
                        <SignUpForm setUser={setUser} />
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