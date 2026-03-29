const steps = [
  {
    number: "01",
    title: "Connect your Google Business Profile",
    description:
      "Link your Google Business account in seconds. No technical skills needed — just a few clicks.",
    icon: "🔗",
  },
  {
    number: "02",
    title: "Add a customer after each job",
    description:
      "Enter their name and phone number or email. Takes under 10 seconds from any device.",
    icon: "👤",
  },
  {
    number: "03",
    title: "They get a text → leave a review in one tap",
    description:
      "Your customer receives a friendly, personalized message with a direct link to leave a Google review.",
    icon: "⭐",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#f97316" }}>
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance" style={{ color: "#1a3a5c" }}>
            Get more reviews in 3 simple steps
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div
            className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px"
            style={{ backgroundColor: "#e5e7eb" }}
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative">
              {/* Icon circle */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-5 border-4 border-white shadow-md relative z-10"
                style={{ backgroundColor: "#f0f5ff" }}
              >
                {step.icon}
              </div>
              {/* Step number */}
              <span
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "#f97316" }}
              >
                Step {step.number}
              </span>
              <h3 className="text-lg font-bold mb-3 text-balance" style={{ color: "#1a3a5c" }}>
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
