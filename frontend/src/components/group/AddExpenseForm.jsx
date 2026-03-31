export default function AddExpenseForm({
  showForm,
  setShowForm,
  form,
  handleChange,
  handleSubmit,
  expenses,
  group,
  splitType,
  setSplitType,
  customSplits,
  setCustomSplits,
  selectedParticipants,
  setSelectedParticipants,
}) {
  return (
    <>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-5 py-2 text-sm rounded-xl hover:bg-indigo-700 transition"
        >
          {showForm ? "Cancel" : "+ Add Expense"}
        </button>

        <div className="text-sm text-gray-400">
          Total:{" "}
          <span className="text-white font-medium">
            ₹{expenses.reduce((acc, curr) => acc + curr.amount, 0)}
          </span>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#15151a] border border-gray-800 p-5 rounded-xl mb-6 space-y-4"
        >
          {/* Description */}
          <input
            type="text"
            name="description"
            placeholder="Expense description"
            value={form.description}
            onChange={handleChange}
            className="w-full bg-[#0b0b0e] border border-gray-700 px-4 py-2 rounded-lg text-sm"
          />

          {/* Amount */}
          <input
            type="number"
            name="amount"
            placeholder="Amount (₹)"
            value={form.amount}
            onChange={handleChange}
            className="w-full bg-[#0b0b0e] border border-gray-700 px-4 py-2 rounded-lg text-sm"
            required
          />
          {/* Participants Selection */}
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Split between:</p>

            {group.members.map((member) => (
              <label
                key={member._id}
                className="flex items-center gap-2 text-sm text-gray-300"
              >
                <input
                  type="checkbox"
                  checked={selectedParticipants.includes(member._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedParticipants((prev) => [...prev, member._id]);
                    } else {
                      setSelectedParticipants((prev) =>
                        prev.filter((id) => id !== member._id),
                      );
                    }
                  }}
                />
                {member.name}
              </label>
            ))}
          </div>
          {/* Split Type */}
          <div className="flex gap-4 text-sm text-gray-300">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                value="equal"
                checked={splitType === "equal"}
                onChange={(e) => setSplitType(e.target.value)}
              />
              Equal
            </label>

            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                value="custom"
                checked={splitType === "custom"}
                onChange={(e) => setSplitType(e.target.value)}
              />
              Custom
            </label>
          </div>

          {/* Who Paid */}
          {splitType === "custom" && (
            <div className="space-y-2">
              {group.members.map((member) => (
                <div
                  key={member._id}
                  className="flex justify-between items-center bg-[#0b0b0e] border border-gray-800 px-3 py-2 rounded-lg"
                >
                  <span className="text-sm text-gray-300">{member.name}</span>

                  <input
                    type="number"
                    placeholder="₹"
                    className="w-24 px-2 py-1 rounded bg-gray-800 text-sm outline-none"
                    onChange={(e) =>
                      setCustomSplits((prev) => ({
                        ...prev,
                        [member._id]: Number(e.target.value || 0),
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!form.amount}
            className="w-full bg-green-500 text-white py-2 rounded-lg text-sm hover:bg-green-600 transition"
          >
            Add Expense
          </button>
        </form>
      )}
    </>
  );
}
