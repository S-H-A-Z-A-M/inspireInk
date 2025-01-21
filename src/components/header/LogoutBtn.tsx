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
    <Button
      onClick={handleLogout}
      className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
    >
      Logout
    </Button>
  );
}

export default LogoutBtn;
