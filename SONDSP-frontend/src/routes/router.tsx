import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppLayout } from '@/layouts/app-layout';
import { LoginPage } from '@/auth/login/login-page';
import { ResetPasswordPage } from '@/auth/reset-password/reset-password-page';
import { ForgotPasswordPage } from '@/auth/forgot-password/forgot-password-page';
import { ActivateAccountPage } from '@/auth/activate-account/activate-account-page';
import { DashboardPage } from './dashboard-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/esqueci-senha',
    element: <ForgotPasswordPage />
  },
  {
    path: '/redefinir-senha',
    element: <ResetPasswordPage />
  },
  {
    path: '/ativar-conta',
    element: <ActivateAccountPage />
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
