import StatCard from "../components/dashboard/StatCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import BalanceSummary from "../components/dashboard/BalanceSummary";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
export default function Dashboard() {
  // const handleSettleAll = async () => {
  //   console.log("SETTLE CLICKED"); // 👈 ADD THIS
  //   try {
  //     await api.post("/dashboard/settle-all");
  //     window.location.reload(); // quick refresh
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const { logout } = useContext(AuthContext);
  const [monthlyData, setMonthlyData] = useState({});
  const [stats, setStats] = useState({
    youOwe: 0,
    youGet: 0,
    net: 0,
  });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  useEffect(() => {
    const fetchMonthly = async () => {
      try {
        const res = await api.get("/dashboard/monthly-net");
        setMonthlyData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMonthly();
  }, []);
  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get("/dashboard/stats"); // create this API
      setStats(res.data);
    };

    fetchStats();
  }, []);
  return (
    <div className="flex min-h-screen bg-[#0b0b0e] text-white">
      <div className="flex-1 p-8 space-y-8">
        {/* Header */}
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-gray-400">Here’s your financial overview</p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg text-white font-medium"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard
            title="Net Balance"
            value={
              stats.net < 0
                ? `You owe ₹${Math.abs(stats.net)}`
                : stats.net > 0
                  ? `You are owed ₹${stats.net}`
                  : "All settled 🎉"
            }
            subtitle="Across all groups"
            positive={stats.net > 0}
          />
          <StatCard
            title="Total Owed to You"
            value={`₹${stats.youGet}`}
            positive={true}
          />

          <StatCard
            title="Total You Owe"
            value={`₹${stats.youOwe}`}
            positive={false}
          />
          <StatCard
            title="This Month's Spending"
            value={`₹${stats.monthlySpending}`}
            subtitle="Your expenses this month"
            positive={false}
          />
        </div>

        {/* Middle */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <RecentActivity />
          </div>

          <BalanceSummary stats={stats} />
        </div>
      </div>
    </div>
  );
}
