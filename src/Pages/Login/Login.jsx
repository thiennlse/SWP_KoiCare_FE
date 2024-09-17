import React, { useState } from "react";
import "./Login.css";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
const LoginForm = () => {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form action="">
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Email"
              value={Email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <FaRegEyeSlash className="icon" />
          </div>
          <div className="remember">
            <label>
              <input type="checkbox"></input>Remember
            </label>
            {/* <a href="#">Quên mật khẩu?</a> */}
          </div>

          <button type="submit" className={Email && password ? "active " : ""}>
            Login
          </button>

          <div className="register-link">
            <p>
              Don't have an account <a href="#">Register</a>
            </p>
          </div>
        </form>
      </div>
      {/* <div className="form-box register">
        <form action="">
          <h1>Registration</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Email"
              value={Email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <FaRegEyeSlash className="icon" />
          </div>
          <div className="remember">
            <label>
              <input type="checkbox"></input>Remember
            </label>
            {/* <a href="#">Quên mật khẩu?</a> */}
      {/* </div> */}
      {/* <button type="submit" className={Email && password ? "active " : ""}>
            Login
          </button>

          <div className="register-link">
            <p>
              Don't have an account <a href="#">Register</a>
            </p>
          </div> */}
      {/* </form> */}
      {/* </div> */}
    </div>
  );
};
export default LoginForm;
