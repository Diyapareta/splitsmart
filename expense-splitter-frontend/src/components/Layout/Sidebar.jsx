import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-[#111114] border-r border-gray-800 p-6 flex flex-col justify-between">
      {/* Logo */}
      <div>
        <h1 className="text-2xl font-bold text-purple-500 mb-10">SplitSmart</h1>

        <nav className="space-y-3">
          <SidebarItem label="Dashboard" active />
          <SidebarItem label="Groups" onClick={() => navigate("/groups")} />
          <SidebarItem label="Expenses" />
          <SidebarItem label="Settlements" />
          <SidebarItem label="Analytics" />
        </nav>
      </div>

      {/* Bottom */}
      <div className="text-sm text-gray-400">
        <p>John Doe</p>
        <p className="text-gray-600">john@example.com</p>
      </div>
    </div>
  );
}

function SidebarItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 rounded-lg transition ${
        active
          ? "bg-purple-600/20 text-purple-400"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
