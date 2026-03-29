"use client";

export default function Waitlist() {
  return (
    <section
      id="waitlist"
      className="py-20 px-4 sm:px-6"
      style={{ backgroundColor: "#1a3a5c" }}
    >
      <div className="max-w-xl mx-auto text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
          style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#f97316" }}
        >
          Now Live
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Start Getting More Reviews Today
        </h2>
        <p className="text-blue-200 text-base leading-relaxed mb-10">
          14-day free trial. No credit card required. Setup in 5 minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://review-pilot-app.vercel.app/signup"
            className="px-8 py-4 rounded-md text-base font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 shadow-sm"
            style={{ backgroundColor: "#f97316" }}
          >
            Start Free Trial →
          </a>
          <a
            href="https://review-pilot-app.vercel.app/login"
            className="px-8 py-4 rounded-md text-base font-semibold transition-all duration-200 hover:bg-white/10"
            style={{ color: "#ffffff", border: "1px solid rgba(255,255,255,0.3)" }}
          >
            Sign In
          </a>
        </div>

        <p className="mt-6 text-blue-300 text-sm">
          Already getting results for plumbers, HVAC techs, dentists & salons.
        </p>
      </div>
    </section>
  );
}
