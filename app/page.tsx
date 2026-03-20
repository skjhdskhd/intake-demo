"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ChatWidget from "@/components/ChatWidget";

const HouseAnimation = dynamic(() => import("@/components/HouseAnimation"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "380px" }} />,
});

/* ── Count-up hook ────────────────────────────────── */
function useCountUp(target: number, suffix: string, prefix: string, duration = 2000) {
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            const val = Math.round(ease * target);
            setDisplay(`${prefix}${val.toLocaleString()}${suffix}`);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, suffix, prefix, duration]);

  return { ref, display };
}

/* ── Fade-in hook ─────────────────────────────────── */
function useFadeIn() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── Stats item ───────────────────────────────────── */
function StatItem({ target, suffix, prefix, label }: { target: number; suffix: string; prefix: string; label: string }) {
  const { ref, display } = useCountUp(target, suffix, prefix);
  return (
    <div className="stats__item" ref={ref}>
      <div className="stats__number">{display}</div>
      <div className="stats__label">{label}</div>
    </div>
  );
}

/* ── SVG Icons ────────────────────────────────────── */
const IconBrowser = () => (
  <svg className="how__icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="8" width="40" height="32" rx="3" />
    <line x1="4" y1="17" x2="44" y2="17" />
    <circle cx="11" cy="12.5" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="17" cy="12.5" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="23" cy="12.5" r="1.5" fill="currentColor" stroke="none" />
    <line x1="14" y1="26" x2="34" y2="26" />
    <line x1="14" y1="32" x2="28" y2="32" />
  </svg>
);

const IconSpark = () => (
  <svg className="how__icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 32C8 23.163 15.163 16 24 16s16 7.163 16 16" />
    <path d="M6 38h36" />
    <path d="M24 10V7" />
    <path d="M35.3 13.7l2.1-2.1" />
    <path d="M12.7 13.7l-2.1-2.1" />
    <path d="M24 22l1.5 3 3.5.5-2.5 2.4.6 3.5L24 29.8l-3.1 1.6.6-3.5L19 25.5l3.5-.5z" fill="currentColor" stroke="none" />
  </svg>
);

const IconDoc = () => (
  <svg className="how__icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M28 4H12a3 3 0 0 0-3 3v34a3 3 0 0 0 3 3h24a3 3 0 0 0 3-3V16L28 4z" />
    <polyline points="28 4 28 16 40 16" />
    <line x1="16" y1="26" x2="32" y2="26" />
    <line x1="16" y1="32" x2="26" y2="32" />
    <polyline points="20 21 17 24 20 27" />
    <polyline points="28 21 31 24 28 27" />
  </svg>
);

