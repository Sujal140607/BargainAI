function ChartTooltip({ active, payload, label, xFormatter, yFormatter }) {
  if (!active || !payload?.length) {
    return null;
  }

  const value = payload[0].value;

  return (
    <div className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm shadow-lg">
      <p className="text-neutral-400">{xFormatter ? xFormatter(label) : label}</p>
      <p className="font-semibold text-white">
        {yFormatter ? yFormatter(value) : value}
      </p>
    </div>
  );
}

export default ChartTooltip;
