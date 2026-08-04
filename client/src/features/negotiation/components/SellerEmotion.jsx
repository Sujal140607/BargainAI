const EMOTIONS = {
  neutral: { icon: "😐", label: "Neutral" },
  happy: { icon: "😊", label: "Happy" },
  pleased: { icon: "😌", label: "Pleased" },
  annoyed: { icon: "😒", label: "Annoyed" },
  frustrated: { icon: "😤", label: "Frustrated" },
};

function SellerEmotion({ emotion }) {
  const meta = EMOTIONS[emotion] || EMOTIONS.neutral;

  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/80 px-4 py-3">
      <span className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
        Seller Emotion
      </span>
      <span className="flex items-center gap-2 text-sm font-semibold text-white">
        <span className="text-xl" aria-hidden="true">
          {meta.icon}
        </span>
        {meta.label}
      </span>
    </div>
  );
}

export default SellerEmotion;
