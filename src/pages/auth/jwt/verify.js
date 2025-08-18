import { Helmet } from 'react-helmet-async';

// sections
import JwtVerifyView from 'src/sections/auth/jwt/jwt-verify';

// ---------------------------------------------------------------------- 

export default function JwtVerifyPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Auth Classic: Forgot Password</title>
      </Helmet>

    <JwtVerifyView/>
    </>
  );
}
