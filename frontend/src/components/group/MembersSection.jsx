export default function MembersSection({
  group,
  memberEmail,
  setMemberEmail,
  handleAddMember,
}) {
  return (
    <div className="bg-white/80 p-8 rounded-3xl shadow-xl mb-12">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Members</h2>

        <div className="flex gap-3">
          <input
            type="email"
            placeholder="Enter member email"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            className="border px-4 py-2 rounded-xl"
          />
          <button
            onClick={handleAddMember}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {group.members?.map((member) => (
          <div
            key={member._id}
            className="flex items-center gap-3 px-5 py-2 bg-indigo-100 text-indigo-700 rounded-full"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-indigo-500 text-white rounded-full text-sm font-bold">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <span>{member.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
