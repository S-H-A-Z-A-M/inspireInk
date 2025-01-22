import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { Button } from "../ui/button";
import { userApi } from "@/axios";

function LogoutBtn() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    console.log(document.cookie);
    userApi
      .post("/logout")
      .then(() => {
        dispatch(logout());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <button
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
