const features = [
  {
    icon: "💬",
    title: "SMS + Email Requests",
    description:
      "Send review requests via text message and email so you reach customers however they prefer.",
  },
  {
    icon: "🔄",
    title: "Auto Follow-Up",
    description:
      "Automatically send a polite reminder to customers who didn't open your first message.",
  },
  {
    icon: "🔔",
    title: "Real-Time Alerts",
    description:
      "Get notified instantly when a new review is posted so you can respond fast.",
  },
  {
    icon: "📊",
    title: "Simple Dashboard",
    description:
      "See all your review requests, open rates, and review counts in one clean view.",
  },
  {
    icon: "🏢",
    title: "Works for Any Business",
    description:
      "Built for plumbers, HVAC, dentists, salons, and any other local service business.",
  },
  {
    icon: "🚫",
    title: "Cancel Anytime",
    description:
      "No long-term contracts. No setup fees. Cancel whenever you want, no questions asked.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-gray-50 border-y border-gray-100">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#f97316" }}>
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance" style={{ color: "#1a3a5c" }}>
            Everything you need to grow your reviews
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-3xl" aria-hidden="true">{feature.icon}</div>
              <h3 className="text-base font-bold" style={{ color: "#1a3a5c" }}>
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
