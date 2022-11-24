import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "../redux/hooks";

export default function PrivateRoute() {
    const { user } = useSelector(state => state.account);
    return user ? <Outlet /> : <Navigate to="/login" />
}