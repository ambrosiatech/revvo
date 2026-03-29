"use client";

import { useState } from "react";

const WAITLIST_ENDPOINT = "WAITLIST_ENDPOINT";

type Status = "idle" | "loading" | "success" | "error";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <section
      id="waitlist"
      className="py-20 px-4 sm:px-6"
      style={{ backgroundColor: "#1a3a5c" }}
      aria-labelledby="waitlist-heading"
    >
      <div className="max-w-xl mx-auto text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
          style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#f97316" }}
        >
          Early Access
        </div>

        {/* Heading */}
        <h2
          id="waitlist-heading"
          className="text-3xl sm:text-4xl font-bold text-white mb-4 text-balance"
        >
          Get Early Access
        </h2>
        <p className="text-blue-200 text-base leading-relaxed mb-10">
          Be the first to know when Revvo launches.
        </p>

        {/* Success state */}
        {status === "success" ? (
          <div
            className="rounded-xl border border-green-400/30 px-6 py-8 flex flex-col items-center gap-3"
            style={{ backgroundColor: "rgba(74,222,128,0.08)" }}
            role="alert"
          >
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white font-semibold text-lg">{"You're on the list!"}</p>
            <p className="text-blue-200 text-sm">{"We'll be in touch."}</p>
          </div>
        ) : (
          /* Form */
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
            aria-label="Waitlist signup form"
            noValidate
          >
            <label htmlFor="waitlist-email" className="sr-only">
              Email address
            </label>
            <input
              id="waitlist-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="Enter your email address"
              required
              className="flex-1 px-5 py-3.5 rounded-md text-gray-800 text-sm font-medium bg-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-gray-400 transition-all"
              aria-describedby={errorMsg ? "waitlist-error" : undefined}
              aria-invalid={!!errorMsg}
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-7 py-3.5 rounded-md text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap shadow-sm flex items-center justify-center gap-2 min-w-[140px]"
              style={{ backgroundColor: "#f97316" }}
            >
              {status === "loading" ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Joining...
                </>
              ) : (
                "Join Waitlist"
              )}
            </button>
          </form>
        )}

        {/* Error message */}
        {errorMsg && (
          <p id="waitlist-error" className="mt-3 text-red-400 text-sm font-medium" role="alert">
            {errorMsg}
          </p>
        )}
      </div>
    </section>
  );
}
