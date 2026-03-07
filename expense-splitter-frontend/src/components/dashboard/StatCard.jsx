export default function StatCard({
  title,
  value,
  subtitle,
  change,
  positive = true,
}) {
  return (
    <div className="bg-[#15151a] p-6 rounded-2xl border border-gray-800 hover:border-purple-500/40 transition">
      <p className="text-gray-400 text-sm mb-2">{title}</p>

      <h2
        className={`text-2xl font-bold ${
          positive ? "text-green-400" : "text-red-400"
        }`}
      >
        {value}
      </h2>

      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}

      {change && (
        <p
          className={`text-sm mt-2 ${
            positive ? "text-green-400" : "text-red-400"
          }`}
        >
          {change}
        </p>
      )}
    </div>
  );
}
