import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";

import React from "react";
import axios from "axios";

function LogoutBtn() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    axios.get("").then(() => {
      dispatch(logout());
    });
  };

  return (
    <button className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full">
      Logout
    </button>
  );
}

export default LogoutBtn;
