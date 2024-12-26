import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false); // Update login state
    navigate("/login"); // Redirect to the login page
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>Keep Notes</h1>
      </div>
      <nav>
        <Link to="/">Homepage</Link>
        {isLoggedIn ? (
          <>
            <Link to="/notes">Notes</Link>
            <Link to="/account">Account</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
