import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">
                    <img src={require("./images/Logo.jpg")} alt="Tech Wave Logo"/>
                </Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/cart">Cart</Link></li>
                <li><Link to="/signin">Sign In</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/staff">Staff Dashboard</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
