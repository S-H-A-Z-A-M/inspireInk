import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { Button } from "../ui/button";
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
        console.log(err);
      });
  };

  return (
    <Button
      onClick={handleLogout}
      className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
    >
      Logout
    </Button>
  );
}

export default LogoutBtn;
