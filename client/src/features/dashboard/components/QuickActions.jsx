const ACTIONS = [
  {
    key: "new-game",
    label: "Start New Game",
    description: "Begin a new negotiation",
    icon: "🕹️",
    onClick: () => {},
  },
  {
    key: "leaderboard",
    label: "View Leaderboard",
    description: "See top bargainers",
    icon: "🏅",
    onClick: () => {},
  },
  {
    key: "refresh",
    label: "Refresh Stats",
    description: "Pull the latest numbers",
    icon: "🔄",
    onClick: () => {},
  },
];

function QuickActions({ onStartGame, onViewLeaderboard, onRefresh, isRefreshing }) {
  const handlers = {
    "new-game": onStartGame,
    leaderboard: onViewLeaderboard,
    refresh: onRefresh,
  };

  return (
    <section>
      <h2 className="text-sm font-semibold tracking-wide text-neutral-400 uppercase">
        Quick Actions
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ACTIONS.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={handlers[action.key]}
            disabled={action.key === "refresh" && isRefreshing}
            className="group rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 text-left transition hover:border-violet-600/60 hover:bg-neutral-800/80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="text-2xl">{action.icon}</span>
            <p className="mt-3 text-sm font-semibold text-white group-hover:text-violet-300">
              {action.key === "refresh" && isRefreshing
                ? "Refreshing…"
                : action.label}
            </p>
            <p className="mt-1 text-xs text-neutral-400">{action.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;
