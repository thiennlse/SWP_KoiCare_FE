import React, { useState } from "react";
import "./Login.css";
import { FaUser } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const LoginForm = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [action, setAction] = useState("");
  const navigate = useNavigate();

  const registerLink = () => {
    setAction("active");
  };
  const loginLink = () => {
    setAction("");
  };

  // const checkPassword = () => {
  //   registerPassword !== confirmPassword
  //     ? toast.error("Wrong Password!")
  //     : toast.success("Register Successful");
  // };

  const [checkBox, setCheckBox] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://koicare.azurewebsites.net/api/Member/login",
        {
          email: loginEmail,
          password: loginPassword,
        }
      );
      toast.success("thanh cong");
      navigate("/");
      setLoginEmail("");
      setLoginPassword("");
      console.log("Login successful:", response.data);
    } catch (error) {
      toast.error("that bai me roi");
      if (error.response) {
        console.log("Login error:", error.response.data);
      } else {
      }
    }
  };

  const handleRegister = (event) => {
    event.preventDefault();
    if (registerPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    axios
      .post("https://koicare.azurewebsites.net/api/Member/register", {
        email: registerEmail,
        password: registerPassword,
      })
      .then((response) => {
        console.log("Registration Successful:", response.data);
        toast.success("Registration successful! Please log in.");
        setAction("");
      })
      .catch((error) => {
        console.error("Registration Error:", error);
        toast.error("Registration failed, please try again.");
      });
  };

  return (
    <div className="login-wrapper">
      <div className={`wrapper ${action}`}>
        <div className="form-box login">
          <form onSubmit={handleLogin}>
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
                  <FaRegEye className="icon" />
                ) : (
                  <FaRegEyeSlash className="icon" />
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
              className="login_button"
              type="submit"
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
            <a href="#" className="btn google">
              Login with Google
            </a>
          </form>
        </div>

        <div className="form-box register">
          <form onSubmit={handleRegister}>
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
                  <FaRegEye className="icon" />
                ) : (
                  <FaRegEyeSlash className="icon" />
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
                  <FaRegEye className="icon" />
                ) : (
                  <FaRegEyeSlash className="icon" />
                )}
              </span>
            </div>

            <div className="remember-forgot">
              <label>
                <input
                  type="checkbox"
                  onChange={(event) => setCheckBox(!checkBox)}
                ></input>{" "}
                I agree to the
                <a href="#"> terms & conditions</a>
              </label>
            </div>
            <button
              className="register_button"
              type="submit"
              // onClick={checkPassword}
              disabled={
                registerEmail && registerPassword && confirmPassword && checkBox
                  ? false
                  : true
              }
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
      <ToastContainer />
    </div>
  );
};
export default LoginForm;
