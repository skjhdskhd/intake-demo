import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: "#1e3a5f" }}
            >
              PP
            </div>
            <span className="font-bold text-lg" style={{ color: "#1e3a5f" }}>
              Prestige Properties
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-[#1e3a5f] transition">Buy</a>
            <a href="#" className="hover:text-[#1e3a5f] transition">Sell</a>
            <a href="#" className="hover:text-[#1e3a5f] transition">About</a>
            <a href="#chat" className="hover:text-[#1e3a5f] transition">Contact</a>
          </div>
          <a
            href="#chat"
            className="hidden md:inline-block px-4 py-2 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: "#c9a84c" }}
          >
            Get Started
          </a>
          {/* Mobile menu icon */}
          <button className="md:hidden p-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative min-h-[580px] flex items-center justify-center text-center px-6"
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2d5282 50%, #1a3050 100%)",
        }}
      >
        {/* Subtle overlay pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #c9a84c 0%, transparent 50%), radial-gradient(circle at 75% 75%, #c9a84c 0%, transparent 50%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#c9a84c" }}
          >
            Trusted Since 2012
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Your Dream Home{" "}
            <span style={{ color: "#c9a84c" }}>Awaits</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Expert guidance from search to close. Tell us what you&apos;re looking for — we&apos;ll handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#chat"
              className="inline-block px-8 py-4 rounded-xl font-semibold text-white text-base transition hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
              style={{ backgroundColor: "#c9a84c" }}
            >
              Get Started — It&apos;s Free
            </a>
            <a
              href="#features"
              className="inline-block px-8 py-4 rounded-xl font-semibold text-blue-100 text-base border border-blue-300/40 hover:bg-white/10 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-8 border-b border-gray-100" style={{ backgroundColor: "#f8f7f4" }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-4 text-center">
          {[
            { value: "500+", label: "Homes Sold" },
            { value: "12 Years", label: "Experience" },
            { value: "98%", label: "Client Satisfaction" },
          ].map(({ value, label }) => (
            <div key={label} className="py-2">
              <p className="text-2xl md:text-3xl font-bold" style={{ color: "#1e3a5f" }}>
                {value}
              </p>
              <p className="text-xs md:text-sm text-gray-500 mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-sm font-semibold tracking-widest uppercase mb-3"
              style={{ color: "#c9a84c" }}
            >
              Why Choose Us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "#1e3a5f" }}>
              A Better Way to Buy a Home
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              We combine local expertise with modern technology to make your home search effortless.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔍",
                title: "Personalized Search",
                desc: "We learn your preferences — neighborhood, size, style, budget — and surface only the listings that genuinely fit. No noise, no wasted weekends.",
              },
              {
                icon: "🤝",
                title: "Expert Agents",
                desc: "Our licensed agents average 10+ years of local market experience. You get honest advice, skilled negotiation, and someone in your corner from day one.",
              },
              {
                icon: "✅",
                title: "Seamless Process",
                desc: "From your first inquiry to the closing table, we handle the paperwork, timelines, and coordination so you can focus on what matters — finding your home.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition group"
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3
                  className="font-bold text-lg mb-3 group-hover:text-[#c9a84c] transition"
                  style={{ color: "#1e3a5f" }}
                >
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-6" style={{ backgroundColor: "#f8f7f4" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-yellow-400 text-xl mb-4">★★★★★</div>
          <blockquote className="text-lg md:text-xl text-gray-700 italic leading-relaxed mb-6">
            &ldquo;The team at Prestige Properties found us our dream home in just three weeks. Their process is streamlined,
            their agents are sharp, and they truly listened to what we wanted. I can&apos;t recommend them enough.&rdquo;
          </blockquote>
          <p className="font-semibold" style={{ color: "#1e3a5f" }}>
            — Sarah & Michael T., First-Time Buyers
          </p>
        </div>
      </section>

      {/* Chat Section */}
      <section id="chat" className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p
              className="text-sm font-semibold tracking-widest uppercase mb-3"
              style={{ color: "#c9a84c" }}
            >
              Get Matched Today
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#1e3a5f" }}>
              Start Your Home Search
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Answer a few quick questions and one of our agents will reach out with personalized listings and guidance — no commitment required.
            </p>
          </div>
          <ChatWidget />
          <p className="text-center text-xs text-gray-400 mt-4">
            🔒 Your information is private and will never be shared with third parties.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: "#1e3a5f" }}
            >
              PP
            </div>
            <span className="font-semibold text-sm" style={{ color: "#1e3a5f" }}>
              Prestige Properties
            </span>
          </div>
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} Prestige Properties. All rights reserved. Licensed Real Estate Brokerage.
          </p>
          <div className="flex gap-5 text-xs text-gray-400">
            <a href="#" className="hover:text-gray-600 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600 transition">Terms of Service</a>
            <a href="#" className="hover:text-gray-600 transition">Fair Housing</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
