import React from 'react';
import './SignInForm.css';

const SignInForm = ({ title, onSignIn }) => {
  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={onSignIn}>
        <h2>{title}</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignInForm;
