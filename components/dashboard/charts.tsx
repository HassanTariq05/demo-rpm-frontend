type BarChartProps = {
  completed: number[];
  labels: string[];
  scheduled: number[];
};

type LineChartProps = {
  labels: string[];
  series: Array<{
    color: string;
    name: string;
    values: number[];
  }>;
};

function smoothPath(
  values: number[],
  width: number,
  height: number,
  max: number,
  min = 0,
) {
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const span = max - min || 1;
  const points = values.map((value, index) => ({
    x: index * step,
    y: height - ((value - min) / span) * (height - 8) - 4,
  }));
  let path = `M ${points[0]?.x ?? 0} ${points[0]?.y ?? height}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const control = (current.x + next.x) / 2;

    path += ` C ${control} ${current.y}, ${control} ${next.y}, ${next.x} ${next.y}`;
  }

  return path;
}

export function Sparkline({
  color,
  values,
}: {
  color: string;
  values: number[];
}) {
  const width = 112;
  const height = 36;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const points = values.map((value, index) => ({
    x: index * step,
    y: height - ((value - min) / span) * (height - 8) - 4,
  }));
  let line = `M ${points[0]?.x ?? 0} ${points[0]?.y ?? height}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const control = (current.x + next.x) / 2;

    line += ` C ${control} ${current.y}, ${control} ${next.y}, ${next.x} ${next.y}`;
  }

  return (
    <svg
      aria-hidden="true"
      className="h-9 w-28 shrink-0"
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <path d={`${line} L ${width} ${height} L 0 ${height} Z`} fill={color} opacity="0.12" />
      <path
        d={line}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

export function ServiceBarChart({
  completed,
  labels,
  scheduled,
}: BarChartProps) {
  const peak = Math.max(...completed, ...scheduled, 1);
  const step = peak > 400 ? 200 : peak > 150 ? 50 : peak > 40 ? 20 : 10;
  const max = Math.ceil(peak / step) * step;
  const ticks = [0, max / 2, max];

  return (
    <div>
      <div className="flex gap-3">
        <div className="flex h-44 flex-col justify-between py-1 text-[11px] text-muted">
          {[...ticks].reverse().map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
        <div className="relative grid h-44 flex-1 grid-cols-5 items-end gap-3 border-b border-separator">
          <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-separator" />
          <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-separator" />
          {labels.map((label, index) => (
            <div
              key={label}
              className="flex h-full items-end justify-center gap-1"
            >
              <span
                className="w-2.5 rounded-t-sm bg-foreground/80"
                style={{ height: `${(completed[index] / max) * 100}%` }}
                title={`${label} completed ${completed[index]}`}
              />
              <span
                className="w-2.5 rounded-t-sm bg-accent"
                style={{ height: `${(scheduled[index] / max) * 100}%` }}
                title={`${label} scheduled ${scheduled[index]}`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-3 pl-8 text-center text-[11px] text-muted">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

export function ComplianceChart({ labels, series }: LineChartProps) {
  const width = 520;
  const height = 176;
  const values = series.flatMap((item) => item.values);
  const lowest = Math.min(...values);
  const highest = Math.max(...values);
  const padding = Math.max((highest - lowest) * 0.35, 4);
  const max = highest + padding;
  const min = Math.max(0, lowest - padding);

  return (
    <div>
      <svg
        aria-label="Reading compliance"
        className="h-44 w-full"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        {[0, 0.5, 1].map((step) => {
          const span = max - min || 1;
          const y = height - (step * span) / span * (height - 8) - 4;

          return (
            <line
              key={step}
              stroke="currentColor"
              strokeDasharray="3 4"
              strokeOpacity="0.15"
              x1="0"
              x2={width}
              y1={y}
              y2={y}
            />
          );
        })}
        {series.map((item) => (
          <path
            key={item.name}
            d={smoothPath(item.values, width, height, max, min)}
            fill="none"
            stroke={item.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        ))}
      </svg>
      <div
        className="mt-2 grid text-center text-[11px] text-muted"
        style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}
      >
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

export function ChartLegend({
  items,
}: {
  items: Array<{ color: string; label: string }>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}
