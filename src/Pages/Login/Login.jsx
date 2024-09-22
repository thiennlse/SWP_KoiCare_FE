import React, { useState } from "react";
import "./Login.css";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";

const LoginForm = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [action, setAction] = useState("");

  const registerLink = () => {
    setAction(" active");
  };
  const loginLink = () => {
    setAction("");
  };

  const checkPassword = () => {
    if (registerPassword !== confirmPassword) alert("Wrong Password!");
  };

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  return (
    <div className={`wrapper${action}`}>
      <div className="form-box login">
        <form action="">
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type={isShowPassword === true ? "text" : "password"}
              placeholder="Password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
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
            className={loginEmail && loginPassword ? "active " : ""}
            disabled={loginEmail && loginPassword ? false : true}
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
              value={registerEmail}
              onChange={(event) => setRegisterEmail(event.target.value)}
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type={isShowPassword === true ? "text" : "password"}
              placeholder="Password"
              value={registerPassword}
              onChange={(event) => setRegisterPassword(event.target.value)}
            />
            <span onClick={() => setIsShowPassword(!isShowPassword)}>
              {isShowPassword ? (
                <FaRegEye className="icon" /> // Show when password is visible
              ) : (
                <FaRegEyeSlash className="icon" /> // Show when password is hidden
              )}
            </span>
          </div>
          <div className="input-box">
            <input
              type={isShowConfirmPassword === true ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
            >
              {isShowConfirmPassword ? (
                <FaRegEye className="icon" /> // Show when password is visible
              ) : (
                <FaRegEyeSlash className="icon" /> // Show when password is hidden
              )}
            </span>
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox"></input> I agree to the
              <a href="#"> terms & conditions</a>
            </label>
          </div>
          <button
            type="submit"
            className={registerEmail && registerPassword ? "active " : ""}
            onClick={checkPassword}
          >
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
