import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();

  // State for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for error messages
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/signin", {
        user_email: email,
        password: password,
      });

      if (response.status === 200) {
        setErrorMessage("");
        localStorage.setItem("token", response.data.token); // Save token to localStorage
        navigate("/homepage"); // Redirect to homepage
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid credentials!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Login</h2>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="button-group">
            <button type="submit" className="login-button">
              Login
            </button>
          </div>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
