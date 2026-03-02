"use client";

import { useEffect, useRef, useState } from "react";

/* ───────── Fade-in observer ───────── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useFadeIn();
  return (
    <div ref={ref} id={id} className={`fade-section ${className}`}>
      {children}
    </div>
  );
}

/* ───────── Phone Mockup ───────── */
function Phone({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`phone-frame ${className}`}>
      <div className="phone-notch" />
      <div className="phone-screen">{children}</div>
      <div className="phone-home" />
    </div>
  );
}

/* ───────── FAQ Accordion ───────── */
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left cursor-pointer group"
      >
        <span className="font-serif text-lg sm:text-xl font-medium pr-4 group-hover:text-terracotta transition-colors">
          {q}
        </span>
        <span
          className={`text-warm-muted text-2xl transition-transform duration-300 shrink-0 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div className={`faq-answer ${open ? "open" : ""}`}>
        <p className="pb-6 text-warm-muted leading-relaxed max-w-2xl">{a}</p>
      </div>
    </div>
  );
}

/* ───────── Waitlist Form ───────── */
function WaitlistForm({ id }: { id?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<
    "idle" | "loading" | "success" | "duplicate" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.duplicate) {
        setState("duplicate");
      } else if (res.ok) {
        setState("success");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div id={id} className="text-center">
        <div className="inline-flex items-center gap-2 bg-terracotta-light text-terracotta-dark px-6 py-4 rounded-xl font-medium text-lg">
          <span>✓</span> You&apos;re on the list.
        </div>
        <p className="text-warm-muted mt-4 text-sm">
          We&apos;ll send you one email when the app is live. That&apos;s it.
        </p>
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-warm-muted text-sm mb-3">
            Know someone you&apos;ve been meaning to catch up with? Send them
            this page.
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                "https://weshouldcatchup.vercel.app"
              );
            }}
            className="text-terracotta font-medium text-sm hover:text-terracotta-dark transition-colors cursor-pointer underline underline-offset-2"
          >
            Copy link to share
          </button>
        </div>
      </div>
    );
  }

  if (state === "duplicate") {
    return (
      <div id={id} className="text-center">
        <p className="text-warm-muted text-lg">
          You&apos;re already on the list! We&apos;ll be in touch.
        </p>
      </div>
    );
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full"
    >
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-5 py-4 rounded-xl border border-border bg-card text-warm-charcoal placeholder:text-warm-light focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/30 text-base transition-all"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="px-8 py-4 bg-terracotta text-white rounded-xl font-medium text-base hover:bg-terracotta-dark transition-all disabled:opacity-60 cursor-pointer shrink-0"
      >
        {state === "loading" ? "..." : "I'm in"}
      </button>
      {state === "error" && (
        <p className="text-red-500 text-sm mt-1 sm:mt-0 sm:self-center">
          Something went wrong. Try again?
        </p>
      )}
    </form>
  );
}

/* ───────── Ping Animation Dots ───────── */
function PingDots() {
  return (
    <div className="flex items-center gap-2 justify-center my-6">
      <div className="w-2 h-2 rounded-full bg-terracotta animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 rounded-full bg-terracotta animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-2 h-2 rounded-full bg-terracotta animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

/* ───────── Main Page ───────── */
export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* ─── Hero ─── */}
      <section className="min-h-[90vh] flex items-center justify-center px-6 pt-20 pb-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-[3.4rem] font-medium leading-[1.12] tracking-tight mb-8">
              You keep saying &ldquo;we should catch up sometime.&rdquo;{" "}
              <span className="text-terracotta">
                This app actually makes it happen.
              </span>
          </h1>
            <p className="text-lg sm:text-xl text-warm-muted leading-relaxed max-w-xl mb-10">
              A simple iOS app that connects you with the people you&apos;ve
              been meaning to talk to — whenever one of you is actually free.
              No scheduling. No calendar invites. No &ldquo;does Thursday
              work?&rdquo;
            </p>
            <WaitlistForm />
            <p className="text-warm-light text-sm mt-5">
              iOS app coming soon. We&apos;ll email you once when it&apos;s
              ready.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Phone className="phone-hero">
              {/* Main screen — I'm Free button */}
              <div className="flex flex-col h-full">
                <div className="text-center pt-6 pb-2">
                  <div className="text-[11px] font-medium tracking-wider uppercase text-warm-light">
                    We Should Catch Up
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-6">
                  <div className="w-32 h-32 rounded-full bg-terracotta flex items-center justify-center shadow-lg shadow-terracotta/25 mb-5 phone-pulse">
                    <span className="text-white font-serif text-xl font-medium">
                      I&apos;m Free
                    </span>
                  </div>
                  <p className="text-warm-muted text-xs text-center leading-relaxed mt-2">
                    Tap when you have a moment.<br />We&apos;ll find someone to catch up with.
                  </p>
                </div>
                <div className="px-5 pb-5">
                  <div className="flex items-center justify-between text-[10px] text-warm-light">
                    <span>4 people in your queue</span>
                    <span className="text-terracotta font-medium">●</span>
                  </div>
                </div>
              </div>
            </Phone>
          </div>
        </div>
      </section>

      {/* ─── The Problem ─── */}
      <Section className="bg-card px-6 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mb-8">
            You mean it every time.
          </h2>
          <div className="space-y-5 text-warm-muted text-lg leading-relaxed">
            <p className="font-serif text-xl sm:text-2xl text-warm-charcoal italic leading-snug">
              &ldquo;We should catch up.&rdquo; &ldquo;Let&apos;s get coffee
              soon.&rdquo; &ldquo;It&apos;s been way too long.&rdquo;
            </p>
            <p>You say it. You mean it. And then nothing happens.</p>
            <p>
              It&apos;s not because you don&apos;t care. It&apos;s because
              catching up with someone requires both of you to be free at the
              same time, and coordinating that is surprisingly annoying. You
              text back and forth about availability. Maybe you find a slot two
              weeks out. Then one of you cancels. Then the thread goes cold.
            </p>
            <p>
              Meanwhile, you had 20 minutes in the car yesterday where you
              would&apos;ve happily called them. But you didn&apos;t think to,
              or you figured they&apos;d be busy, or you just didn&apos;t want
              to bother them.
            </p>
            <p className="text-warm-charcoal font-medium">
              That&apos;s the gap this app fills.
            </p>
          </div>
        </div>
      </Section>

      {/* ─── How It Works ─── */}
      <Section className="px-6 py-24 sm:py-32">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mb-16 text-center">
            How it works
          </h2>

          {/* Step 1 */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mb-24">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="shrink-0 w-9 h-9 rounded-full bg-terracotta-light text-terracotta flex items-center justify-center font-serif font-semibold text-base">
                  1
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-medium">
                  Send a catch-up link
                </h3>
              </div>
              <p className="text-warm-muted text-lg leading-relaxed ml-12">
                You send someone a &ldquo;we should catch up&rdquo; link —
                over text, in a DM, wherever. If they accept, you&apos;re now
                in each other&apos;s catch-up queue. That&apos;s it. No
                back-and-forth about when you&apos;re free.
              </p>
            </div>
            <div className="flex justify-center">
              <Phone>
                <div className="flex flex-col h-full">
                  <div className="text-center pt-6 pb-3">
                    <div className="text-[11px] font-medium tracking-wider uppercase text-warm-light">
                      Invite
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center px-5">
                    <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center mb-4">
                      <span className="text-2xl">👋</span>
                    </div>
                    <p className="font-serif text-sm font-medium text-warm-charcoal text-center mb-1">
                      Send a catch-up link
                    </p>
                    <p className="text-[11px] text-warm-light text-center mb-5 leading-relaxed">
                      Share with someone you&apos;ve been<br />meaning to talk to
                    </p>
                    <div className="w-full bg-cream rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-terracotta/15 flex items-center justify-center text-xs">S</div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-warm-charcoal">Sarah Chen</div>
                          <div className="text-[10px] text-warm-light">Accepted ✓</div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-cream rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-terracotta/15 flex items-center justify-center text-xs">M</div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-warm-charcoal">Marcus J.</div>
                          <div className="text-[10px] text-terracotta">Pending...</div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-terracotta text-white text-center py-2.5 rounded-lg text-xs font-medium mt-2">
                      + Invite someone new
                    </div>
                  </div>
                  <div className="h-6" />
                </div>
              </Phone>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mb-24">
            <div className="flex justify-center md:order-first max-md:order-last">
              <Phone>
                <div className="flex flex-col h-full">
                  <div className="text-center pt-6 pb-2">
                    <div className="text-[11px] font-medium tracking-wider uppercase text-warm-light">
                      We Should Catch Up
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center px-6">
                    <div className="w-28 h-28 rounded-full bg-terracotta flex items-center justify-center shadow-lg shadow-terracotta/30 mb-4 phone-pulse">
                      <span className="text-white font-serif text-lg font-medium">
                        I&apos;m Free
                      </span>
                    </div>
                    <p className="text-warm-muted text-[11px] text-center leading-relaxed mt-1 mb-5">
                      You&apos;re going live...
                    </p>
                    <div className="flex gap-4 text-center">
                      <div>
                        <div className="text-[10px] text-warm-light">🍳</div>
                        <div className="text-[9px] text-warm-light mt-0.5">Cooking</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-warm-light">🚗</div>
                        <div className="text-[9px] text-warm-light mt-0.5">Driving</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-warm-light">🛋️</div>
                        <div className="text-[9px] text-warm-light mt-0.5">Chilling</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-warm-light">✈️</div>
                        <div className="text-[9px] text-warm-light mt-0.5">Waiting</div>
                      </div>
                    </div>
                  </div>
                  <div className="h-6" />
                </div>
              </Phone>
            </div>
            <div className="md:order-last max-md:order-first">
              <div className="flex items-center gap-3 mb-4">
                <div className="shrink-0 w-9 h-9 rounded-full bg-terracotta-light text-terracotta flex items-center justify-center font-serif font-semibold text-base">
                  2
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-medium">
                  Tap &ldquo;I&apos;m Free&rdquo; when you have a moment
                </h3>
              </div>
              <p className="text-warm-muted text-lg leading-relaxed ml-12">
                Doing the dishes. On a long drive. Sitting in traffic. Waiting
                for a flight. Whenever you&apos;ve got some time and you&apos;d
                be down to talk, you open the app and tap one button.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="shrink-0 w-9 h-9 rounded-full bg-terracotta-light text-terracotta flex items-center justify-center font-serif font-semibold text-base">
                  3
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-medium">
                  The app handles the rest
                </h3>
              </div>
              <p className="text-warm-muted text-lg leading-relaxed ml-12 mb-4">
                When you go live, the app sends a notification to one person in
                your queue. If they tap in, you&apos;re connected — voice
                call, right in the app. If they don&apos;t respond within
                about a minute, the app quietly pings the next person.
              </p>
              <p className="text-warm-charcoal text-lg leading-relaxed ml-12">
                You don&apos;t pick who to call. You don&apos;t have to
                decide. You just say &ldquo;I&apos;m free&rdquo; and the app
                connects you with someone you already agreed you should catch
                up with.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-4">
                {/* Notification mockup */}
                <div className="notification-card w-64">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-terracotta flex items-center justify-center shrink-0">
                      <span className="text-white text-sm">💬</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-warm-charcoal">
                        We Should Catch Up
                      </div>
                      <div className="text-[11px] text-warm-muted leading-snug mt-0.5">
                        Sarah is free to catch up right now. Tap to connect.
                      </div>
                    </div>
                    <div className="text-[9px] text-warm-light shrink-0">now</div>
                  </div>
                </div>
                <PingDots />
                {/* Connected call screen */}
                <Phone>
                  <div className="flex flex-col h-full bg-warm-charcoal">
                    <div className="flex-1 flex flex-col items-center justify-center px-6">
                      <div className="w-20 h-20 rounded-full bg-terracotta/20 flex items-center justify-center mb-4">
                        <span className="text-3xl">👩</span>
                      </div>
                      <p className="text-white font-serif text-lg font-medium mb-1">
                        Sarah Chen
                      </p>
                      <p className="text-white/50 text-xs mb-8">
                        Catching up · 2:34
                      </p>
                      <div className="flex gap-8">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="text-white/70 text-sm">🔇</span>
                          </div>
                          <span className="text-white/40 text-[9px]">Mute</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="text-white/70 text-sm">🔊</span>
                          </div>
                          <span className="text-white/40 text-[9px]">Speaker</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center -mt-1.5">
                            <span className="text-white text-lg">✕</span>
                          </div>
                          <span className="text-white/40 text-[9px]">End</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-6" />
                  </div>
                </Phone>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── What It Feels Like ─── */}
      <Section className="bg-card px-6 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mb-8">
            Think of it like running into a friend at the grocery store.
          </h2>
          <div className="space-y-5 text-warm-muted text-lg leading-relaxed">
            <p>
              There&apos;s no agenda. Nobody scheduled it. You&apos;re both
              just... there. So you talk. Maybe for five minutes, maybe for
              forty-five. It doesn&apos;t matter.
            </p>
            <p>
              That&apos;s the energy. Except instead of the grocery store,
              it&apos;s whenever either of you has a spare moment and feels
              like talking.
            </p>
          </div>
        </div>
      </Section>

      {/* ─── Who It's For ─── */}
      <Section className="px-6 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mb-6">
            Works for your best friend. Works for your network.
          </h2>
          <p className="text-warm-muted text-lg leading-relaxed mb-12">
            Some of your best relationships started with a quick conversation
            at the right time. This app creates more of those moments —
            whether it&apos;s personal or professional.
          </p>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl p-8 border border-border">
              <div className="text-2xl mb-4">☕</div>
              <h3 className="font-serif text-xl font-medium mb-3">
                Your people
              </h3>
              <p className="text-warm-muted leading-relaxed">
                Old college friends. Your cousin you never call enough. The
                group chat that talks every day but hasn&apos;t actually
                spoken in months. Keep real friendships alive without the
                scheduling dance.
              </p>
            </div>
            <div className="bg-card rounded-xl p-8 border border-border">
              <div className="text-2xl mb-4">🤝</div>
              <h3 className="font-serif text-xl font-medium mb-3">
                Your network
              </h3>
              <p className="text-warm-muted leading-relaxed">
                That founder you met at a conference. A mentor you keep
                meaning to check in with. Former colleagues you still respect.
                The best professional relationships are built on real
                conversations, not LinkedIn likes.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── The Rotation ─── */}
      <Section className="px-6 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mb-8">
            You won&apos;t get spammed.
          </h2>
          <div className="space-y-5 text-warm-muted text-lg leading-relaxed">
            <p>
              When someone goes live, the app doesn&apos;t blast everyone in
              their queue at once. It pings one person at a time — starting
              with whoever you haven&apos;t caught up with in the longest
              time.
            </p>
            <p>
              If that person doesn&apos;t respond within about a minute, it
              moves on to the next person. And the next. It&apos;s a quiet,
              sequential rotation — not a group broadcast.
            </p>
            <p>
              On the receiving end, you&apos;ll occasionally get a
              notification that says something like &ldquo;Sarah is free to
              catch up.&rdquo; If you&apos;re around and want to talk, tap it.
              If not, just ignore it — it&apos;ll move on to someone else
              with zero awkwardness. No missed calls. No guilt.
            </p>
            <p>
              And the rotation is smart about it: people you haven&apos;t
              talked to in a while float to the top. So the app is naturally
              resurfacing relationships that have gone quiet, without you
              having to think about it.
            </p>
          </div>

          {/* Rotation visual */}
          <div className="mt-12 flex flex-col items-center">
            <div className="rotation-visual">
              <div className="rotation-person rotation-active">
                <div className="w-10 h-10 rounded-full bg-terracotta/15 flex items-center justify-center text-sm font-medium text-terracotta">S</div>
                <div className="text-xs"><span className="font-medium text-warm-charcoal">Sarah</span> <span className="text-terracotta text-[10px]">← pinging</span></div>
              </div>
              <div className="rotation-person rotation-waiting">
                <div className="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center text-sm font-medium text-warm-muted">M</div>
                <div className="text-xs text-warm-light">Marcus</div>
              </div>
              <div className="rotation-person rotation-waiting">
                <div className="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center text-sm font-medium text-warm-muted">J</div>
                <div className="text-xs text-warm-light">Jamie</div>
              </div>
              <div className="rotation-person rotation-waiting">
                <div className="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center text-sm font-medium text-warm-muted">R</div>
                <div className="text-xs text-warm-light">Rachel</div>
              </div>
            </div>
            <p className="text-warm-light text-xs mt-4 text-center">
              One at a time. Whoever you haven&apos;t talked to longest goes first.
            </p>
          </div>
        </div>
      </Section>

      {/* ─── Voice Only ─── */}
      <Section className="bg-card px-6 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mb-8">
            Voice only. On purpose.
          </h2>
          <div className="space-y-5 text-warm-muted text-lg leading-relaxed">
            <p>No video. No text chat. No feed. No stories.</p>
            <p>
              Just a voice conversation in the app when two people happen to
              be free at the same time.
            </p>
            <p>
              We&apos;re starting with voice only because it fits how people
              actually use this — you&apos;re catching up while doing
              something else. You&apos;re not staring at your screen.
              You&apos;re walking, cooking, driving, folding laundry. Voice is
              the right medium for that.
            </p>
          </div>
        </div>
      </Section>

      {/* ─── Under the Hood ─── */}
      <Section className="px-6 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mb-8">
            A bit about how it&apos;s built
          </h2>
          <div className="space-y-5 text-warm-muted text-lg leading-relaxed">
            <p>
              The app is built to be fast, reliable, and lightweight.
              Conversations are crystal clear even on spotty connections, and
              you&apos;ll get notified reliably even if the app isn&apos;t
              open.
            </p>
            <p>
              Everything runs on modern, efficient infrastructure that
              scales with you — whether ten people are using it or ten
              thousand.
            </p>
            <p className="text-warm-charcoal font-medium">
              There are no ads. We don&apos;t sell your data. We don&apos;t
              track your conversations. The app just connects you with people
              you already told it you want to talk to — and that&apos;s all
              it does.
            </p>
          </div>
        </div>
      </Section>

      {/* ─── FAQ ─── */}
      <Section className="bg-card px-6 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mb-10">
            Questions
          </h2>
          <div>
            <FAQ
              q="What if I get a notification and I'm busy?"
              a={`Nothing happens. The notification disappears, the app pings the next person in the other person's queue. There's no missed call, no "sorry I couldn't pick up" text needed. It's designed to be zero-pressure.`}
            />
            <FAQ
              q="Can I control who's in my queue?"
              a="Yes. You only get added to someone's queue if you accept their catch-up link. You can remove anyone from your queue at any time."
            />
            <FAQ
              q="What if nobody's free when I go live?"
              a={`The app keeps you in a "free" state for about 10 minutes. If someone from your queue opens the app during that window, it'll prompt them to connect. If nobody's around, it'll let you know. No big deal — just try again later.`}
            />
            <FAQ
              q="Is this just for 1-on-1 calls?"
              a="For now, yes. We're keeping it simple — one person at a time. Group catch-ups might come later but we want to nail the core experience first."
            />
            <FAQ
              q="How much does a call cost?"
              a="Nothing. The app is free. Voice calls run through in-app audio, not your phone's cellular minutes."
            />
            <FAQ q="Android?" a="iOS first. Android will come if there's enough demand." />
          </div>
        </div>
      </Section>

      {/* ─── Bottom Waitlist ─── */}
      <Section className="px-6 py-24 sm:py-32" id="waitlist">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mb-4">
            Want in?
          </h2>
          <p className="text-warm-muted text-lg mb-10 leading-relaxed">
            We&apos;re building this right now. Drop your email and we&apos;ll
            let you know when it&apos;s ready to download.
          </p>
          <WaitlistForm id="waitlist-form" />
          <p className="text-warm-light text-sm mt-6">
            One email when we launch. No spam. No newsletters. We&apos;ll
            never share your email.
          </p>
        </div>
      </Section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border px-6 py-10">
        <p className="text-center text-warm-light text-sm">
          We Should Catch Up &copy; 2026
        </p>
      </footer>
      </main>
  );
}
