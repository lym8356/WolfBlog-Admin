import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from '../redux/hooks';


const AdminRoute = () => {
    const { user } = useSelector((state) => state.account);

    const isAdmin = user?.roles?.includes("Admin");

    useEffect(() => {
        if (!isAdmin) {
            toast.error("Access denied. You do not have permission to view this page.");
        }
    }, [isAdmin]);

    if (isAdmin) {
        return <Outlet />
    } else {
        return <Navigate to='/' />
    }
};

export default AdminRoute;