import SectionCard from "../../../components/ui/SectionCard";

const ACHIEVEMENTS = [
  {
    id: "first-game",
    emoji: "🎯",
    label: "First Move",
    description: "Complete your first negotiation",
    test: (stats) => stats.gamesPlayed >= 1,
  },
  {
    id: "first-win",
    emoji: "🏆",
    label: "First Win",
    description: "Win your first negotiation",
    test: (stats) => stats.wins >= 1,
  },
  {
    id: "sharpshooter",
    emoji: "🎖️",
    label: "Sharpshooter",
    description: "Reach a 60% or higher win rate",
    test: (stats) => stats.winRate >= 60,
  },
  {
    id: "veteran",
    emoji: "🥋",
    label: "Veteran",
    description: "Play 10 or more negotiations",
    test: (stats) => stats.gamesPlayed >= 10,
  },
  {
    id: "bargain-hunter",
    emoji: "🛒",
    label: "Bargain Hunter",
    description: "Save 20% or more on a single deal",
    test: (_stats, games) => games.some((game) => game.savingsPct >= 20),
  },
  {
    id: "top-10",
    emoji: "🚀",
    label: "Top 10",
    description: "Rank in the global top 10",
    test: (stats) => stats.rank > 0 && stats.rank <= 10,
  },
  {
    id: "perfect-deal",
    emoji: "💎",
    label: "Perfect Deal",
    description: "Save 35% or more on a single deal",
    test: (_stats, games) => games.some((game) => game.savingsPct >= 35),
  },
];

function Achievements({ stats, games, isLoading }) {
  const unlockedCount = stats
    ? ACHIEVEMENTS.filter((achievement) =>
        achievement.test(stats, games)
      ).length
    : 0;

  return (
    <SectionCard
      title={`Achievements · ${unlockedCount}/${ACHIEVEMENTS.length}`}
    >
      {isLoading ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ACHIEVEMENTS.map((achievement) => (
            <div
              key={achievement.id}
              className="h-28 animate-pulse rounded-xl border border-neutral-800 bg-neutral-900/80"
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = stats
              ? achievement.test(stats, games)
              : false;

            return (
              <div
                key={achievement.id}
                className={`flex flex-col items-start gap-1 rounded-xl border px-3.5 py-3 ${
                  isUnlocked
                    ? "border-violet-700/50 bg-violet-950/30"
                    : "border-neutral-800 bg-neutral-900/60 opacity-55"
                }`}
              >
                <span className="text-xl" aria-hidden="true">
                  {isUnlocked ? achievement.emoji : "🔒"}
                </span>
                <p
                  className={`text-sm font-semibold ${
                    isUnlocked ? "text-white" : "text-neutral-400"
                  }`}
                >
                  {achievement.label}
                </p>
                <p className="text-xs text-neutral-500">
                  {achievement.description}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}

export default Achievements;
