import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      // 🔥 Optional: show loading
      console.log("Deleting account...");

      const res = await api.delete("/auth/delete-account");

      // 🔥 Success feedback
      alert("Account deleted successfully");

      // 🔥 Clear everything
      localStorage.clear();

      // 🔥 Force redirect immediately
      window.location.replace("/login");
    } catch (err) {
      console.log("DELETE ERROR:", err);

      // 🔥 Handle specific cases
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        window.location.replace("/login");
      } else {
        alert("Failed to delete account. Try again.");
      }
    }
  };
  return (
    <div className="h-full w-64 bg-[#0f0f1a] border-r border-white/10 flex flex-col justify-between px-5 py-6">
      {/* TOP */}
      <div>
        {/* LOGO */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-10">
          SplitSmart
        </h1>

        {/* NAV */}
        <nav className="flex flex-col gap-2">
          <SidebarItem
            label="Dashboard"
            active={location.pathname === "/dashboard"}
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            label="Groups"
            active={location.pathname === "/groups"}
            onClick={() => navigate("/groups")}
          />

          <SidebarItem
            label="Activity"
            active={location.pathname === "/activity"}
            onClick={() => navigate("/activity")}
          />

          <SidebarItem
            label="Settlements"
            active={location.pathname === "/settlements"}
            onClick={() => navigate("/settlements")}
          />
        </nav>
      </div>

      {/* BOTTOM (USER CARD) */}
      {/* BOTTOM */}
      <div className="border-t border-white/10 pt-4 space-y-3">
        {/* USER */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.split(" ")[0][0]}
          </div>

          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* DELETE ACCOUNT */}
        <button
          onClick={handleDeleteAccount}
          className="w-full text-left text-sm text-red-400 hover:text-red-300 transition"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

function SidebarItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
        ${
          active
            ? "bg-purple-600/20 text-purple-300 shadow-md shadow-purple-500/10"
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`}
    >
      {label}
    </button>
  );
}
