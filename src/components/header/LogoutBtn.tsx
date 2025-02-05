import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { userApi } from "@/axios";
import { useNavigate } from "react-router-dom";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log(document.cookie);
    userApi
      .post("/logout")
      .then(() => {
        dispatch(logout());
        navigate("/");
      })
      .catch((err) => {
        console.log("the logout error", err);
      });
  };

  return <li onClick={handleLogout}>Logout</li>;
}

export default LogoutBtn;
