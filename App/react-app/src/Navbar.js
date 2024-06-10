import React from "react";
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">Brand</div>
            <ul className="navbar-links">
                <li><a href="#shop">Shop</a></li>
                <li><a href="#cart">Cart</a></li>
                <li><a href="#signin">Sign In</a></li>
                <li><a href="#signin">Register</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;