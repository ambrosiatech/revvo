const rows = [
  {
    feature: "Monthly Price",
    reviewpilot: "$29",
    birdeye: "$299",
    podium: "$399",
  },
  {
    feature: "Review Requests",
    reviewpilot: "✓",
    birdeye: "✓",
    podium: "✓",
  },
  {
    feature: "SMS + Email",
    reviewpilot: "✓",
    birdeye: "✓",
    podium: "✓",
  },
  {
    feature: "Simple Setup",
    reviewpilot: "✓",
    birdeye: "✗",
    podium: "✗",
  },
  {
    feature: "No Contract",
    reviewpilot: "✓",
    birdeye: "✗",
    podium: "✗",
  },
];

function Check({ value }: { value: string }) {
  if (value === "✓") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-50">
        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (value === "✗") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50">
        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    );
  }
  return <span className="font-semibold text-gray-800">{value}</span>;
}

export default function ComparisonTable() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#f97316" }}>
            Comparison
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance" style={{ color: "#1a3a5c" }}>
            Birdeye results. 10x cheaper.
          </h2>
          <p className="mt-3 text-gray-500 text-base">Why pay hundreds more for the same outcome?</p>
        </div>

        {/* Table wrapper */}
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-6 font-semibold text-gray-500 bg-gray-50 w-2/5">
                  Feature
                </th>
                {/* ReviewPilot — highlighted */}
                <th
                  className="py-4 px-4 text-center font-bold text-white text-base w-1/5 relative"
                  style={{ backgroundColor: "#1a3a5c" }}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span>ReviewPilot</span>
                    <span className="text-xs font-normal opacity-75 uppercase tracking-wider">⭐ Our pick</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-center font-semibold text-gray-500 bg-gray-50 w-1/5">
                  Birdeye
                </th>
                <th className="py-4 px-4 text-center font-semibold text-gray-500 bg-gray-50 w-1/5">
                  Podium
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-gray-50 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                >
                  <td className="py-4 px-6 font-medium text-gray-700">{row.feature}</td>
                  {/* ReviewPilot column — blue tint */}
                  <td
                    className="py-4 px-4 text-center font-bold"
                    style={{ backgroundColor: "rgba(26,58,92,0.06)" }}
                  >
                    {row.feature === "Monthly Price" ? (
                      <span className="text-base font-extrabold" style={{ color: "#1a3a5c" }}>
                        {row.reviewpilot}
                      </span>
                    ) : (
                      <div className="flex justify-center">
                        <Check value={row.reviewpilot} />
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-600">
                    {row.feature === "Monthly Price" ? (
                      <span className="font-semibold text-gray-500">{row.birdeye}</span>
                    ) : (
                      <div className="flex justify-center">
                        <Check value={row.birdeye} />
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-600">
                    {row.feature === "Monthly Price" ? (
                      <span className="font-semibold text-gray-500">{row.podium}</span>
                    ) : (
                      <div className="flex justify-center">
                        <Check value={row.podium} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
