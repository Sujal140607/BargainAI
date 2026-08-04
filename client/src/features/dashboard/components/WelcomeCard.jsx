function WelcomeCard({ user }) {
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <section className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-violet-950/80 via-neutral-900 to-neutral-900 p-6 sm:p-8">
      <p className="text-sm font-medium tracking-wide text-violet-400 uppercase">
        Welcome back
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {firstName} 👋
      </h1>
      <p className="mt-3 max-w-xl text-sm text-neutral-400">
        Ready to haggle? Pick up a new negotiation, check the leaderboard, or
        review your recent deals.
      </p>
    </section>
  );
}

export default WelcomeCard;
