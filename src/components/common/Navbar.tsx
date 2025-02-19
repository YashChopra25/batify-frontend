import { useAppSelector } from "@/store/auth.store";
import { GetToken } from "@/utils/GetToken";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <div className="px-6 py-2  text-[#cfcde4] font-bold flex justify-between items-center">
      <span className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl">
        Yatirly
      </span>
      {user && user.name ? (
        <Link to="/dashboard">Dashboard</Link>
      ) : (
        <Link to="/auth/login">Login</Link>
      )}
    </div>
  );
};

export default Navbar;
