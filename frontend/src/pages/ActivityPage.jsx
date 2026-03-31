import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get("/dashboard/activity");
        setActivities(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  // 🔥 FILTER LOGIC
  const filteredActivities =
    filter === "all" ? activities : activities.filter((a) => a.type === filter);

  return (
    <div className="min-h-screen text-white p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Activity
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Track all expenses and settlements
        </p>
      </div>

      {/* FILTER */}
      <div className="flex gap-3 mb-6">
        {["all", "expense", "settlement"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition ${
              filter === type
                ? "bg-purple-600/30 text-purple-300 border-purple-400"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : filteredActivities.length === 0 ? (
        <p className="text-gray-400">No activity found</p>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((item) => (
            <div
              key={item._id}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-xl flex justify-between items-center hover:scale-[1.01] transition"
            >
              {/* LEFT */}
              <div>
                <p className="text-sm font-medium">{item.title}</p>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>

                  <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded">
                    {item.group}
                  </span>

                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      item.type === "expense"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-green-500/10 text-green-400"
                    }`}
                  >
                    {item.type}
                  </span>
                </div>
              </div>

              {/* RIGHT */}
              <p
                className={`text-sm font-semibold ${
                  item.type === "expense" ? "text-red-400" : "text-green-400"
                }`}
              >
                ₹{item.amount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
