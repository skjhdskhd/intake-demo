"use client";

import { useEffect } from "react";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  useEffect(() => {
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              fontWeight: 400,
              color: "#fff",
              letterSpacing: "0.05em",
            }}
          >
            Intake
          </span>

          {/* Nav right */}
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <a
              href="#"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 400,
                opacity: 0.9,
              }}
            >
              For Agents
            </a>
            <a
              href="#chat-section"
              onClick={scrollToChat}
              style={{
                background: "#C9A84C",
                color: "#0A1628",
                padding: "0.55rem 1.4rem",
                borderRadius: "6px",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
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
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        style={{
          height: "100vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80')",
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
            background: "rgba(8, 18, 32, 0.5)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "0 1.5rem",
            maxWidth: "800px",
          }}
        >
          <h1
            className="hero-headline"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 400,
              color: "#fff",
              lineHeight: 1.15,
              marginBottom: "1.5rem",
            }}
          >
            Every Serious Buyer Deserves a Real Conversation
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "19px",
              fontWeight: 300,
              color: "#fff",
              opacity: 0.8,
              maxWidth: "520px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.65,
            }}
          >
            Intake qualifies your leads before they ever reach your inbox — so you spend your time on the ones that matter.
          </p>

          <a
            href="#chat-section"
            onClick={scrollToChat}
            style={{
              display: "inline-block",
              background: "#C9A84C",
              color: "#0A1628",
              padding: "0.9rem 2.25rem",
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
            Start a Conversation
          </a>
        </div>
      </section>

      {/* ── VALUE SECTION ──────────────────────────────────── */}
      <section
        style={{
          background: "#fff",
          padding: "80px 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              lineHeight: 1.8,
              color: "#333",
              marginBottom: "1.5rem",
            }}
          >
            Most leads go cold not because buyers aren&rsquo;t serious — but because no one followed up fast enough, or asked the right questions. Intake changes that.
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              lineHeight: 1.8,
              color: "#333",
            }}
          >
            A short, intelligent conversation collects what your team needs to know. Budget, timeline, financing status, neighborhood preferences. Then it routes a clean brief to the right agent, instantly.
          </p>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #E8E6E1",
              margin: "3rem 0 1.5rem",
            }}
          />

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "#999",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Available 24 Hours a Day
          </p>
        </div>
      </section>

      {/* ── CHAT SECTION ───────────────────────────────────── */}
      <section
        id="chat-section"
        style={{
          background: "#0A1628",
          padding: "80px 1.5rem",
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
              fontSize: "44px",
              fontWeight: 400,
              color: "#F8F6F1",
              lineHeight: 1.2,
              marginBottom: "0",
            }}
          >
            Begin Your Search
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              color: "rgba(255,255,255,0.6)",
              maxWidth: "480px",
              margin: "12px auto 0",
              lineHeight: 1.6,
            }}
          >
            Answer a few questions and a local specialist will be in touch.
          </p>

          <div
            style={{
              maxWidth: "660px",
              margin: "2.5rem auto 0",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
              overflow: "hidden",
            }}
          >
            <ChatWidget />
          </div>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "rgba(255,255,255,0.35)",
              marginTop: "1.25rem",
            }}
          >
            Your responses are private and shared only with your assigned agent.
          </p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer
        style={{
          background: "#0A1628",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "36px 1.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "rgba(255,255,255,0.4)",
            marginBottom: "0.5rem",
          }}
        >
          Intake — Private client intake for real estate professionals
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          &copy; 2024 Intake. All rights reserved.
        </p>
      </footer>

      {/* ── Responsive styles ──────────────────────────────── */}
      <style>{`
        .hero-headline {
          font-size: 68px;
        }
        @media (max-width: 768px) {
          .hero-headline {
            font-size: 40px !important;
          }
        }
      `}</style>
    </>
  );
}
