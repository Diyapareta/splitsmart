export default function BalanceSummary() {
  return (
    <div className="bg-[#15151a] rounded-2xl border border-gray-800 p-6">
      <h2 className="text-lg font-semibold mb-6">Balance Summary</h2>

      <div className="space-y-4">
        <div className="bg-green-600/10 border border-green-600/20 p-4 rounded-xl">
          <p className="text-green-400 text-sm">You are owed</p>
          <p className="text-2xl font-bold text-green-400">$195.25</p>
        </div>

        <div className="bg-red-600/10 border border-red-600/20 p-4 rounded-xl">
          <p className="text-red-400 text-sm">You owe</p>
          <p className="text-2xl font-bold text-red-400">$69.00</p>
        </div>

        <button className="w-full bg-purple-600 hover:bg-purple-700 transition py-2 rounded-lg mt-4">
          Settle Up
        </button>
      </div>
    </div>
  );
}
