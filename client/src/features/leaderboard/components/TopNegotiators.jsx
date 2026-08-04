const PODIUM = [
  { rank: 2, medal: "🥈", elevated: false },
  { rank: 1, medal: "🥇", elevated: true },
  { rank: 3, medal: "🥉", elevated: false },
];

const getTone = (value) => {
  if (value >= 60) return "text-emerald-400";
  if (value >= 35) return "text-amber-400";
  return "text-red-400";
};

function Avatar({ name, avatar }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt=""
        className="h-10 w-10 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600/30 text-sm font-bold text-violet-200">
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}

function PodiumCard({ player, medal, elevated }) {
  return (
    <div
      className={`flex flex-col items-center gap-3 ${elevated ? "order-2" : ""}`}
    >
      <span className="text-3xl" aria-hidden="true">
        {medal}
      </span>
      <div
        className={`w-full rounded-2xl border px-4 py-5 text-center ${
          elevated
            ? "border-violet-700/60 bg-violet-950/40 shadow-lg shadow-violet-900/30"
            : "border-neutral-800 bg-neutral-900/60"
        }`}
      >
        <div className="flex justify-center">
          <Avatar name={player?.name} avatar={player?.avatar} />
        </div>
        <p className="mt-2 truncate text-sm font-bold text-white">
          {player?.name ?? "—"}
        </p>
        <p
          className={`mt-1 text-lg font-semibold ${getTone(player?.winRate)}`}
        >
          {player?.winRate ?? 0}%
        </p>
        <p className="mt-0.5 text-xs text-neutral-500">
          {player?.wins ?? 0} wins · {player?.gamesPlayed ?? 0} games
        </p>
      </div>
      <span className="text-xs font-semibold tracking-wide text-neutral-500">
        #{player?.rank ?? "—"}
      </span>
    </div>
  );
}

function TopNegotiators({ players, isLoading }) {
  if (isLoading) {
    return (
      <section>
        <h2 className="text-sm font-semibold tracking-wide text-neutral-400 uppercase">
          Top Negotiators
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-8"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-sm font-semibold tracking-wide text-neutral-400 uppercase">
        Top Negotiators
      </h2>

      {players.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-neutral-800 p-8 text-center">
          <p className="text-2xl">🏆</p>
          <p className="mt-2 text-sm font-medium text-neutral-200">
            No rankings yet
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Finish a negotiation to claim the top spot.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex items-end justify-center gap-4">
          {PODIUM.map(({ rank, medal, elevated }) => {
            const player = players.find((p) => p.rank === rank);
            return (
              <div
                key={rank}
                className={`w-full max-w-[220px] ${
                  elevated ? "lg:-mt-6" : ""
                } ${elevated ? "order-2" : "order-1"}`}
              >
                <PodiumCard player={player} medal={medal} elevated={elevated} />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default TopNegotiators;
