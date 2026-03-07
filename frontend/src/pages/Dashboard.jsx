import Sidebar from "../components/Layout/Sidebar";
import StatCard from "../components/Dashboard/StatCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import BalanceSummary from "../components/dashboard/BalanceSummary";
import GroupsPreview from "../components/dashboard/GroupsPreview";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#0b0b0e] text-white">
      <Sidebar />

      <div className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, John</h1>
          <p className="text-gray-400">Here’s your financial overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard
            title="Net Balance"
            value="+$126.25"
            subtitle="Across all groups"
            change="↑ 12.5% vs last month"
            positive={true}
          />
          <StatCard
            title="Total Owed to You"
            value="$195.25"
            subtitle="From 3 people"
            positive={true}
          />
          <StatCard
            title="Total You Owe"
            value="$69.00"
            subtitle="To 2 people"
            positive={false}
          />
          <StatCard
            title="This Month's Spending"
            value="$1,248.50"
            subtitle="32 expenses"
            change="↓ 8.2% vs last month"
            positive={false}
          />
        </div>

        {/* Middle */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <RecentActivity />
          </div>

          <BalanceSummary />
        </div>

        {/* Bottom */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <GroupsPreview />
          </div>

          <div className="bg-[#15151a] rounded-2xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <button className="w-full bg-purple-600 hover:bg-purple-700 transition py-2 rounded-lg mb-3">
              Add Expense
            </button>
            <button className="w-full bg-gray-800 hover:bg-gray-700 transition py-2 rounded-lg">
              Settle Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
