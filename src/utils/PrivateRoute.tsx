import { Navigate, Outlet } from "react-router-dom";
import { MainLayout } from "../pages/Layout/MainLayout";
import { useSelector } from "../redux/hooks";

export default function PrivateRoute() {
    const { user } = useSelector(state => state.account);
    return user ? <MainLayout /> : <Navigate to="/login" />
}