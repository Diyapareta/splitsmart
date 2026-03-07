export default function SettlementSection({ settlements, handleSettle }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Settlement Plan</h2>

      {settlements.length === 0 ? (
        <p className="text-green-600 font-medium">All settled 🎉</p>
      ) : (
        <div className="space-y-4">
          {settlements.map((s, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gradient-to-r from-red-50 to-green-50 p-5 rounded-2xl shadow"
            >
              <div className="font-medium">
                {s.from} ➜ ₹{s.amount} ➜ {s.to}
              </div>

              <button
                onClick={() => handleSettle(s)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Mark as Settled
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
