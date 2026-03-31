import { useNavigate } from "react-router-dom";
export default function BalanceSummary({ stats }) {
  const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;
  const navigate = useNavigate();

  return (
    <div className="bg-[#15151a] border border-gray-800 p-5 rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Balance Summary</h2>

      {/* You Get */}
      <div className="bg-green-900/20 border border-green-800 p-4 rounded-xl mb-3">
        <p className="text-sm text-green-400">You are owed</p>
        <p className="text-xl font-semibold text-green-300">
          {formatCurrency(stats.youGet)}
        </p>
      </div>

      {/* You Owe */}
      <div className="bg-red-900/20 border border-red-800 p-4 rounded-xl">
        <p className="text-sm text-red-400">You owe</p>
        <p className="text-xl font-semibold text-red-300">
          {formatCurrency(stats.youOwe)}
        </p>
      </div>

      {/* Button */}
      <button
        onClick={() => navigate("/settlements")}
        className="mt-4 w-full bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all py-2 rounded-lg font-medium"
      >
        Settle Up
      </button>
    </div>
  );
}
