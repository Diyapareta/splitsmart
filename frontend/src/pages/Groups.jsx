import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Trash2, Users } from "lucide-react";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await api.get("/groups");
        setGroups(res.data);
      } catch (error) {
        console.log(error.response?.data?.message);
      }
    };

    fetchGroups();
  }, []);

  const handleDeleteGroup = async (id) => {
    if (!window.confirm("Delete this group?")) return;

    try {
      await api.delete(`/groups/${id}`);
      setGroups((prev) => prev.filter((g) => g._id !== id));
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      const res = await api.post("/groups", { name: groupName });
      setGroups((prev) => [...prev, res.data]);
      setGroupName("");
      setShowModal(false);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="relative min-h-screen bg-[#0b0b0e] text-white p-10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold">Groups</h1>
            <p className="text-gray-400 mt-2">Manage your expense groups</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 rounded-xl hover:scale-105 transition shadow-lg"
          >
            + Create Group
          </button>
        </div>

        {/* Search */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#15151a] border border-gray-800 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        {/* Groups Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredGroups.map((group) => (
            <div
              key={group._id}
              onClick={() => navigate(`/groups/${group._id}`)}
              className="relative bg-gradient-to-br from-[#15151a] to-[#1c1c24] border border-gray-800 rounded-2xl p-7 transition duration-300 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] cursor-pointer overflow-hidden group"
            >
              {/* Glow Overlay */}
              <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition duration-300"></div>

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteGroup(group._id);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-400 z-20"
              >
                <Trash2 size={18} />
              </button>

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-6">
                <Users size={24} />
              </div>

              {/* Group Name */}
              <h2 className="text-xl font-semibold mb-2">{group.name}</h2>

              {/* Members */}
              <p className="text-gray-400 text-sm mb-6">
                {group.members?.length} members
              </p>

              {/* Footer */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-400">View details →</span>

                <span className="text-green-400 font-medium">Active</span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <div className="text-gray-500 mt-16 text-center">
            No groups found.
          </div>
        )}
      </div>

      {/* CREATE GROUP MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
          <div className="relative w-full max-w-md bg-gradient-to-br from-[#15151a] to-[#1c1c24] border border-gray-800 rounded-2xl p-8 shadow-2xl animate-fadeIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-2">Create New Group</h2>

            <p className="text-gray-400 text-sm mb-6">
              Start tracking shared expenses with your friends.
            </p>

            <form onSubmit={handleCreateGroup} className="space-y-6">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Group Name
                </label>

                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Goa Trip"
                  required
                  className="w-full bg-[#0f0f14] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 transition shadow-lg text-sm"
                >
                  Create Group
                </button>
                <button
                  onClick={() => navigate(`/group/${groupId}/settlements`)}
                >
                  Go to Settlements
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
