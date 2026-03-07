export default function ExpensesSection({ expenses, handleDelete }) {
  const latestSettlement = expenses
    .filter((e) => e.description === "Settlement")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">Expenses</h2>

      {expenses.length === 0 ? (
        <p className="text-gray-500">No expenses yet</p>
      ) : (
        <div className="space-y-6">
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
                className={`rounded-2xl p-6 shadow flex justify-between items-center ${
                  isLocked ? "bg-gray-100 opacity-80" : "bg-gray-50"
                }`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-lg">
                      {expense.description}
                    </p>

                    {isLocked && (
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                        Settled 🔒
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    Paid by {expense.paidBy?.name}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-2xl font-bold text-indigo-600">
                    ₹{expense.amount}
                  </div>

                  {!isLocked && (
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this expense?")) {
                          handleDelete(expense._id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 font-medium transition"
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
