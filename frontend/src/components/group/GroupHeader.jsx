export default function GroupHeader({ group }) {
  return (
    <div className="mb-10">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
        {group.name}
      </h1>

      <p className="text-gray-400 mt-2 text-sm md:text-base">
        Manage your shared expenses effortlessly
      </p>
    </div>
  );
}
