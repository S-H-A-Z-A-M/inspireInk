import Button from "./Button";
import { app } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

import { userApi } from "@/axios";
import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";

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
    <Button
      onClick={handleGoogleClick}
      className=" w-full p-2 rounded font-bold text-slate-200 text-2xl mt-10"
      type="button"
    >
      Google
    </Button>
  );
}

export default OAuth;
