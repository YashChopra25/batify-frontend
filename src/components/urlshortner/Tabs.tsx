import React from "react";
import LinkGenerator from "./LinkGenerator";
import QRcodeGenerator from "./QRcodeGenerator";
import { FaLink } from "react-icons/fa6";
import { BsQrCodeScan } from "react-icons/bs";
const Tabs = () => {
  const [activeTab, setActiveTab] = React.useState("link");

  return (
    <div className="flex justify-center items-center flex-col p-4 shadow-md rounded-lg h-auto dark:bg-gray-700 relative max-md:p-1">
      {/* Tab Buttons */}
      <div className="mx-auto grid grid-cols-2 gap-7">
        {[
          {
            name: "Short link",
            value: "link",
            icon: (color = "") => <FaLink size={22} fill={color} />,
          },
          {
            name: "QR Code",
            value: "qr_code",
            icon: (color = "") => <BsQrCodeScan size={22} fill={color} />,
          },
        ].map((tab) => (
          <div
            key={tab.value}
            className={`px-4 py-3 rounded-xl text-[#cfcde4] cursor-pointer font-bold text-base text-center transition-all duration-300 flex gap-3 items-center justify-center ${
              activeTab === tab.value ? "bg-white" : "bg-gray-600"
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.icon(tab.value === activeTab ? "black" : "white")}
            <span className={activeTab === tab.value ? " text-black" : ""}>
              {tab.name}
            </span>
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="w-4/5 mt-4 h-full mx-auto bg-white px-10 py-16 rounded-[2.4rem] max-md:w-full max-md:px-5 max-md:py-8">
        {activeTab === "link" ? <LinkGenerator /> : <QRcodeGenerator />}
      </div>
    </div>
  );
};

export default Tabs;
