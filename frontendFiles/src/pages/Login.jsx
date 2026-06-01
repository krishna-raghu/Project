import React, { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";
import { Link,useNavigate } from "react-router-dom";
function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const loginUser = async () => {

    try {

      const response = await axios.post(
        "http://localhost:8080/auth/login",
        {
          email,
          password
        }
      );

      if(response.data === "Login Success") {

        alert("Login Successful");

        navigate("/graph");
      }
      else {

        alert(response.data);
      }

    } catch(error) {

      alert("Login Failed");

      console.error(error);
    }
  };
  

  return (

    <div className="page">

      <div className="card">

        <h1 className="card-title">
          Welcome Back
        </h1>

        <p className="card-sub">
          Please login to your account
        </p>

        <div className="field">

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

        </div>

        <div className="field">

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

        </div>

        <button
          className="btn-primary"
          onClick={loginUser}
        >
          Login
        </button>
        <p>
          Don't have an account?{" "}
          <Link to="/signup">
            Sign Up
          </Link>
        </p>
      </div>

    </div>

  );
}

export default Login;