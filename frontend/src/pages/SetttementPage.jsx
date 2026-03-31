import { useEffect, useState } from "react";
import api from "../api/axios";

export default function SettlementsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settlingId, setSettlingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const currentUserId = user?._id;
  const handleSettle = async (toUserId, amount) => {
    try {
      setSettlingId(toUserId);

      await api.post("/expenses/settle", {
        fromUserId: currentUserId,
        toUserId,
        amount,
      });

      await fetchData();
    } catch (err) {
      console.log("SETTLE ERROR:", err);
    } finally {
      setSettlingId(null);
    }
  };

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      const res = await api.get("/expenses/grouped-balances");
      setGroups(res.data);
    } catch (err) {
      console.log("ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 PERSON MAP (AGGREGATE)
  const personMap = {};

  groups.forEach((group) => {
    group.members.forEach((member) => {
      if (member._id === currentUserId) return;

      if (!personMap[member._id]) {
        personMap[member._id] = {
          name: member.name,
          balance: 0,
        };
      }

      personMap[member._id].balance += member.balance;
    });
  });

  // 🔥 TOTALS
  let totalOwe = 0;
  let totalGet = 0;

  Object.values(personMap).forEach((person) => {
    if (person.balance < 0) totalOwe += Math.abs(person.balance);
    if (person.balance > 0) totalGet += person.balance;
  });

  // 🔥 OPTIONAL: Hide settled users
  const persons = Object.entries(personMap).filter(
    ([_, person]) => person.balance !== 0,
  );

  // 🔥 LOADING
  if (loading) {
    return <div className="text-white p-6">Loading settlements...</div>;
  }

  return (
    <div className="p-6 text-white">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2">Settlements</h1>
      <p className="text-gray-400 mb-6">Track who owes you and whom you owe</p>

      {/* 🔥 TOTAL CARDS */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-xl">
          <p className="text-sm text-gray-400">You need to pay</p>
          <p className="text-2xl font-bold text-red-400">
            ₹{totalOwe.toFixed(2)}
          </p>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 p-5 rounded-xl">
          <p className="text-sm text-gray-400">You will receive</p>
          <p className="text-2xl font-bold text-green-400">
            ₹{totalGet.toFixed(2)}
          </p>
        </div>
      </div>

      {/* 🔥 OVERALL BY PERSON */}
      <h2 className="text-xl font-semibold mb-4 text-purple-400">
        Overall by Person
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {persons.map(([id, person]) => (
          <div
            key={id}
            className="bg-[#15151a] border border-gray-800 p-4 rounded-xl flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                {person.name?.charAt(0) || "?"}
              </div>
              <span className="font-medium">{person.name}</span>
            </div>

            {person.balance < 0 ? (
              <>
                <p className="text-red-400">
                  You pay {person.name} ₹{Math.abs(person.balance)}
                </p>

                <button
                  onClick={() => handleSettle(id, Math.abs(person.balance))}
                  disabled={settlingId === id}
                  className="bg-green-600 py-1 rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-50"
                >
                  {settlingId === id ? "Settling..." : "Pay"}
                </button>
              </>
            ) : (
              <p className="text-green-400">
                {person.name} owes you ₹{person.balance}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* 🔥 GROUPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div
            key={group._id}
            className="bg-[#15151a] border border-gray-800 rounded-2xl p-5"
          >
            <h2 className="text-lg font-semibold text-purple-400 mb-4">
              {group.name}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {group.members
                .filter((u) => u._id !== currentUserId)
                .map((member) => (
                  <div
                    key={member._id}
                    className="bg-[#0f0f13] p-3 rounded-lg flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {member.name?.charAt(0) || "?"}
                      </div>

                      <span className="text-sm">{member.name}</span>
                    </div>

                    {member.balance < 0 ? (
                      <p className="text-red-400 text-xs">
                        You need to pay ₹{Math.abs(member.balance)}
                      </p>
                    ) : member.balance > 0 ? (
                      <p className="text-green-400 text-xs">
                        They owe you ₹{member.balance}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-xs">Settled</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
