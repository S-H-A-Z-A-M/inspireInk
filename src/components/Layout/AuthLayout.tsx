// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";

// function Protected({ children, authentication = true }: any) {
//   const authStatus = useSelector((state: any) => state.auth.status);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!authentication && !authentication === authStatus) {
//       const locate = location.pathname;
//       if (locate == "/login" || locate == "/signup") {
//         navigate("/");
//       }
//     } else if (authentication && !authentication === authStatus) {
//       navigate("/login");
//     }
//     setLoading(false);
//   }, [authStatus, authentication, navigate]);
//   return loading ? <div>Redirecting...</div> : <div>{children}</div>;
// }

// export default Protected;

import React, { useEffect, useState } from "react";
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
