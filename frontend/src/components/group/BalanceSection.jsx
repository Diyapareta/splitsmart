export default function BalanceSection({ balances }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 IMPORTANT: use loose comparison (string mismatch fix)

  const myData = balances.find((u) => u.name === user.name);
  const youOwe = myData?.balance < 0 ? Math.abs(myData.balance) : 0;
  const youGet = myData?.balance > 0 ? myData.balance : 0;
  console.log("myData:", myData);
  return (
    <div className="bg-[#15151a] border border-gray-800 p-4 rounded-xl mb-6 min-h-[160px]">
      {/* Title */}
      <h2 className="text-lg font-semibold mb-4 text-white">Group Balance</h2>

      {/* Summary */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 bg-red-900/20 border border-red-800/40 p-3 rounded-lg">
          <p className="text-xs text-red-400">You owe</p>
          <p className="text-lg font-semibold text-red-300">₹{youOwe}</p>
        </div>

        <div className="flex-1 bg-green-900/20 border border-green-800/40 p-3 rounded-lg">
          <p className="text-xs text-green-400">You are owed</p>
          <p className="text-lg font-semibold text-green-300">₹{youGet}</p>
        </div>
      </div>

      {/* Empty State */}
      {balances.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <p className="text-gray-300 text-sm font-medium">No balances yet</p>
          <p className="text-gray-500 text-xs">
            Add expenses to start splitting 💸
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...balances]
            .sort((a, b) => b.balance - a.balance)
            .map((user) => (
              <div
                key={user.name}
                className="flex justify-between items-center p-3 bg-[#0b0b0e] border border-gray-800 rounded-lg hover:bg-[#111114] transition"
              >
                {/* Left */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center bg-indigo-600 rounded-full text-white text-xs font-semibold">
                    {user.name[0].toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm text-gray-300">{user.name}</p>
                    <p className="text-[11px] text-gray-500">
                      {user.balance >= 0 ? "gets back" : "owes"}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <span
                  className={`text-sm font-semibold ${
                    user.balance >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  ₹{user.balance}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
