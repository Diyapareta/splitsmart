export default function GroupHeader({ group }) {
  return (
    <div className="mb-12">
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {group.name}
      </h1>
      <p className="text-gray-600 mt-2">
        Manage your shared expenses effortlessly
      </p>
    </div>
  );
}
