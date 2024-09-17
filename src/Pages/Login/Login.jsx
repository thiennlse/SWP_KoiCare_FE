import React, { useState } from "react";
import "./Login.css";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
const LoginForm = () => {
  const [usernmame, setUsernmame] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="wrapper">
      <form action="">
        <h1>Login</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            value={usernmame}
            onChange={(event) => setUsernmame(event.target.value)}
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
          <FaLock className="icon" />
        </div>
        <div className="remember">
          <label>
            <input type="checkbox"></input>Remember
          </label>
          {/* <a href="#">Quên mật khẩu?</a> */}
        </div>

        <button
          type="submit"
          className={usernmame && password ? "active " : ""}
        >
          Login
        </button>

        <div className="register-link">
          <p>
            Don't have an account <a href="#">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
};
export default LoginForm;
