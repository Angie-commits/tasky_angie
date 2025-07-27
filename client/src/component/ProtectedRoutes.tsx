import useUsers from "../store/userStore";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUsers();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return <>{children}</>;
};

export default ProtectedRoutes;
