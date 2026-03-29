const stats = [
  { value: "2,400+", label: "reviews sent this week" },
  { value: "4.8★", label: "average rating boost" },
  { value: "Under 5 min", label: "setup time" },
];

export default function SocialProofBar() {
  return (
    <section className="bg-gray-50 border-y border-gray-100 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-gray-400 mb-8">
          Trusted by plumbers, HVAC techs, dentists &amp; salons
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 text-center gap-1"
            >
              <span className="text-2xl font-bold" style={{ color: "#1a3a5c" }}>
                {stat.value}
              </span>
              <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
