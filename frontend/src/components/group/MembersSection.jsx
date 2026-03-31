export default function MembersSection({
  group,
  memberEmail,
  setMemberEmail,
  handleAddMember,
}) {
  return (
    <div className="bg-[#15151a] border border-gray-800 p-4 rounded-2xl mb-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-semibold text-white">Members</h2>

        <div className="flex gap-3">
          <input
            type="email"
            placeholder="Enter member email"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            className="bg-[#0b0b0e] border border-gray-700 text-white placeholder-gray-500 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleAddMember}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {group.members?.map((member) => (
          <div
            key={member._id}
            className="flex items-center gap-3 px-4 py-2 bg-[#0b0b0e] border border-gray-800 rounded-full hover:shadow-md transition"
          >
            {/* Avatar */}
            <div className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full text-sm font-semibold">
              {member.name.charAt(0).toUpperCase()}
            </div>

            {/* Name */}
            <span className="text-gray-300 text-sm">{member.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
