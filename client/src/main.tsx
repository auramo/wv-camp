import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import App from './App'
import ErrorPage from "./errorPage";
import './index.css'
import { LoginForm } from './LoginForm';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>
  },
  {
    path: "/login",
    element: <LoginForm/>,
    errorElement: <ErrorPage/>
  },
  {
    path: "/other",
    element: <div>other</div>
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
