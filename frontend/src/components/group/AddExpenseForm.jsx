export default function AddExpenseForm({
  showForm,
  setShowForm,
  form,
  handleChange,
  handleSubmit,
  expenses,
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 transition"
        >
          {showForm ? "Cancel" : "+ Add Expense"}
        </button>

        <div className="font-medium">
          Total Expenses: ₹
          {expenses.reduce((acc, curr) => acc + curr.amount, 0)}
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-3xl shadow-xl mb-12 space-y-5"
        >
          <input
            type="text"
            name="description"
            placeholder="Expense description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-5 py-3 rounded-xl"
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount (₹)"
            value={form.amount}
            onChange={handleChange}
            className="w-full border px-5 py-3 rounded-xl"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition"
          >
            Add Expense
          </button>
        </form>
      )}
    </>
  );
}
