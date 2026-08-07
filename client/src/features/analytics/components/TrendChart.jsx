import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import ChartTooltip from "./ChartTooltip";

const AXIS_STROKE = "#525252";

const gradientId = (color) => `trend-fill-${color.replace("#", "")}`;

const buildAxes = ({ xDataKey, xFormatter, yFormatter, reversed, yDomain }) => [
  <CartesianGrid
    key="grid"
    stroke="#262626"
    strokeDasharray="3 3"
    vertical={false}
  />,
  <XAxis
    key="x"
    dataKey={xDataKey}
    stroke={AXIS_STROKE}
    fontSize={11}
    tickLine={false}
    axisLine={false}
    tickFormatter={xFormatter}
  />,
  <YAxis
    key="y"
    stroke={AXIS_STROKE}
    fontSize={11}
    tickLine={false}
    axisLine={false}
    reversed={reversed}
    tickFormatter={yFormatter}
    domain={yDomain}
  />,
  <Tooltip
    key="tooltip"
    content={<ChartTooltip xFormatter={xFormatter} yFormatter={yFormatter} />}
    cursor={{ fill: "rgba(255,255,255,0.04)" }}
  />,
];

function TrendChart({
  variant = "line",
  data,
  dataKey,
  color,
  reversed = false,
  xDataKey = "label",
  xFormatter,
  yFormatter,
  height = 280,
}) {
  const yDomain = reversed ? ["dataMin - 1", "dataMax + 1"] : [0, "auto"];
  const axes = buildAxes({ xDataKey, xFormatter, yFormatter, reversed, yDomain });

  if (variant === "bar") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          {axes}
          <Bar key="series" dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (variant === "area") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          {axes}
          <defs key="gradient">
            <linearGradient id={gradientId(color)} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            key="series"
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId(color)})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        {axes}
        <Line
          key="series"
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default TrendChart;
