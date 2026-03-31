export default function SettlementSection({ settlements, handleSettle }) {
  return (
    <div className="bg-[#15151a] border border-gray-800 p-4 rounded-2xl mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-white">
        Settlement Plan
      </h2>

      {settlements.length === 0 ? (
        <p className="text-green-400 font-medium">All settled 🎉</p>
      ) : (
        <div className="space-y-4">
          {settlements.map((s, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-[#0b0b0e] border border-gray-800 p-5 rounded-xl hover:shadow-lg transition"
            >
              {/* Text */}
              <div className="text-gray-300 font-medium">
                <span className="text-red-400">{s.from}</span>
                {" → "}
                <span className="text-white font-semibold">₹{s.amount}</span>
                {" → "}
                <span className="text-green-400">{s.to}</span>
              </div>

              {/* Button */}
              {s.canSettle && (
                <button
                  onClick={() => handleSettle(s)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Settle
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
