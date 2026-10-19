import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/routes/protected-route';
import { AppLayout } from '@/layouts/app-layout';
import { HomeRedirect, RoleRoute } from './role-route';

import { LoginPage } from '@/auth/login/login-page';
import { ResetPasswordPage } from '@/auth/reset-password/reset-password-page';
import { ForgotPasswordPage } from '@/auth/forgot-password/forgot-password-page';
import { ActivateAccountPage } from '@/auth/activate-account/activate-account-page';

import { UsersPage } from '@/users/users-page/users-page';
import { SchoolsPage } from '@/schools/schools-page/schools-page';
import { ClassesPage } from '@/classes/classes-page/classes-page';
import { StudentsPage } from '@/students/students-page/students.page';
import { ActivitiesPage } from '@/activities/activities-page/activities-page';

import { SurveysPage } from '@/surveys/surveys-page/surveys-page';
import { SurveysHistoryPage } from '@/surveys/surveys-history/surveys-history-page';
import { ClassesFilterPage } from '@/classes/classes-filter-page/classes-filter-page';
import { ClassDetailsPage } from '@/classes/class-details-page/class-details-page';
import { StudentPortfolioPage } from '@/students/student-portfolio/student-portfolio-page';
import { ClassMapPage } from '@/class-map/class-map-page/class-map-page';
import { LearningTrajectoriesPage } from '@/learning-trajectories/learning-trajectories-page/learning-trajectories-page';
import { StudentsFilterPage } from '@/students/students-filter-page/students-filter-page';
import { HelpCenterPage } from '@/help-center/help-center.page';

export const router = createBrowserRouter([
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
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <HomeRedirect /> },
          {
            element: <RoleRoute area="admin" />,
            children: [
              {
                path: 'gerenciamento',
                children: [
                  { index: true, element: <Navigate to="usuarios" replace /> },
                  { path: 'alunos', element: <StudentsPage /> },
                  { path: 'escolas', element: <SchoolsPage /> },
                  { path: 'modelos-atividades', element: <ActivitiesPage /> },
                  { path: 'usuarios', element: <UsersPage /> },
                  { path: 'turmas', element: <ClassesPage /> },
                ],
              },
            ],
          },
          {
            element: <RoleRoute area="application" />,
            children: [
              { path: 'app-alunos/', element: <StudentsFilterPage /> },
              { path: 'app-alunos/portfolio/aluno/:id', element: <StudentPortfolioPage /> },
              { path: 'app-mapa-classe', element: <ClassMapPage /> },
              { path: 'app-sondagens', element: <SurveysPage /> },
              { path: 'app-sondagens/historico/aluno/:id', element: <SurveysHistoryPage /> },
              { path: 'app-trajetorias-aprendizagem', element: <LearningTrajectoriesPage /> },
              { path: 'app-turmas', element: <ClassesFilterPage />},
              { path: 'app-turmas/turma/:id', element: <ClassDetailsPage />},
            ],
          },
          { path: 'ajuda', element: <HelpCenterPage /> },
        ]
      }
    ],
  },
  { path: '*', element: <HomeRedirect /> },
]);