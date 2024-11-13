import { createBrowserRouter } from "react-router-dom";

// Páginas comunes
import App from "../App";
import HomePage from "../Views/HomePage";
import LoginPage from "../Views/LoginPage";
import SignUpPage from "../Views/SignUpPage";
import ChangePassword from "../Views/ChangePassword";
import MainPage from "../Views/MainPage";
import ModifyUserPage from "../Views/ModifyUserPage";
import ProjectPage from "../Views/ProjectPage";
import NewProjectPage from "../Views/NewProjectPage";
import SearchedProjectPage from "../Views/SearchedProjectPage";

// Páginas de administración
import DonationsManagement from "../Views/admin/DonationsManagement";
import UserManagement from "../Views/admin/UserManagement";
import ProjectValidation from "../Views/admin/ProjectValidation";
import EventConfiguration from "../Views/admin/EventConfiguration";

// Configuración de rutas
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Rutas públicas
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
      
      // Rutas de usuario
      {
        path: "/user-settings",
        element: <ModifyUserPage />,
      },
      {
        path: "/main-page",
        element: <MainPage />,
      },
      {
        path: "/new-project",
        element: <NewProjectPage />,
      },
      {
        path: "/project",
        element: <ProjectPage />,
      },
      {
        path: "/search/categories",
        element: <SearchedProjectPage />,
      },

      // Rutas de administrador (solo accesibles para usuarios con rol "admin")
      {
        path: "/admin/donations-management",
        element: <DonationsManagement />,
      },
      {
        path: "/admin/user-management",
        element: <UserManagement />,
      },
      {
        path: "/admin/validate-projects",
        element: <ProjectValidation />,
      },
      {
        path: "/admin/event-configuration",
        element: <EventConfiguration />,
      },
    ],
  },
]);
