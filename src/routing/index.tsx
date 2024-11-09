import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Layout from "../pages/layout"
import HomePage from "../pages/home"
import WorkersPage from "../pages/workers"
import CreateWorkerPage from "../pages/workers/create"
import UpdateWorkerPage from "../pages/workers/update"
import HistoriesPage from "../pages/histories"
import WorkerPage from "../pages/workers/worker"
import PenaltiesPage from "../pages/penalties"
import PenaltyCreatePage from "../pages/penalties/create"
import LoginPage from "../pages/login"

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
    const isAuthenticated = sessionStorage.getItem('auth');
    return isAuthenticated ? element : <LoginPage />;
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <ProtectedRoute element={<HomePage />} />
            },
            {
                path: '/histories',
                element: <ProtectedRoute element={<HistoriesPage />} />
            },
            {
                path: '/workers',
                element: <ProtectedRoute element={<WorkersPage />} />
            },
            {
                path: '/workers/worker/:id',
                element: <ProtectedRoute element={<WorkerPage />} />
            },
            {
                path: '/workers/create',
                element: <ProtectedRoute element={<CreateWorkerPage />} />
            },
            {
                path: '/workers/update/:id',
                element: <ProtectedRoute element={<UpdateWorkerPage />} />
            },
            {
                path: '/penalties',
                element: <ProtectedRoute element={<PenaltiesPage />} />
            },
            {
                path: '/penalties/create',
                element: <ProtectedRoute element={<PenaltyCreatePage />} />
            },
            {
                path: '/login',
                element: <LoginPage />
            },
        ]
    }
]);


const Routing = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Routing