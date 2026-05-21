import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import ErrorPage from "../Shared/ErrorPage";
import ForgotPassword from "../auth/ForgotPassword";
import Login from "../auth/Login";
import NewPassword from "../auth/NewPassword";
import OTPVerifyPage from "../auth/OTPVerifyPage";
import AdminManage from "../dashboard/Admin/Admins";
import Dashboard from "../dashboard/Dashboard/Dashboard";
import Notification from "../dashboard/Notification/Notification";
import Settings from "../dashboard/Setting/Setting";
import Users from "../dashboard/Users/Users";
import Revenue from "../dashboard/Revenue/Revenue";
import Agents from "../dashboard/Agents/Agents";
import ListingsManagement from "../dashboard/ListingsManagement/ListingsManagement";
import EnquiriesPage from "../dashboard/Enquiries/EnquiriesPage";
import TransactionsPage from "../dashboard/Transactions/TransactionsPage";
import PushNotificationsPage from "../dashboard/Pushnotifications/Pushnotificationspage";
import PrivateRoute from "./PrivateRouter";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <PrivateRoute>
                <MainLayout />
            </PrivateRoute>
        ),
        errorElement: <ErrorPage />,
        children: [
            { path: "", element: <Dashboard /> },
            { path: "revenues", element: <Revenue /> },
            { path: "users", element: <Users /> },
            { path: "agents", element: <Agents /> },
            { path: "listing", element: <ListingsManagement /> },
            { path: "enquiries", element: <EnquiriesPage /> },
            { path: "transactions", element: <TransactionsPage /> },
            { path: "push-notifications", element: <PushNotificationsPage /> },
            { path: "admins", element: <AdminManage /> },
            { path: "setting", element: <Settings /> },
            { path: "notification", element: <Notification /> },
        ]
    },
    { path: "/login", element: <Login /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/otp-verify", element: <OTPVerifyPage /> },
    { path: "/new-password", element: <NewPassword /> },
])

export default router;
