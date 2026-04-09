import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./components/App/App.jsx";
import HomePage from "./components/Pages/HomePage.jsx";
import LoginPage from "./components/Pages/LoginPage.jsx";
import RegisterPage from "./components/Pages/RegisterPage.jsx";
import DashboardPage from "./components/Pages/DashboardPage.jsx";
import DeadlineForm from "./components/Pages/DeadlineForm.jsx";
import DeadlineListPage from "./components/Pages/DeadlineListPage.jsx";
import GroupListPage from "./components/Pages/GroupListPage.jsx";
import GroupForm from "./components/Pages/GroupForm.jsx";
import GroupDetailPage from "./components/Pages/GroupDetailPage.jsx";
import NotificationsPage from "./components/Pages/NotificationsPage.jsx";
import ProfilePage from "./components/Pages/ProfilePage.jsx";
import { AuthProvider } from './auth/AuthProvider';
import { NotificationProvider } from './contexts/NotificationContext.jsx';
import PrivateRoute from './auth/PrivateRoute';
import PublicRoute from './auth/PublicRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App />
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "login",
        element: <PublicRoute><LoginPage /></PublicRoute>,
      },
      {
        path: "register",
        element: <PublicRoute><RegisterPage /></PublicRoute>,
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        ),
      },
      {
        path: "deadlines",
        element: (
          <PrivateRoute>
            <DeadlineListPage />
          </PrivateRoute>
        ),
      },
      {
        path: "deadlines/new",
        element: (
          <PrivateRoute>
            <DeadlineForm />
          </PrivateRoute>
        ),
      },
      {
        path: "deadlines/:id",
        element: (
          <PrivateRoute>
            <DeadlineForm />
          </PrivateRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <PrivateRoute>
            <NotificationsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "groups",
        element: (
          <PrivateRoute>
            <GroupListPage />
          </PrivateRoute>
        ),
      },
      {
        path: "groups/new",
        element: (
          <PrivateRoute>
            <GroupForm />
          </PrivateRoute>
        ),
      },
      {
        path: "groups/:id",
        element: (
          <PrivateRoute>
            <GroupDetailPage />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
)
