import { Link } from "react-router-dom"
import { useState } from "react"

const Navbar = () => {

    const clearStorage = () =>{
        console.log("hi")
    }

    const [role, setRole] = useState("student")
    const [loggedIn, setLoggedIn] = useState(true)

  return (
    <nav>
      <Link className="navName" to={"/"}>
        <img src="./MDC.png"></img>
        <h3>AI Tutor</h3>
      </Link>

      <div>
        {role === "student" && (
          <Link className="navItem" to={"/tutor"}>
            Tutor
          </Link>
        )}
        {role === "teacher" && (
          <Link className="navItem" to={"/dashboard"}>
            Dashboard
          </Link>
        )}
        <Link className="navItem" to={"/login"}>
          Login
        </Link>
        <Link className="navItem" to={"/signup"}>
          Signup
        </Link>
        {loggedIn && (
          <Link className="navItem" onClick={clearStorage}>
            Logout
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar