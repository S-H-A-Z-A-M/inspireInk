import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function Protected({ children, authentication = true }: any) {
  const authStatus = useSelector((state: any) => state.auth.status);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false); // Stop loading once mounted
  }, []);

  useEffect(() => {
    if (!loading) {
      if (authentication && authStatus === false) {
        navigate("/login");
      } else if (!authentication && authStatus === true) {
        if (location.pathname === "/login" || location.pathname === "/signup") {
          navigate("/");
        }
      }
    }
  }, [authStatus, authentication, navigate, location.pathname, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

export default Protected;
