import { useEffect, useState } from "react";
import Header from "./components/header/Header.tsx";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login, logout } from "./store/authSlice.ts";
import { Footer } from "./components/index.ts";
import { Outlet } from "react-router-dom";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // get Current user
    // axios
    //   .get("/")
    //   .then((userData) => {
    //     if (userData) {
    //       dispatch(login({ userData }));
    //     } else {
    //       dispatch(logout());
    //     }
    //   })
    //   .finally(() => setIsLoading(false));
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
