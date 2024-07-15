import React from 'react';
import SignInForm from './SignInForm';

const SignIn = ({ onSignIn }) => {
  return <SignInForm title="User Sign In" onSignIn={onSignIn} />;
};

export default SignIn;
