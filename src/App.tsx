import { useEffect, useState } from "react";
import Header from "./components/header/Header.tsx";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login, logout } from "./store/authSlice.ts";
import { Footer } from "./components/index.ts";
import { Outlet } from "react-router-dom";
import { userApi } from "./axios.ts";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentUser = userApi.get("/current-user").then((userData) => {
      if (userData) {
        dispatch(login(userData.data.data));
      } else {
        dispatch(logout());
      }
    });
  }, []);
  // console.log(import.meta.env.VITE_APP_NAME);
  return !isLoading ? (
    <div className="min-h-screen flex flex-wrap content-between bg-slate-700">
      <div className="w-full block">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : (
    <div>The content is still loading</div>
  );
}

export default App;