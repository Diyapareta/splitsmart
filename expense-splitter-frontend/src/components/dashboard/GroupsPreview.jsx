export default function GroupsPreview() {
  const groups = [
    { name: "Roommates", members: 3, balance: "+$45.00", positive: true },
    { name: "Trip to Paris", members: 5, balance: "-$30.00", positive: false },
  ];

  return (
    <div className="bg-[#15151a] rounded-2xl border border-gray-800 p-6">
      <h2 className="text-lg font-semibold mb-6">Your Groups</h2>

      <div className="space-y-4">
        {groups.map((group, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b border-gray-800 pb-4 last:border-none"
          >
            <div>
              <p className="font-medium">{group.name}</p>
              <p className="text-gray-500 text-sm">{group.members} members</p>
            </div>

            <p
              className={`font-semibold ${
                group.positive ? "text-green-400" : "text-red-400"
              }`}
            >
              {group.balance}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
