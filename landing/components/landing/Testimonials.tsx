const testimonials = [
  {
    name: "Mike T.",
    role: "HVAC Owner",
    avatar: "MT",
    quote:
      "I went from 12 reviews to 47 in 6 weeks. My phone doesn't stop ringing.",
    stars: 5,
  },
  {
    name: "Sarah K.",
    role: "Dental Office Manager",
    avatar: "SK",
    quote:
      "So simple. I add a patient, they get a text, we get a review. Done.",
    stars: 5,
  },
  {
    name: "Jake R.",
    role: "Plumber",
    avatar: "JR",
    quote:
      "I was paying $300/month for Birdeye. Same results for $29. No brainer.",
    stars: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4"
          style={{ color: "#f97316" }}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-gray-50 border-y border-gray-100">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#f97316" }}>
            Customer Stories
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance" style={{ color: "#1a3a5c" }}>
            Real businesses, real results
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col gap-5"
            >
              {/* Stars */}
              <StarRating count={t.stars} />

              {/* Quote */}
              <blockquote className="text-gray-700 text-base leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <footer className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: "#1a3a5c" }}
                  aria-hidden="true"
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
