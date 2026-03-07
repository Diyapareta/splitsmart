import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex bg-[#0b0b0e] text-white min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}
