import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { GuestGuard } from 'src/auth/guard';
// components
import { SplashScreen } from 'src/components/loading-screen';
import AuthModernCompactLayout from 'src/layouts/auth/modern-compact';

// ----------------------------------------------------------------------

// JWT
const JwtLoginPage = lazy(() => import('src/pages/auth/jwt/login'));
const JwtRegisterPage = lazy(() => import('src/pages/auth/jwt/register'));
const JwtForgetPasswordPage = lazy(() => import('src/pages/auth/jwt/forgot-password'));
const JwtNewPasswordPage = lazy(() => import('src/pages/auth/jwt/new-password'));
const JwtVerifyPasswordPage = lazy(() => import('src/pages/auth/jwt/verify'));

// ----------------------------------------------------------------------

const authJwt = {
  path: 'jwt',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <AuthModernCompactLayout>
          <JwtLoginPage />
        </AuthModernCompactLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthModernCompactLayout>
          <JwtRegisterPage />
        </AuthModernCompactLayout>
      ),
    },
    {
      path: 'forgot-password',
      element: (
        <AuthModernCompactLayout>
          <JwtForgetPasswordPage />
        </AuthModernCompactLayout>
      ),
    },
    {
      path: 'new-password',
      element: (
        <AuthModernCompactLayout>
          <JwtNewPasswordPage />
        </AuthModernCompactLayout>
      ),
    },
    {
      path: 'verify',
      element: (
        <AuthModernCompactLayout>
          <JwtVerifyPasswordPage />
        </AuthModernCompactLayout>
      ),
    },
  ],
};

export const authRoutes = [
  {
    path: 'auth',
    children: [authJwt],
  },
];
