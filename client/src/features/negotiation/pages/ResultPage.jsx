import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../../components/ui/Button";
import { formatCurrency } from "../../../utils/formatters";

const META = {
  ACCEPTED: {
    title: "Deal done!",
    emoji: "🎉",
    subtitle: "You talked the price down. Nice haggling.",
    glow: "bg-emerald-500/20",
  },
  WALK_AWAY: {
    title: "No deal",
    emoji: "🚪",
    subtitle: "The seller walked away. Try a friendlier offer next time.",
    glow: "bg-amber-500/20",
  },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 220, damping: 22 },
  },
};

function CountUp({ value, duration = 0.9 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>{formatCurrency(display)}</>;
}

function Stars({ count }) {
  return (
    <motion.div variants={item} className="relative">
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <motion.span
            key={index}
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: index < count ? 1 : 0.35 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 15,
              delay: 0.55 + index * 0.12,
            }}
            className={`text-3xl ${
              index < count ? "text-amber-400" : "text-neutral-700"
            }`}
            aria-hidden="true"
          >
            ★
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <motion.div
      variants={item}
      className="rounded-2xl border border-neutral-800 bg-neutral-900/80 px-5 py-4 text-center"
    >
      <p className="text-[11px] font-medium tracking-wider text-neutral-500 uppercase">
        {label}
      </p>
      <p className={`mt-1.5 text-2xl font-bold tracking-tight ${accent}`}>
        {value}
      </p>
    </motion.div>
  );
}

function ResultPage() {
  const navigate = useNavigate();
  const result = useSelector((state) => state.negotiation.result);
  const product = useSelector((state) => state.negotiation.product);
  const [copied, setCopied] = useState(false);

  const meta = META[result?.status] || META.WALK_AWAY;
  const accepted = result?.status === "ACCEPTED";

  const finalPrice = result?.finalPrice ?? null;
  const marketPrice = product?.marketPrice ?? 0;
  const savings =
    accepted && finalPrice != null ? Math.max(0, marketPrice - finalPrice) : null;
  const savingsPct =
    savings != null && marketPrice > 0
      ? Math.round((savings / marketPrice) * 100)
      : null;

  const stars = useMemo(() => {
    if (!accepted || savingsPct == null) {
      return 1;
    }
    if (savingsPct >= 25) return 5;
    if (savingsPct >= 18) return 4;
    if (savingsPct >= 12) return 3;
    if (savingsPct >= 6) return 2;
    return 1;
  }, [accepted, savingsPct]);

  const shareText = accepted
    ? `I just snagged ${product?.name ?? "a great deal"} for ${formatCurrency(
        finalPrice
      )} (${formatCurrency(savings)} saved) on BargainAI!`
    : `I couldn't close the deal on ${
        product?.name ?? "BargainAI"
      } — can you do better?`;

  useEffect(() => {
    if (!result) {
      navigate("/products", { replace: true });
    }
  }, [result, navigate]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "BargainAI result", text: shareText, url });
        return;
      } catch {
        // user cancelled the share sheet
      }
    }
    try {
      await navigator.clipboard?.writeText(`${shareText} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800/80">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-lg font-bold tracking-tight">
            <span className="text-violet-400">Bargain</span>AI
          </span>
        </div>
      </header>

      <main className="mx-auto flex max-w-lg flex-col px-4 py-10 sm:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8 text-center"
        >
          <motion.div
            aria-hidden="true"
            className={`pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full blur-3xl ${meta.glow}`}
          />

          <motion.div variants={item} className="relative">
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 14,
                delay: 0.2,
              }}
              className="inline-block text-6xl"
              aria-hidden="true"
            >
              {meta.emoji}
            </motion.span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">
              {meta.title}
            </h1>
            <p className="mt-1.5 text-sm text-neutral-400">{meta.subtitle}</p>
          </motion.div>

          <motion.div
            variants={item}
            className="relative mt-6 flex items-center justify-center gap-2 text-sm text-neutral-400"
          >
            <span className="text-2xl" aria-hidden="true">
              {product?.image ?? "🛍️"}
            </span>
            <span className="font-medium text-neutral-300">
              {product?.name ?? "Product"}
            </span>
          </motion.div>

          <div className="relative mt-8">
            <Stars count={stars} />
            <motion.p
              variants={item}
              className="mt-2 text-xs text-neutral-500"
            >
              {accepted
                ? `${stars} of 5 haggling skill`
                : "The deal slipped away"}
            </motion.p>
          </div>

          <div className="relative mt-8 grid grid-cols-2 gap-4">
            <StatCard
              label="Final price"
              value={
                finalPrice != null ? (
                  <CountUp value={finalPrice} />
                ) : (
                  "—"
                )
              }
              accent={
                accepted ? "text-emerald-400" : "text-neutral-500"
              }
            />
            <StatCard
              label="You saved"
              value={
                savings != null ? (
                  <>
                    <CountUp value={savings} />
                    {savingsPct != null && (
                      <span className="ml-2 align-middle text-xs font-semibold text-emerald-500">
                        {savingsPct}%
                      </span>
                    )}
                  </>
                ) : (
                  "—"
                )
              }
              accent="text-emerald-400"
            />
          </div>

          <motion.div variants={item} className="relative mt-8 space-y-3">
            <Button onClick={() => navigate("/products")}>Play again</Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/leaderboard")}
            >
              View leaderboard
            </Button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white focus:outline-none"
            >
              {copied ? "Copied to clipboard!" : "Share result"}
            </button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default ResultPage;
