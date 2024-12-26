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
  const [loading, setLoading] = useState(false); // For loading state

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set loading state to true while waiting for response
    setLoading(true);
    setErrorMessage(""); // Reset error message on each submit

    try {
      const response = await axios.post("http://localhost:5000/api/signin", {
        user_email: email,
        password: password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token); // Save token to localStorage
        setLoading(false);
        navigate("/homepage"); // Redirect to homepage after successful login
      }
    } catch (error) {
      setLoading(false); // Stop loading
      setErrorMessage(
        error.response?.data?.message || "Invalid credentials or server error!"
      );
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
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="button-group">
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
