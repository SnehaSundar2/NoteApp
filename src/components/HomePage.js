import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const userLoggedIn = true; // Replace with actual login state
  const navigate = useNavigate();

  if (!userLoggedIn) {
    // Redirect to login page if not logged in
    navigate("/login");
    return null;
  }

  return (
    <div className="homepage-container">
      <h1>Good Morning Deva!</h1>
    </div>
  );
};

export default HomePage;
