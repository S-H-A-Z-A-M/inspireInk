import { useEffect, useState } from "react";
import Header from "./components/header/Header.tsx";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice.ts";
import { Footer } from "./components/index.ts";
import { Outlet } from "react-router-dom";
import { userApi } from "./axios.ts";
import NavabarSpace from "./components/container/NavabarSpace.tsx";
import { Skeleton } from "./components/ui/skeleton.tsx";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      setIsLoading(false);
      const getCurrentUser = async () => {
        await userApi
          .get("/current-user")
          .then((userData) => {
            if (userData) {
              dispatch(login(userData.data.data));
            } else {
              dispatch(logout());
            }
          })
          .catch((err) => {
            console.log("app page error", err);
          })
          .finally(() => {
            setIsLoading(true);
          });
      };
      getCurrentUser();
    } catch (error) {
      console.log("app page error", error);
    }
  }, []);
  return isLoading ? (
    // <div className=">
    <div className="w-full flex flex-col justify-between min-h-screen">
      <Header />
      <main>
        <NavabarSpace>
          <Outlet />
        </NavabarSpace>
      </main>
      <Footer />
    </div>
  ) : (
    // </div>
    <div className="relative">
      <Skeleton className="w-auto h-[60px] rounded-full mx-6 mt-6 mb-6" />
      <Skeleton className="w-4/6 mx-auto h-[180px] rounded-lg  mt-1 mb-4" />
      <Skeleton className="w-4/6 mx-auto h-[180px] rounded-lg  mt-1 mb-4" />
      <Skeleton className="w-4/6 mx-auto h-[180px] rounded-lg  mt-1 mb-4" />
    </div>
  );
}

export default App;
