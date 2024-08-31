import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../actions/userActions"



function Login() {
    const dispatch = useDispatch()
    const [showLogin, setShowLogin] = useState(true);
    const user = useSelector((state) => state.user.user);


    function logout() {
        fetch("/logout", {
            method: "DELETE",
        }).then((r) => {
            dispatch(setUser(null))
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
                        <LoginForm />
                        <p>
                            Don't have an account? &nbsp;
                            <button onClick={() => setShowLogin(false)}>
                                Sign Up
                            </button>
                        </p>
                    </div> :
                    <div>
                        <SignUpForm />
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