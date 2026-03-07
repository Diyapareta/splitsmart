export default function BalanceSection({ balances }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Group Balance</h2>

      <div className="space-y-3">
        {balances.map((user) => (
          <div
            key={user.name}
            className="flex justify-between p-4 bg-gray-50 rounded-xl"
          >
            <span>{user.name}</span>
            <span
              className={`font-bold ${
                user.balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹{user.balance}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
