import Home from "@/components/dashboard/Home";
import Profile from "@/components/dashboard/Profile";
import Setting from "@/components/dashboard/Setting";
import TableComponent from "@/components/dashboard/TableComponent";
import { Calendar, HomeIcon, User, Settings, Link2 } from "lucide-react";
import { Link } from "react-router-dom";

export const items = [
  {
    url: "/home",
    query: "home",
    icon: HomeIcon,
    component: <Home />,
  },
  {
    url: "/history",
    query: "history",
    icon: Calendar,
    component: (
      <div className="mt-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl my-3 max-md:text-base">
            Your previous urls and Qr Codes
          </h1>
          <Link to={"/"} className="underline">
            Generate New
          </Link>
        </div>
        <TableComponent />
      </div>
    ),
  },
  {
    url: "/profile",
    query: "profile",
    icon: User,
    component: <Profile />,
  },
  {
    url: "/setting",
    query: "settings",
    icon: Settings,
    component: <Setting />,
  },
];
