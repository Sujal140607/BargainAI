import SectionCard from "../../../components/ui/SectionCard";

function AnalyticsChartCard({
  title,
  description,
  isLoading,
  isEmpty,
  emptyText,
  children,
}) {
  return (
    <SectionCard title={title}>
      {description && (
        <p className="mt-1 text-xs text-neutral-500">{description}</p>
      )}
      {isLoading ? (
        <div className="mt-4 h-72 animate-pulse rounded-xl bg-neutral-900/60" />
      ) : isEmpty ? (
        <p className="mt-4 rounded-xl border border-dashed border-neutral-800 p-10 text-center text-sm text-neutral-500">
          {emptyText}
        </p>
      ) : (
        <div className="mt-4">{children}</div>
      )}
    </SectionCard>
  );
}

export default AnalyticsChartCard;
