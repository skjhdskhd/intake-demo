'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion, type Transition } from 'framer-motion';
import ChatWidget from '@/components/ChatWidget';

const Grainient = dynamic(() => import('@/components/Grainient'), { ssr: false });
const HouseAnimation = dynamic(() => import('@/components/HouseAnimation'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '380px' }} />,
});
const FallingText = dynamic(() => import('@/components/FallingText'), { ssr: false });

/* ── Count-up hook ──────────────────────────────────── */
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

function StatItem({ target, suffix, prefix, label }: { target: number; suffix: string; prefix: string; label: string }) {
  const { ref, display } = useCountUp(target, suffix, prefix);
  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-number">{display}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ── Motion helpers ─────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const fadeLeft = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } };

/* ── SVG Icons ──────────────────────────────────────── */
const IconClock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#89CFF0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconLightning = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#89CFF0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconMoon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#89CFF0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const IconBrowser = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#89CFF0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="28" height="24" rx="2" />
    <line x1="2" y1="11" x2="30" y2="11" />
    <circle cx="6.5" cy="7.5" r="1" fill="#89CFF0" stroke="none" />
    <circle cx="10" cy="7.5" r="1" fill="#89CFF0" stroke="none" />
    <circle cx="13.5" cy="7.5" r="1" fill="#89CFF0" stroke="none" />
    <line x1="9" y1="18" x2="23" y2="18" />
    <line x1="9" y1="22" x2="18" y2="22" />
  </svg>
);
const IconChat = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#89CFF0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M28 6H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6l4 4 4-4h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
    <path d="M16 12v1" strokeWidth="2.5" />
    <circle cx="16" cy="16" r="1" fill="#89CFF0" stroke="none" />
    <path d="M10 16h1M21 16h1" />
  </svg>
);
const IconDoc = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#89CFF0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2H8a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10L18 2z" />
    <polyline points="18 2 18 10 26 10" />
    <line x1="10" y1="17" x2="22" y2="17" />
    <line x1="10" y1="21" x2="17" y2="21" />
    <polyline points="13 13 11 15 13 17" />
    <polyline points="19 13 21 15 19 17" />
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
    <circle cx="8" cy="8" r="7.5" stroke="#89CFF0" strokeOpacity="0.4" />
    <polyline points="4.5,8.5 7,11 11.5,6" stroke="#89CFF0" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────── */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function smooth(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  const mv = prefersReduced
    ? { hidden: {}, show: {} }
    : fadeUp;

  const transition = (delay = 0): Transition => ({
    duration: 0.5,
    ease: 'easeOut' as const,
    delay,
  });

  return (
    <>
      {/* ── NAVBAR ───────────────────────────────────── */}
      <nav className={`navbar ${scrolled ? 'navbar--solid' : 'navbar--transparent'}`}>
        <div className="navbar__inner">
          <a href="#" className="navbar__logo" onClick={(e) => smooth(e, 'hero')}>
            Intake AI<span className="navbar__dot" />
          </a>
          <ul className="navbar__links">
            {[
              { label: 'How It Works', id: 'how-it-works' },
              { label: 'Why Us', id: 'why-us' },
              { label: 'Results', id: 'results' },
              { label: 'Pricing', id: 'pricing' },
              { label: 'Contact', id: 'contact' },
            ].map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} onClick={(e) => smooth(e, link.id)}>{link.label}</a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="navbar__cta-btn" onClick={(e) => smooth(e, 'contact')}>
            Request Demo
          </a>
          <button
            className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`navbar__overlay${menuOpen ? ' open' : ''}`}>
        {[
          { label: 'How It Works', id: 'how-it-works' },
          { label: 'Why Us', id: 'why-us' },
          { label: 'Results', id: 'results' },
          { label: 'Pricing', id: 'pricing' },
          { label: 'Contact', id: 'contact' },
        ].map((link) => (
          <a key={link.id} href={`#${link.id}`} onClick={(e) => smooth(e, link.id)}>{link.label}</a>
        ))}
        <a href="#contact" className="navbar__overlay-cta" onClick={(e) => smooth(e, 'contact')}>Request Demo</a>
      </div>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="hero" id="hero">
        <Grainient
          color1="#89CFF0"
          color2="#0F2035"
          color3="#0A1A2E"
          grainAmount={0.04}
          timeSpeed={0.12}
          warpStrength={0.6}
          contrast={1.2}
          saturation={0.85}
        />
        <div className="hero__overlay" />
        <div className="hero__glow-radial" />
        <div className="hero__inner">
          <div className="hero__left">
            <motion.div
              className="hero__badge"
              variants={prefersReduced ? {} : { hidden: { opacity: 0, y: -10 }, show: { opacity: 1, y: 0 } }}
              initial="hidden"
              animate="show"
              transition={transition(0.3)}
            >
              <span className="hero__badge-dot" />
              Now qualifying leads in 12 cities
            </motion.div>

            <motion.h1
              className="hero__headline"
              variants={prefersReduced ? {} : fadeLeft}
              initial="hidden"
              animate="show"
              transition={transition(0.5)}
            >
              Every Serious Buyer Deserves a Real Conversation
            </motion.h1>

            <motion.p
              className="hero__sub"
              variants={prefersReduced ? {} : fadeLeft}
              initial="hidden"
              animate="show"
              transition={transition(0.7)}
            >
              Intake doesn&rsquo;t just collect information — it understands it. Every visitor gets a personalized conversation. Every agent gets a brief worth reading.
            </motion.p>

            <motion.div
              className="hero__buttons"
              variants={prefersReduced ? {} : fadeUp}
              initial="hidden"
              animate="show"
              transition={transition(0.9)}
            >
              <a href="#demo" className="btn-primary" onClick={(e) => smooth(e, 'demo')}>See It In Action</a>
              <a href="#contact" className="btn-secondary" onClick={(e) => smooth(e, 'contact')}>Book a Free Demo</a>
            </motion.div>

            <motion.p
              className="hero__proof"
              variants={prefersReduced ? {} : fadeUp}
              initial="hidden"
              animate="show"
              transition={transition(1.1)}
            >
              Trusted by independent agents and boutique firms
            </motion.p>
          </div>

          <div className="hero__right">
            <HouseAnimation />
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────── */}
      <section className="stats-bar">
        <div className="stats-bar__inner">
          <StatItem target={2400} prefix="" suffix="+" label="Leads Qualified" />
          <div className="stats-bar__divider" />
          <StatItem target={8} prefix="$" suffix="M+" label="In Pipeline Generated" />
          <div className="stats-bar__divider" />
          <StatItem target={94} prefix="" suffix="%" label="Client Retention Rate" />
          <div className="stats-bar__divider" />
          <StatItem target={11} prefix="" suffix=" Min" label="Avg Response Time" />
        </div>
      </section>

      {/* ── WHY US ───────────────────────────────────── */}
      <section className="why-us" id="why-us">
        <div className="why-us__inner">
          <motion.div
            className="section-eyebrow"
            variants={mv}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={transition(0)}
          >
            Why Intake AI
          </motion.div>
          <motion.h2
            className="section-headline dark"
            variants={mv}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={transition(0.1)}
          >
            Watch Your Old Problems Disappear
          </motion.h2>
          <motion.p
            className="section-subheadline dark"
            variants={mv}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={transition(0.2)}
          >
            Everything that used to drain your day — gone.
          </motion.p>

          <motion.div
            variants={mv}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={transition(0.3)}
            style={{ width: '100%' }}
          >
            <FallingText
              text="Unqualified leads Missed calls Wasted hours No-shows Cold prospects After-hours inquiries Slow response Lost clients Tire kickers Inbox chaos Missed opportunities Manual follow-up Ghosted leads Time wasted Ignored voicemails"
              highlightWords={['Unqualified', 'Missed', 'Wasted', 'Lost', 'Cold', 'Ignored', 'Ghosted', 'No-shows']}
              highlightClass="falling-highlight"
              trigger="scroll"
              fontSize="1.3rem"
              gravity={0.8}
              backgroundColor="transparent"
              className="why-us__falling"
            />
          </motion.div>

          <div className="why-us__columns">
            {[
              {
                icon: <IconClock />,
                heading: 'Zero hours wasted',
                copy: 'Intake handles every inbound inquiry the moment it arrives. No more sorting through messages that go nowhere.',
              },
              {
                icon: <IconLightning />,
                heading: 'Briefs, not forms',
                copy: 'Every lead arrives with a rich summary — name, needs, timeline, financing. Everything you need before you pick up the phone.',
              },
              {
                icon: <IconMoon />,
                heading: 'Always on',
                copy: '3am inquiry on a Sunday? Intake answers it. Your competition\'s voicemail does not.',
              },
            ].map((col, i) => (
              <motion.div
                key={i}
                className="why-us__col"
                variants={mv}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={transition(i * 0.1)}
              >
                <div className="why-us__col-icon">{col.icon}</div>
                <h3 className="why-us__col-heading">{col.heading}</h3>
                <p className="why-us__col-copy">{col.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="how-it-works" id="how-it-works">
        <div className="how-it-works__inner">
          <motion.div
            className="section-eyebrow"
            variants={mv}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={transition(0)}
          >
            The Process
          </motion.div>
          <motion.h2
            className="section-headline dark"
            variants={mv}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={transition(0.1)}
          >
            Built to Think. Not Just Ask.
          </motion.h2>
          <motion.p
            className="section-subheadline dark"
            variants={mv}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={transition(0.2)}
          >
            Most lead tools ask questions. Intake understands answers.
          </motion.p>

          <div className="how-it-works__cards">
            {[
              {
                icon: <IconBrowser />,
                num: '1',
                title: 'Live on your site in minutes',
                copy: 'We handle the entire setup. One snippet of code, fully customized to your brand, your market, and your clients. You are live before the day ends.',
              },
              {
                icon: <IconChat />,
                num: '2',
                title: 'It listens. Then it thinks.',
                copy: 'Intake reads between the lines. It picks up on urgency, hesitation, and intent — then asks exactly the right follow-up at exactly the right moment.',
              },
              {
                icon: <IconDoc />,
                num: '3',
                title: 'You get a brief, not a form',
                copy: 'A rich, human-readable summary lands in your inbox the moment a visitor is ready. Everything you need before you make the call.',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="how-card"
                variants={mv}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={transition(i * 0.1)}
              >
                <div className="how-card__watermark">{card.num}</div>
                <div className="how-card__icon">{card.icon}</div>
                <h3 className="how-card__title">{card.title}</h3>
                <p className="how-card__copy">{card.copy}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="how-it-works__footer"
            variants={mv}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={transition(0.4)}
          >
            Setup takes under 10 minutes. We handle everything.
          </motion.p>
        </div>
      </section>

      {/* ── LIVE DEMO ────────────────────────────────── */}
      <section className="demo-section" id="demo">
        <div className="demo-section__glow" />
        <div className="demo-section__inner">
          <motion.h2
            className="demo-section__headline"
            variants={mv}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={transition(0)}
          >
            <em>See Intake Think in Real Time</em>
          </motion.h2>
          <motion.p
            className="demo-section__sub"
            variants={mv}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={transition(0.1)}
          >
            This is the exact experience your leads will have. Start a conversation — no signup needed.
          </motion.p>
          <motion.div
            className="demo-section__widget"
            variants={mv}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={transition(0.2)}
          >
            <ChatWidget />
          </motion.div>
          <p className="demo-section__note">
            This demo is live. Your responses are processed by the same AI your clients will use.
          </p>
        </div>
      </section>

      {/* ── RESULTS ──────────────────────────────────── */}
      <section className="results" id="results">
        <div className="results__inner">
          <motion.div
            className="section-eyebrow light"
            variants={mv}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={transition(0)}
          >
            Real Results
          </motion.div>
          <motion.h2
            className="section-headline light"
            variants={mv}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={transition(0.1)}
          >
            What Agents Are Saying
          </motion.h2>

          <div className="results__cards">
            {[
              {
                quote: 'I used to spend three hours a day calling leads that went nowhere. Now I only get on the phone with people who are actually ready to move.',
                author: 'Marcus T., Residential Agent, Chicago',
              },
              {
                quote: 'The briefs Intake sends are more detailed than what my assistant used to write. I know exactly who I am calling before I dial.',
                author: 'Sarah K., Buyer Specialist, Austin',
              },
              {
                quote: 'It feels like having the world\'s most prepared receptionist working around the clock. My response time went from hours to minutes.',
                author: 'David R., Listing Agent, Miami',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="result-card"
                variants={mv}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={transition(i * 0.1)}
              >
                <div className="result-card__stars">★★★★★</div>
                <p className="result-card__quote">&ldquo;{card.quote}&rdquo;</p>
                <p className="result-card__author">— {card.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────── */}
      <section className="pricing" id="pricing">
        <div className="pricing__inner">
          <div className="pricing__left">
            <motion.div
              className="section-eyebrow"
              variants={mv}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={transition(0)}
            >
              Pricing
            </motion.div>
            <motion.h2
              className="section-headline dark"
              variants={mv}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={transition(0.1)}
            >
              One Plan. Everything Included.
            </motion.h2>
            <motion.p
              className="pricing__description"
              variants={mv}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={transition(0.2)}
            >
              Simple pricing because your time is valuable. One setup fee, one monthly rate, and we handle everything in between. We offer a free 30-day trial to qualifying agencies — reach out to see if you qualify.
            </motion.p>
          </div>

          <motion.div
            className="pricing__card"
            variants={mv}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={transition(0.2)}
          >
            <div className="pricing__badge">Intake Pro</div>

            <div className="pricing__amount">$399</div>
            <div className="pricing__amount-label">One-Time Setup Fee</div>
            <div className="pricing__amount-note">We configure and go live before the day is over</div>

            <div className="pricing__divider" />

            <div className="pricing__amount">
              $99<span className="pricing__mo">/mo</span>
            </div>
            <div className="pricing__amount-label">Monthly Service Fee</div>
            <div className="pricing__amount-note">Hosting, AI, briefs, delivery, support</div>

            <div className="pricing__divider" />

            <ul className="pricing__list">
              {[
                'AI concierge live on your website 24 hours a day',
                'Intelligent qualification on every visitor',
                'Detailed lead brief delivered to your inbox instantly',
                'Unlimited conversations per month',
                'Email and SMS brief delivery',
                'Weekly performance summary',
                'Telegram alerts for urgent leads',
                'Full setup handled by our team',
                'Cancel anytime, no contracts',
              ].map((item, i) => (
                <li key={i}>
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a href="#contact" className="pricing__cta-btn" onClick={(e) => smooth(e, 'contact')}>
              Get Started
            </a>
            <p className="pricing__sub">Questions? Book a free 15-minute call — no pressure, just answers.</p>
            <p className="pricing__fine">No hidden fees. No annual lock-in. Pause or cancel anytime.</p>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────── */}
      <section className="final-cta" id="contact">
        <div className="final-cta__inner">
          <motion.h2
            className="final-cta__headline"
            variants={mv}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={transition(0)}
          >
            Stop Chasing. Start Closing.
          </motion.h2>
          <motion.p
            className="final-cta__sub"
            variants={mv}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={transition(0.1)}
          >
            Join the agents and attorneys letting Intake handle the qualifying.
          </motion.p>
          <motion.div
            className="final-cta__form"
            variants={mv}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={transition(0.2)}
          >
            <input type="email" placeholder="your@email.com" className="final-cta__input" />
            <button className="btn-primary" type="button">Request Demo</button>
          </motion.div>
          <p className="final-cta__fine">No contracts. No setup fees to try. Cancel anytime.</p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__brand">
            <div className="footer__logo">Intake AI<span className="navbar__dot" /></div>
            <p className="footer__tagline">Every Lead. Qualified. Automatically.</p>
          </div>
          <nav className="footer__links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#contact" onClick={(e) => smooth(e, 'contact')}>Contact</a>
          </nav>
          <div className="footer__right">Built for real estate agents and law firms</div>
        </div>
        <p className="footer__copy">&copy; 2026 Intake AI. All rights reserved.</p>
      </footer>
    </>
  );
}
