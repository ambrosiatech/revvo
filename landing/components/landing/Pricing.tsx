const included = [
  "Unlimited review requests",
  "SMS + email delivery",
  "Auto follow-up reminders",
  "Real-time review alerts",
  "Google Business integration",
  "Cancel anytime — no contracts",
];

export default function Pricing() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-lg mx-auto text-center">
        {/* Section header */}
        <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#f97316" }}>
          Simple Pricing
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-10 text-balance" style={{ color: "#1a3a5c" }}>
          One plan. Everything included.
        </h2>

        {/* Pricing card */}
        <div
          className="rounded-2xl border-2 shadow-lg p-8 sm:p-10 text-left"
          style={{ borderColor: "#1a3a5c" }}
        >
          {/* Price */}
          <div className="flex items-end gap-2 mb-1">
            <span className="text-5xl font-extrabold" style={{ color: "#1a3a5c" }}>
              $29
            </span>
            <span className="text-gray-400 text-lg pb-1.5 font-medium">/month</span>
          </div>
          <p className="text-gray-500 text-sm mb-7 font-medium">Everything you need to grow your Google reviews</p>

          {/* Checklist */}
          <ul className="space-y-3 mb-8" role="list">
            {included.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#1a3a5c" }}
                  aria-hidden="true"
                >
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href="#waitlist"
            className="block w-full text-center py-4 rounded-md text-base font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 shadow-sm"
            style={{ backgroundColor: "#f97316" }}
          >
            Start 14-Day Free Trial
          </a>
          <p className="text-center text-xs text-gray-400 mt-3 font-medium">
            No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}
