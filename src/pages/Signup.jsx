import React, { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";

function Signup() {

  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const signupUser = async () => {

    try {

      const response = await axios.post(
        "http://localhost:8080/auth/signup",
        {
          username,
          email,
          password
        }
      );

      alert("Signup Successful");

      console.log(response.data);

    } catch(error) {

      alert("Signup Failed");

      console.error(error);
    }
  };

  return (

    <div className="page">

      <div className="card">

        <h1 className="card-title">
          Create Account
        </h1>

        <div className="field">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />

        </div>

        <div className="field">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

        </div>

        <div className="field">

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

        </div>

        <button
          className="btn-primary"
          onClick={signupUser}
        >
          Sign Up
        </button>

      </div>

    </div>

  );
}

export default Signup;