const CheckIcon = () => (
  <svg className="pricing__check" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeOpacity="0.3" />
    <polyline points="4.5,8.5 7,11 11.5,6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────── */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Navbar scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close menu on resize */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Fade-in refs */
  const howRef = useFadeIn() as React.RefObject<HTMLElement>;
  const demoRef = useFadeIn() as React.RefObject<HTMLElement>;
  const testRef = useFadeIn() as React.RefObject<HTMLElement>;
  const pricingRef = useFadeIn() as React.RefObject<HTMLElement>;
  const ctaRef = useFadeIn() as React.RefObject<HTMLElement>;

  function smooth(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {/* ── NAVBAR ─────────────────────────────────────── */}
      <nav className={`navbar ${scrolled ? "navbar--solid" : "navbar--transparent"}`}>
        <div className="navbar__inner">
          <a href="#" className="navbar__logo" onClick={e => smooth(e, "hero")}>
            Intake AI<span className="navbar__logo-dot" />
          </a>

          <ul className="navbar__links">
            <li><a href="#how-it-works" onClick={e => smooth(e, "how-it-works")}>How It Works</a></li>
            <li><a href="#results" onClick={e => smooth(e, "results")}>Results</a></li>
            <li><a href="#pricing" onClick={e => smooth(e, "pricing")}>Pricing</a></li>
            <li><a href="#contact" onClick={e => smooth(e, "contact")}>Contact</a></li>
            <li>
              <a href="#demo" onClick={e => smooth(e, "demo")} className="navbar__cta">
                Request Demo
              </a>
            </li>
          </ul>

          <button
            className={`navbar__hamburger${menuOpen ? " open" : ""}`}
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`navbar__mobile-overlay${menuOpen ? " open" : ""}`}>
        <a href="#how-it-works" onClick={e => smooth(e, "how-it-works")}>How It Works</a>
        <a href="#results" onClick={e => smooth(e, "results")}>Results</a>
        <a href="#pricing" onClick={e => smooth(e, "pricing")}>Pricing</a>
        <a href="#contact" onClick={e => smooth(e, "contact")}>Contact</a>
        <a href="#demo" onClick={e => smooth(e, "demo")} className="navbar__mobile-cta">Request Demo</a>
      </div>

      {/* ── HERO ───────────────────────────────────────── */}
      <section className="hero" id="hero">
        <div className="hero__grid-bg" />
        <div className="hero__glow" />
        <div className="hero__inner">
          {/* Left */}
          <div className="hero__left">
            <div className="hero__badge">
              <span className="hero__badge-pulse" />
              Now live in 12 cities across the US
            </div>
            <h1 className="hero__headline">
              Every Serious Buyer Deserves a Real Conversation
            </h1>
            <p className="hero__sub">
              Intake doesn&rsquo;t just collect information — it understands it. Every visitor gets a personalized conversation. Every agent gets a brief worth reading.
            </p>
            <div className="hero__buttons">
              <a href="#demo" className="btn-primary" onClick={e => smooth(e, "demo")}>
                See It In Action
              </a>
              <a href="#contact" className="btn-secondary" onClick={e => smooth(e, "contact")}>
                Book a Free Demo
              </a>
            </div>
            <p className="hero__proof">Trusted by independent agents and boutique firms</p>
          </div>

          {/* Right — house animation */}
          <div className="hero__right">
            <HouseAnimation />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────── */}
      <section className="stats">
        <div className="stats__inner">
          <StatItem target={2400} prefix="" suffix="+" label="Leads Qualified" />
          <StatItem target={8} prefix="$" suffix="M+" label="In Pipeline Generated" />
          <StatItem target={94} prefix="" suffix="%" label="Client Retention Rate" />
          <StatItem target={11} prefix="" suffix=" Min" label="Average Response Time" />
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────── */}
      <section className="how fade-in" id="how-it-works" ref={howRef as React.RefObject<HTMLElement>}>
        <div className="section-header">
          <h2 className="section-title">Built to Think. Not Just Ask.</h2>
          <p className="section-subtitle">Most lead tools ask questions. Intake understands answers.</p>
        </div>
        <div className="how__cards">
          <div className="how__card">
            <div className="how__watermark">1</div>
            <IconBrowser />
            <h3 className="how__card-title">Live on your site in minutes</h3>
            <p className="how__card-body">
              We handle the entire setup. Drop one line of code on your site and Intake is live — customized to your brand, your market, and your clients.
            </p>
          </div>
          <div className="how__card">
            <div className="how__watermark">2</div>
            <IconSpark />
            <h3 className="how__card-title">It listens. Then it thinks.</h3>
            <p className="how__card-body">
              Intake reads between the lines. It picks up on urgency, hesitation, and intent — then asks exactly the right follow-up at exactly the right moment.
            </p>
          </div>
          <div className="how__card">
            <div className="how__watermark">3</div>
            <IconDoc />
            <h3 className="how__card-title">You get a brief, not a form</h3>
            <p className="how__card-body">
              The moment a visitor is ready, a rich summary lands in your inbox. Name, needs, timeline, financing status, and a recommended next step. Everything you need before you pick up the phone.
            </p>
          </div>
        </div>
        <p className="how__footer">Setup takes under 10 minutes. We handle everything.</p>
      </section>

      {/* ── LIVE DEMO ──────────────────────────────────── */}
      <section className="demo fade-in" id="demo" ref={demoRef as React.RefObject<HTMLElement>}>
        <div className="demo__inner">
          <h2 className="demo__title">See Intake Think in Real Time</h2>
          <p className="demo__sub">
            This is the exact experience your leads will have. Start a conversation — no signup needed.
          </p>
          <div className="demo__widget-wrap">
            <ChatWidget />
          </div>
          <p className="demo__note">
            This demo is live. Your responses are processed by the same AI your clients will use.
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────── */}
      <section className="testimonials fade-in" id="results" ref={testRef as React.RefObject<HTMLElement>}>
        <div className="section-header">
          <h2 className="section-title">What Agents Are Saying</h2>
        </div>
        <div className="testimonials__cards">
          {[
            {
              quote: "I used to spend three hours a day calling leads that went nowhere. Now I only get on the phone with people who are actually ready to move.",
              author: "Marcus T., Residential Agent, Chicago",
            },
            {
              quote: "The briefs Intake sends are more detailed than what my assistant used to write. I know exactly who I am calling before I dial.",
              author: "Sarah K., Buyer Specialist, Austin",
            },
            {
              quote: "It feels like having the world's most prepared receptionist working around the clock. My response time went from hours to minutes.",
              author: "David R., Listing Agent, Miami",
            },
          ].map((t, i) => (
            <div className="tcard" key={i}>
              <div className="tcard__stars">
                {[...Array(5)].map((_, j) => <div key={j} className="tcard__star" />)}
              </div>
              <p className="tcard__quote">&ldquo;{t.quote}&rdquo;</p>
              <p className="tcard__author">— {t.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────── */}
      <section className="pricing fade-in" id="pricing" ref={pricingRef as React.RefObject<HTMLElement>}>
        <div className="pricing__inner">
          <div className="pricing__trust">
            <h2 className="pricing__trust-title">Simple pricing because your time is valuable.</h2>
            <p className="pricing__trust-body">
              One setup, one monthly fee, one less thing to worry about. We offer a free 30-day trial to qualifying agencies — reach out to ask if you qualify.
            </p>
          </div>
          <div className="pricing__card">
            <p className="pricing__plan-name">Intake Pro</p>

            <div className="pricing__fee-amount">$399</div>
            <div className="pricing__fee-label">One-Time Setup Fee</div>
            <div className="pricing__fee-note">
              We configure everything, embed it on your site, and test it before going live — zero effort on your end.
            </div>

            <div className="pricing__divider" />

            <div className="pricing__fee-amount">$99<span style={{ fontSize: "1.25rem", fontWeight: 500 }}>/mo</span></div>
            <div className="pricing__fee-label">Monthly Service Fee</div>
            <div className="pricing__fee-note">
              Covers hosting, AI usage, lead briefs, email delivery, and ongoing support.
            </div>

            <div className="pricing__divider" />

            <ul className="pricing__checklist">
              {[
                "AI concierge live on your website 24/7",
                "Intelligent qualification on every visitor",
                "Detailed lead brief delivered to your inbox instantly",
                "Unlimited conversations per month",
                "Email and SMS brief delivery",
                "Weekly performance summary",
                "Telegram alerts for urgent leads",
                "Full setup handled by our team",
                "Cancel anytime — no contracts, no commitments",
              ].map((item, i) => (
                <li key={i}>
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>

            <a href="#contact" className="pricing__cta" onClick={e => smooth(e, "contact")}>
              Get Started
            </a>
            <p className="pricing__sub">
              Questions? Book a free 15-minute call — no pressure, just answers.
            </p>
            <p className="pricing__fine">
              No hidden fees. No annual lock-in. Pause or cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────── */}
      <section className="final-cta fade-in" id="contact" ref={ctaRef as React.RefObject<HTMLElement>}>
        <h2 className="final-cta__title">Stop Chasing. Start Closing.</h2>
        <p className="final-cta__sub">
          Join the agents and attorneys letting Intake handle the qualifying.
        </p>
        <div className="final-cta__form">
          <input
            type="email"
            placeholder="your@email.com"
            className="final-cta__input"
          />
          <button className="btn-primary" type="button">
            Request Demo
          </button>
        </div>
        <p className="final-cta__fine">No contracts. No setup fees to try. Cancel anytime.</p>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__brand">
            <div className="footer__logo">
              Intake AI<span className="navbar__logo-dot" />
            </div>
            <p className="footer__tagline">Every Lead. Qualified. Automatically.</p>
          </div>
          <nav className="footer__links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#contact" onClick={e => smooth(e, "contact")}>Contact</a>
          </nav>
          <div className="footer__right">
            Built for real estate agents and law firms
          </div>
        </div>
        <p className="footer__copy">&copy; 2026 Intake AI. All rights reserved.</p>
      </footer>
    </>
  );
}
