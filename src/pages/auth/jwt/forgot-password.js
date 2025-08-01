import { Helmet } from 'react-helmet-async';
// sections

import JwtForgotPasswordView from 'src/sections/auth/jwt/jwt-forgot-password';

// ---------------------------------------------------------------------- 

export default function JwtForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Auth Classic: Forgot Password</title>
      </Helmet>

      <JwtForgotPasswordView />
    </>
  );
}
