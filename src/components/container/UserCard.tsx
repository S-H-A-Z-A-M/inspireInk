import { Button } from "../ui/button";
import { useSelector, UseSelector } from "react-redux";
import { Link } from "react-router-dom";

function UserCard({ user }) {
  const userData = useSelector((state) => state.auth.userData);
  return (
    <div className="flex flex-col justify-center items-center mt-10 shadow-md max-w-[60rem] mx-auto  p-4 bg-slate-500 mb-4 rounded-3xl">
      <div className="mb-4">
        <img className="h-56 rounded-full" src={user.profilePicURL} alt="" />
      </div>
      <div className="flex flex-col justify-center items-center">
        <p className="text-3xl font-bold">{user.name}</p>
        <p className="text-xl text-slate-400 italic">
          {user.about || "There is nothing written here"}
        </p>
        <p>{user.createdAt}</p>
      </div>
      <div>
        <Link to={`/edit-profile`}>
          <Button className="px-6 py-5 mt-4 ">Edit Profile</Button>
        </Link>
      </div>
    </div>
  );
}

export default UserCard;
