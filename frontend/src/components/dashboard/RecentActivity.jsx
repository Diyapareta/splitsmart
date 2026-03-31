import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get("/dashboard/activity");
        setActivities(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchActivity();
  }, []);

  return (
    <div className="bg-[#15151a] rounded-2xl border border-gray-800 p-6">
      <h2 className="text-lg font-semibold mb-6">Recent Activity</h2>

      <div className="space-y-5">
        {activities.map((item) => {
          const title = item.title;

          const subtitle =
            item.type === "settlement" ? "Settlement" : "Expense added";

          const amount = `₹${Number(item.amount).toFixed(2)}`;

          const positive = item.type === "settlement";

          const time = new Date(item.createdAt).toLocaleString();

          return (
            <ActivityItem
              key={item._id}
              title={title}
              subtitle={`${item.group}`}
              amount={amount}
              time={time}
              positive={positive}
            />
          );
        })}
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate("/activity")}
          className="text-purple-400 hover:text-purple-300 text-sm"
        >
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
