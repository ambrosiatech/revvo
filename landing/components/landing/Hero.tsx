export default function Hero() {
  return (
    <section className="pt-28 pb-20 px-4 sm:px-6 bg-white text-center">
      <div className="max-w-3xl mx-auto">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-sm font-medium mb-6" style={{ color: "#1a3a5c" }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
          Now in early access
        </div>

        {/* H1 */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-balance mb-6" style={{ color: "#1a3a5c" }}>
          More 5-Star Reviews.{" "}
          <span style={{ color: "#f97316" }}>On Autopilot.</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8 text-pretty">
          Revvo automatically texts and emails your customers after every job — so you get the reviews without the awkward ask.
        </p>

        {/* CTA group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
          <a
            href="#waitlist"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md text-base font-bold text-white shadow-md transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#f97316" }}
          >
            Start Free Trial →
          </a>
        </div>

        {/* Trust micro-copy */}
        <p className="text-sm text-gray-400 font-medium">
          No credit card required · Setup in 5 minutes
        </p>

        {/* Hero visual mockup */}
        <div className="mt-14 relative mx-auto max-w-sm sm:max-w-md">
          <div className="rounded-2xl shadow-2xl border border-gray-100 overflow-hidden bg-white">
            {/* Phone screen mockup header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#1a3a5c" }}>
                RP
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">Revvo</p>
                <p className="text-xs text-gray-400">Text Message · Just now</p>
              </div>
            </div>
            {/* SMS bubble */}
            <div className="px-5 py-5 bg-gray-50">
              <div className="bg-white rounded-xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 text-left text-sm text-gray-700 leading-relaxed max-w-xs">
                Hi Mike! Thanks for choosing ABC Plumbing. We&apos;d love your feedback — it only takes 30 seconds. 🌟
                <br /><br />
                <a className="font-semibold underline" style={{ color: "#1a3a5c" }} href="#">Leave us a Google review →</a>
              </div>
            </div>
            {/* Stats row */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
              {[
                { value: "47", label: "Reviews" },
                { value: "4.9★", label: "Avg Rating" },
                { value: "92%", label: "Open Rate" },
              ].map((stat) => (
                <div key={stat.label} className="py-4 px-2 text-center">
                  <p className="text-lg font-bold" style={{ color: "#1a3a5c" }}>{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Decorative glow */}
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full blur-2xl opacity-20"
            style={{ backgroundColor: "#1a3a5c" }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
