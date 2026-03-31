export default function ExpensesSection({ expenses, handleDelete, onSelect }) {
  const latestSettlement = expenses
    .filter((e) => e.description === "Settlement")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  return (
    <div className="bg-[#15151a] border border-gray-800 p-4 rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-white">Expenses</h2>

      {expenses.length === 0 ? (
        <p className="text-gray-400">No expenses yet</p>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => {
            const isSettlement = expense.description === "Settlement";

            const isLocked =
              isSettlement ||
              (latestSettlement &&
                new Date(expense.createdAt) <
                  new Date(latestSettlement.createdAt));

            return (
              <div
                key={expense._id}
                onClick={() => onSelect(expense)}
                className={`rounded-xl p-5 flex justify-between items-center border transition ${
                  isLocked
                    ? "bg-[#0b0b0e] border-gray-800 opacity-70"
                    : "bg-[#0b0b0e] border-gray-800 hover:shadow-lg"
                }`}
              >
                {/* Left */}
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-lg text-white">
                      {expense.description}
                    </p>

                    {isLocked && (
                      <span className="text-xs bg-green-900/30 text-green-400 px-3 py-1 rounded-full font-medium">
                        Settled 🔒
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-400">
                    Paid by {expense.paidBy?.name}
                  </p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-6">
                  <div className="text-xl font-semibold text-indigo-400">
                    ₹{expense.amount}
                  </div>

                  {!isLocked && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Delete this expense?")) {
                          handleDelete(expense._id);
                        }
                      }}
                      className="text-red-400 hover:text-red-500 font-medium transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
