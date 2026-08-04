import ProductSummary from "./ProductSummary";
import CurrentPrice from "./CurrentPrice";
import RoundsBadge from "./RoundsBadge";
import SellerEmotion from "./SellerEmotion";
import ProgressBar from "../../../components/ui/ProgressBar";

const getTone = (value) => {
  if (value >= 60) return "success";
  if (value >= 35) return "warning";
  return "danger";
};

function MeterRow({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
          {label}
        </span>
        <span className="text-sm font-semibold text-white">{value}</span>
      </div>
      <ProgressBar value={value} tone={tone} className="mt-2.5" />
    </div>
  );
}

function SellerPanel({ product, seller, currentRound }) {
  const trust = seller?.trustScore ?? 50;
  const patience = seller?.patience ?? 100;
  const maxRounds = seller?.maximumRounds ?? 10;

  return (
    <aside className="space-y-4">
      <ProductSummary product={product} />

      <CurrentPrice
        price={seller?.currentPrice ?? product.marketPrice}
        marketPrice={product.marketPrice}
      />

      <MeterRow label="Trust" value={trust} tone={getTone(trust)} />
      <MeterRow label="Patience" value={patience} tone={getTone(patience)} />

      <RoundsBadge current={currentRound} max={maxRounds} />

      <SellerEmotion emotion={seller?.emotion} />
    </aside>
  );
}

export default SellerPanel;
