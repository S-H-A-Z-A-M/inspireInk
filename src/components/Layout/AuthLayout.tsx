import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function Protected({ children, authentication = true }) {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("pathname", location.pathname);
    console.log("authStatus:", authStatus);
    console.log("authentication", authentication);
    if (!authentication) {
      const locate = location.pathname;
      navigate(locate);
    } else {
      if (!authStatus) {
        navigate("/login");
      } else {
        const locate = location.pathname;
        navigate(locate);
      }
    }
    setLoading(false);
  }, [authStatus, authentication, navigate]);
  return loading ? null : <div>{children}</div>;
}

export default Protected;
