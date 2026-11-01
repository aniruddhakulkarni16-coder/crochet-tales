import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAdmin } from "./AdminContext";
import YarnLoader from "../components/YarnLoader";
import "./admin.css";

function RequireAdmin() {
  const { isAdmin, ready, openLogin } = useAdmin();

  useEffect(() => {
    if (ready && !isAdmin) openLogin();
  }, [ready, isAdmin, openLogin]);

  if (!ready) return <YarnLoader text="Checking login..." />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="admin-page">
      <Outlet />
    </div>
  );
}

export default RequireAdmin;