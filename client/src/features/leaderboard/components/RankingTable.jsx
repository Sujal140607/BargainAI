function RankBadge({ rank }) {
  const medal =
    rank === 1 ? "bg-amber-500/20 text-amber-300" : rank === 2
      ? "bg-neutral-500/20 text-neutral-300"
      : rank === 3
        ? "bg-orange-500/20 text-orange-300"
        : "bg-neutral-800 text-neutral-400";

  return (
    <span
      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${medal}`}
    >
      {rank}
    </span>
  );
}

function Avatar({ name, avatar }) {
  if (avatar) {
    return (
      <img src={avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
    );
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600/30 text-sm font-bold text-violet-200">
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}

function getTone(value) {
  if (value >= 60) return "text-emerald-400";
  if (value >= 35) return "text-amber-400";
  return "text-red-400";
}

function RankingTable({ rows, currentUserId }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-800 p-8 text-center">
        <p className="text-2xl">🗺️</p>
        <p className="mt-2 text-sm font-medium text-neutral-200">
          No negotiators found
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Try a different search term.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {rows.map((row) => {
        const isYou =
          currentUserId && String(row.userId) === String(currentUserId);

        return (
          <li
            key={row.userId}
            className={`grid grid-cols-[32px_1fr_auto] items-center gap-3 rounded-xl border px-4 py-3 sm:grid-cols-[32px_1fr_64px_64px_72px] ${
              isYou
                ? "border-violet-600/60 bg-violet-950/30"
                : "border-neutral-800 bg-neutral-900/60"
            }`}
          >
            <RankBadge rank={row.rank} />

            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={row.name} avatar={row.avatar} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {row.name}
                  {isYou && (
                    <span className="ml-2 rounded-full bg-violet-600/40 px-2 py-0.5 text-[10px] font-bold tracking-wide text-violet-200 uppercase">
                      You
                    </span>
                  )}
                </p>
                <p className="hidden text-xs text-neutral-500 sm:block">
                  {row.gamesPlayed} game{row.gamesPlayed === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <p className="hidden text-right text-xs text-neutral-500 sm:block">
              <span className="text-sm font-semibold text-white">
                {row.wins}
              </span>{" "}
              wins
            </p>
            <p className="hidden text-right text-xs text-neutral-500 sm:block">
              <span className="text-sm font-semibold text-white">
                {row.gamesPlayed}
              </span>{" "}
              games
            </p>
            <p
              className={`text-right text-sm font-bold ${getTone(row.winRate)}`}
            >
              {row.winRate}%
            </p>
          </li>
        );
      })}
    </ul>
  );
}

export default RankingTable;
