
import { Helmet } from 'react-helmet-async';
// sections
import JwtNewPasswordView from 'src/sections/auth/jwt/jwt-new-password';

// ---------------------------------------------------------------------- 

export default function JwtNewPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Auth Classic: Forgot Password</title>
      </Helmet>
    <JwtNewPasswordView/>
    </>
  );
}
