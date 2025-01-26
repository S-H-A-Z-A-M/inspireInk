// import Button from "./Button";
import { app } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

import { userApi } from "@/axios";
import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";


function OAuth() {
  const handleGoogleClick = async ({}) => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    const resultsFromGoogle = await signInWithPopup(auth, provider);
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const data = {
        name: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        photoURL: resultsFromGoogle.user.photoURL,
      };

      await userApi
        .post("/google/auth", data)
        .then((response) => {
          dispatch(login(response.data.data.user));
        })
        .then(() => {
          navigate("/");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <>
    <Button
    onClick={handleGoogleClick}
    className="  w-full 
    p-2 rounded font-bold  text-xl mt-5 mb-3"
    type="button"
>
  {/* <img src="https://img.icons8.com/?size=100&id=17904&format=png&color=000000" alt="Google Icon" class="h-6 w-6 mr-2" /> */}
  <FcGoogle size={30}/>
  Google 
</Button>
  </>
  );
}

export default OAuth;
