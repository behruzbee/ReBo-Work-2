import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Layout from "../pages/layout"
import HomePage from "../pages/home"
import WorkersPage from "../pages/workers"
import CreateWorkerPage from "../pages/workers/create"
import UpdateWorkerPage from "../pages/workers/update"
import HistoriesPage from "../pages/histories"
import WorkerPage from "../pages/workers/worker"

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: '/histories',
                element: <HistoriesPage />
            },
            {
                path: '/workers',
                element: <WorkersPage />
            },
            {
                path: '/workers/worker/:id',
                element: <WorkerPage />
            },
            {
                path: '/workers/create',
                element: <CreateWorkerPage />
            },
            {
                path: '/workers/update/:id',
                element: <UpdateWorkerPage />
            },
        ]
    }
])

const Routing = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Routing