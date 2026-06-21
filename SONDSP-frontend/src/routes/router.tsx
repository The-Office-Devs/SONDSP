import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppLayout } from '@/layouts/app-layout';
import { LoginPage } from '@/auth/login/login-page';
import { ResetPasswordPage } from '@/auth/reset-password/reset-password-page';
import { ForgotPasswordPage } from '@/auth/forgot-password/forgot-password-page';
import { ActivateAccountPage } from '@/auth/activate-account/activate-account-page';
import { UsersPage } from '@/users/users-page/users-page';
import { SchoolsPage } from '@/schools/schools-page/schools-page';
import { ClassesPage } from '@/classes/classes-page/classes-page';
import { StudentsPage } from '@/students/students-page/students.page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/escolas" replace />,
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
      {
        path: 'gerenciamento',
        children: [
          { path: 'usuarios', element: <UsersPage /> },
          { path: 'escolas', element: <SchoolsPage /> },
          { path: 'turmas', element: <ClassesPage /> },
          { path: 'alunos', element: <StudentsPage /> },
        ]
      }
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
