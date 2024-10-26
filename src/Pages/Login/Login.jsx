import React, { useEffect, useState } from "react";
import "./Login.css";
import { FaUser } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import CryptoJS from "crypto-js";

const LoginForm = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const [action, setAction] = useState("");
  const navigate = useNavigate();

  const registerLink = () => {
    setAction("active");
  };
  const loginLink = () => {
    setAction("");
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    if (savedEmail) setLoginEmail(savedEmail);
    if (savedPassword)
      setLoginPassword(
        CryptoJS.AES.decrypt(savedPassword, "secret-key").toString(
          CryptoJS.enc.Utf8
        )
      );
  }, []);

  const [checkBox, setCheckBox] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const isValidPassword = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    return (
      password.length >= minLength &&
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialChar
    );
  };



  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      let res = await axios.post(
        "https://koicareapi.azurewebsites.net/api/Member/login",
        {
          email: loginEmail,
          password: loginPassword,
        }
      );
      const token = res.data.token;
      if (rememberMe) {
        localStorage.setItem("email", loginEmail);
        const encryptedPassword = CryptoJS.AES.encrypt(
          loginPassword,
          "secret-key"
        ).toString();
        localStorage.setItem("password", encryptedPassword);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }

      setLoginEmail("");
      setLoginPassword("");

      if (res) {
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("userId", JSON.stringify(res.data.userId));
        localStorage.setItem("role", JSON.stringify(res.data.role));
        localStorage.setItem("emailUser", JSON.stringify(loginEmail));

        if (res.data.role === "Admin") {
          console.log("Navigating to /admin");
          window.location.href = "/admin";
        } else {
          console.log("Navigating to /");
          toast.success("Login successful!", { autoClose: 1500 });
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      }
    } catch (error) {
      toast.error("Login failed!", { autoClose: 1500 });
      console.error("Login Error:", error);
    }
  };
  const handleRegister = async (event) => {
    event.preventDefault();

    if (!registerEmail.endsWith("@gmail.com")) {
      toast.error("Email must end with @gmail.com!");
      return;
    }

    if (!isValidPassword(registerPassword)) {
      toast.error(
        "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character!"
      );
      return;
    }

    if (registerPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "https://koicareapi.azurewebsites.net/api/Member/register",
        {
          email: registerEmail,
          password: registerPassword,
        }
      );

      toast.success("Registration successful! Please log in.");
      setAction("");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data.message === "Email đã được sử dụng") {
          toast.error("This email is already registered.", { autoClose: 1500 });
        } else {
          toast.error("Registration failed, please try again.", {
            autoClose: 1500,
          });
        }
      } else {
        toast.error("Registration failed, please try again.", {
          autoClose: 1500,
        });
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className={`wrapper ${action}`}>
        <div className="form-box login">
          <form>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                autoComplete="email"
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
                <input
                  type="checkbox"
                  onChange={(e) => setRememberMe(e.target.checked)}
                ></input>
                Remember
              </label>
              <a href="#">Forgotten password?</a>
            </div>
            <button
              className="login_button"
              type="submit"
              disabled={loginEmail && loginPassword ? false : true}
              onClick={handleLogin}
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
            <a href="/">Home</a>
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
