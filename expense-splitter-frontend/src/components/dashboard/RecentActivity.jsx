export default function RecentActivity() {
  const activities = [
    {
      title: "Dinner at Italian Place",
      subtitle: "Added by Sarah • Roommates",
      amount: "$86.50",
      time: "2 hours ago",
      positive: false,
    },
    {
      title: "Settlement completed",
      subtitle: "Mike paid you • Trip to Paris",
      amount: "+$45.00",
      time: "5 hours ago",
      positive: true,
    },
    {
      title: "New member joined",
      subtitle: "Alex joined • Office Lunch",
      time: "Yesterday",
    },
    {
      title: "Groceries",
      subtitle: "Added by you • Roommates",
      amount: "$124.30",
      time: "Yesterday",
      positive: false,
    },
  ];

  return (
    <div className="bg-[#15151a] rounded-2xl border border-gray-800 p-6">
      <h2 className="text-lg font-semibold mb-6">Recent Activity</h2>

      <div className="space-y-5">
        {activities.map((item, index) => (
          <ActivityItem key={index} {...item} />
        ))}
      </div>

      <div className="mt-6">
        <button className="text-purple-400 hover:text-purple-300 text-sm">
          View all activity →
        </button>
      </div>
    </div>
  );
}

function ActivityItem({ title, subtitle, amount, time, positive }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-800 pb-4 last:border-none">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>

      <div className="text-right">
        {amount && (
          <p
            className={`font-semibold ${
              positive ? "text-green-400" : "text-red-400"
            }`}
          >
            {amount}
          </p>
        )}
        <p className="text-gray-500 text-xs">{time}</p>
      </div>
    </div>
  );
}
