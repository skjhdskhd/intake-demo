"use client";

import { useEffect, useState } from "react";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // 1. Navbar scroll listener
    const navbar = document.getElementById("navbar");
    const handleScroll = () => {
      if (!navbar) return;
      if (window.scrollY > 50) {
        navbar.classList.add("navbar--scrolled");
      } else {
        navbar.classList.remove("navbar--scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 2. Count-up animation
    const statEls = document.querySelectorAll<HTMLElement>(".stat-number");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = parseFloat(el.dataset.target ?? "0");
          const isDecimal = target % 1 !== 0;
          const duration = 1200;
          const start = performance.now();
          const prefix = el.dataset.prefix ?? "";
          const suffix = el.dataset.suffix ?? "";

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            el.textContent =
              prefix +
              (isDecimal
                ? current.toFixed(1)
                : Math.floor(current).toLocaleString()) +
              suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = prefix + (isDecimal ? target.toFixed(1) : target.toLocaleString()) + suffix;
          };
          requestAnimationFrame(tick);
          observer.unobserve(el);
        });
      },
      { threshold: 0.3 }
    );
    statEls.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToHow = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToChat = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("chat-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav id="navbar" className="navbar">
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "72px",
          }}
        >
          {/* Wordmark */}
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.01em",
            }}
          >
            Prestige Properties
          </span>

          {/* Desktop nav */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "2rem" }}
            className="hidden-mobile"
          >
            {["Buy", "Sell", "About"].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  opacity: 0.9,
                }}
              >
                {link}
              </a>
            ))}
            <a
              href="#chat-section"
              onClick={scrollToChat}
              style={{
                background: "#C9A84C",
                color: "#0A1628",
                padding: "0.55rem 1.4rem",
                borderRadius: "6px",
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.background = "#b08d38")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.background = "#C9A84C")
              }
            >
              Get Started
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="show-mobile"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: "24px",
                  height: "2px",
                  background: "#fff",
                  borderRadius: "2px",
                }}
              />
            ))}
          </button>
        </div>

        {/* Mobile dropdown */}
        <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
          {["Buy", "Sell", "About"].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                fontWeight: 500,
              }}
            >
              {link}
            </a>
          ))}
          <a
            href="#chat-section"
            onClick={(e) => { setMobileOpen(false); scrollToChat(e); }}
            style={{
              background: "#C9A84C",
              color: "#0A1628",
              padding: "0.6rem 1.4rem",
              borderRadius: "6px",
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-block",
              width: "fit-content",
            }}
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        style={{
          height: "100vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10, 22, 40, 0.55)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "0 1.5rem",
            maxWidth: "760px",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.625rem, 6vw, 4.5rem)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
            }}
          >
            Your Next Chapter Starts Here
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.25rem",
              fontWeight: 400,
              color: "#fff",
              opacity: 0.85,
              maxWidth: "560px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.6,
            }}
          >
            Our AI concierge listens first, then connects you with a local expert — usually within the hour.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="#chat-section"
              onClick={scrollToChat}
              style={{
                background: "#C9A84C",
                color: "#0A1628",
                padding: "0.875rem 2rem",
                borderRadius: "6px",
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.background = "#b08d38")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.background = "#C9A84C")
              }
            >
              Find Your Home
            </a>
            <a
              href="#how-it-works"
              onClick={scrollToHow}
              style={{
                background: "transparent",
                color: "#fff",
                border: "1.5px solid #fff",
                padding: "0.875rem 2rem",
                borderRadius: "6px",
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                fontWeight: 500,
                textDecoration: "none",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.target as HTMLElement;
                el.style.background = "#fff";
                el.style.color = "#0A1628";
              }}
              onMouseLeave={(e) => {
                const el = e.target as HTMLElement;
                el.style.background = "transparent";
                el.style.color = "#fff";
              }}
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="scroll-arrow"
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="15" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            <path
              d="M10 14l6 6 6-6"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────── */}
      <section
        style={{
          background: "#0A1628",
          padding: "64px 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0,
          }}
          className="stats-grid"
        >
          {[
            { display: "$40M+", target: "40", prefix: "$", suffix: "M+", label: "Sold" },
            { display: "1,200+", target: "1200", prefix: "", suffix: "+", label: "Families Placed" },
            { display: "14", target: "14", prefix: "", suffix: "", label: "Days Avg. Close" },
            { display: "98%", target: "98", prefix: "", suffix: "%", label: "Satisfaction" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                padding: "0 2rem",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.15)" : "none",
              }}
            >
              <span
                className="stat-number"
                data-target={stat.target}
                data-prefix={stat.prefix}
                data-suffix={stat.suffix}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "3rem",
                  fontWeight: 700,
                  color: "#C9A84C",
                  display: "block",
                  lineHeight: 1.1,
                  marginBottom: "0.5rem",
                }}
              >
                {stat.display}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROCESS SECTION ────────────────────────────────── */}
      <section
        id="how-it-works"
        style={{
          background: "#E8E6E1",
          padding: "96px 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "3rem",
                fontWeight: 700,
                color: "#0A1628",
                marginBottom: "1rem",
              }}
            >
              A Smarter Way to Find Home
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.125rem",
                color: "#666",
              }}
            >
              Three steps. Zero pressure. Real results.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "3rem",
            }}
            className="steps-grid"
          >
            {[
              {
                num: "01",
                title: "Tell Us What You're Looking For",
                body: "Use our chat concierge to share your timeline, budget, and must-haves. It takes under three minutes and there's no commitment.",
              },
              {
                num: "02",
                title: "We Match You Instantly",
                body: "Our AI scores your needs and identifies the right local expert for your search. No generic handoffs — just the right agent.",
              },
              {
                num: "03",
                title: "Your Agent Reaches Out Same Day",
                body: "A licensed local agent reviews your profile and follows up within the hour. Real expertise, activated by smart technology.",
              },
            ].map((step) => (
              <div
                key={step.num}
                style={{ position: "relative", paddingTop: "3rem" }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    fontFamily: "var(--font-heading)",
                    fontSize: "7.5rem",
                    fontWeight: 700,
                    color: "#C9A84C",
                    opacity: 0.3,
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {step.num}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#0A1628",
                    marginBottom: "1rem",
                    position: "relative",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1rem",
                    color: "#444",
                    lineHeight: 1.7,
                    position: "relative",
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ───────────────────────────────────── */}
      <section
        style={{
          background: "#fff",
          padding: "96px 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "3rem",
              fontWeight: 700,
              color: "#0A1628",
              textAlign: "center",
              marginBottom: "3.5rem",
            }}
          >
            What Our Clients Say
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "2rem",
            }}
            className="cards-grid"
          >
            {[
              {
                quote:
                  "We told them our budget and timeline on a Tuesday. By Thursday we had toured three homes that were genuinely perfect. The agent already knew exactly what we wanted.",
                name: "Marcus T.",
                neighborhood: "Lincoln Park",
              },
              {
                quote:
                  "I've bought two homes and this was the first time the process felt effortless. The concierge asked smarter questions than most agents I've worked with.",
                name: "Diana R.",
                neighborhood: "River North",
              },
              {
                quote:
                  "Skeptical at first about an AI intake system but it was shockingly good. Felt personal. Our agent called within 45 minutes of us finishing the chat.",
                name: "James & Priya K.",
                neighborhood: "Wicker Park",
              },
            ].map((card) => (
              <div
                key={card.name}
                style={{
                  background: "#fff",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                  borderRadius: "12px",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <span
                  style={{
                    color: "#C9A84C",
                    fontSize: "1.125rem",
                    letterSpacing: "2px",
                  }}
                >
                  {"★★★★★"}
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1rem",
                    fontStyle: "italic",
                    color: "#444",
                    lineHeight: 1.7,
                    flex: 1,
                  }}
                >
                  &ldquo;{card.quote}&rdquo;
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    color: "#0A1628",
                    fontWeight: 700,
                    fontVariant: "small-caps",
                    letterSpacing: "0.05em",
                  }}
                >
                  {card.name}{" "}
                  <span style={{ fontWeight: 400, opacity: 0.7 }}>
                    — {card.neighborhood}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHAT SECTION ───────────────────────────────────── */}
      <section
        id="chat-section"
        style={{
          background: "#0A1628",
          padding: "96px 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              fontWeight: 700,
              color: "#F8F6F1",
              marginBottom: "1.25rem",
              lineHeight: 1.15,
            }}
          >
            Your{" "}
            <span style={{ color: "#C9A84C" }}>Private</span>{" "}
            Home Search Starts Here
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.125rem",
              color: "rgba(255,255,255,0.75)",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Our AI concierge is available 24/7 — answer a few quick questions and a local expert will follow up within the hour.
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "rgba(255,255,255,0.45)",
              marginTop: "0.75rem",
            }}
          >
            No spam. No pressure. Your information stays private.
          </p>

          <div
            style={{
              maxWidth: "680px",
              margin: "2.5rem auto 0",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
              overflow: "hidden",
            }}
          >
            <ChatWidget />
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer
        style={{
          background: "#0A1628",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          padding: "48px 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
          className="footer-inner"
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#fff",
                marginBottom: "0.25rem",
              }}
            >
              Prestige Properties
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Powered by AI. Backed by local expertise.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1.75rem", alignItems: "center" }}>
            {["Privacy Policy", "Terms", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "#fff")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)")
                }
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div
          style={{
            maxWidth: "1100px",
            margin: "2rem auto 0",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "1.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            &copy; 2024 Prestige Properties. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ── Responsive styles ──────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
          .stats-grid    { grid-template-columns: repeat(2, 1fr) !important; gap: 2rem !important; }
          .steps-grid    { grid-template-columns: 1fr !important; }
          .cards-grid    { grid-template-columns: 1fr !important; }
          .footer-inner  { flex-direction: column; align-items: center; text-align: center; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}
