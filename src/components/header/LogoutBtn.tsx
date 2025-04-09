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

  return (
    <p
      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
      onClick={handleLogout}
    >
      Logout
    </p>
  );
}

export default LogoutBtn;
