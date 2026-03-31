import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="bg-[#0b0b0e] text-white">
      {/* SIDEBAR (FIXED) */}
      <div className="fixed top-0 left-0 h-screen w-64 z-50 bg-[#0b0b0e] border-r border-white/10">
        <Sidebar />
      </div>

      {/* MAIN CONTENT (SCROLLABLE) */}
      <div className="ml-64 h-screen overflow-y-auto p-8">
        <Outlet />
      </div>
    </div>
  );
}
