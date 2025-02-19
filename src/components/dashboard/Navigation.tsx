import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavigationTypes } from "@/Types";
import { items } from "@/utils/NavbarOptions";
import { Link2, LogOut } from "lucide-react";

import { Link } from "react-router-dom";
// Menu items.

const Navigation = ({ handlerClick, activeTab }: NavigationTypes) => {
  return (
    <SidebarMenu className="bg-[#25293c] text-[#cfcde4] mt-3">
      {items.map((item) => (
        <SidebarMenuItem
          key={item.query}
          // Set active class based on state
          className={activeTab === item.query ? "active" : ""}
        >
          <SidebarMenuButton
            asChild
            className={`${
              activeTab === item.query
                ? "bg-[#635bc9] text-[#e7e6f4] hover:bg-[#7c73f7] hover:text-[#e7e6f4]"
                : "hover:bg-[#393d53] hover:text-[#e7e6f4]"
            }  `}
          >
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default link behavior
                handlerClick(item.query); // Set the active tab in state
              }}
              className="py-5"
            >
              <item.icon className="!w-6 !h-6 " />
              <span className="text-base font-medium capitalize">
                {item.query}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link
            to="/"
            className="py-5 hover:!bg-[#393d53] hover:!text-[#e7e6f4]"
          >
            <Link2 className="!w-6 !h-6 " />
            <span className="text-base font-medium capitalize">
              Generate New
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <button
            onClick={(e) => {
              e.preventDefault(); // Prevent the default link behavior
              handlerClick("logout");
            }}
            className="py-5 hover:!bg-[#393d53] hover:!text-[#e7e6f4]"
          >
            <LogOut className="!w-6 !h-6 " />
            <span className="text-base font-medium capitalize">Logout</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default Navigation;
