import React, { useState } from "react";
import "./Login.css";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
const LoginForm = () => {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [action, setAction] = useState("");
  const registerLink = () => {
    setAction(" active");
  };
  const loginLink = () => {
    setAction("");
  };

  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <div className={`wrapper${action}`}>
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
              type={isShowPassword === true ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <span onClick={() => setIsShowPassword(!isShowPassword)}>
              {isShowPassword ? (
                <FaRegEye className="icon" /> // Show when password is visible
              ) : (
                <FaRegEyeSlash className="icon" /> // Show when password is hidden
              )}
            </span>
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox"></input>Remember
            </label>
            <a href="#">Forgotten password?</a>
          </div>
          <button
            type="submit"
            className={Email && password ? "active " : ""}
            disabled={Email && password ? false : true}
          >
            Log in
          </button>
          <div className="register-link">
            <p>
              Don't have an account{" "}
              <a href="#" onClick={registerLink}>
                Register
              </a>
            </p>
          </div>
          <span className="line left"></span>
          <span className="center">Or</span>
          <span className="line right"></span> <br />
          <a href="#" class="btn google">
            Login with Google
          </a>
        </form>
      </div>

      <div className="form-box register">
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
          <div className="remember-forgot">
            <label>
              <input type="checkbox"></input> I agree to the
              <a href="#"> terms & conditions</a>
            </label>
          </div>
          <button type="submit" className={Email && password ? "active " : ""}>
            Register
          </button>
          <div className="register-link">
            <p>
              Already have an account?{" "}
              <a href="#" onClick={loginLink}>
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginForm;
