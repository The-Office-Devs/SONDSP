import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type { EvolutionComparativeItem } from "@/class-map/class-map.types";
import {
  AFTER_COLOR,
  AFTER_FILL_ID,
  AXIS_TEXT_COLOR,
  DELTA_DOWN_COLOR,
  DELTA_UP_COLOR,
  formatStudents,
  getDeltaTrend,
  getLevelLabel,
  LEVEL_TEXT_COLOR,
  SERIES,
  SLATE_200_COLOR
} from "@/lib/class-map-utils";

interface EvolutionComparativeCardProps {
  items: EvolutionComparativeItem[];
  strandName?: string;
  isFetching?: boolean;
}

const TITLE = "Evoluções e Declínios em relação à última sondagem";

const DELTA_ICON_SIZE = 12;
const DELTA_ICON_GAP = 2;
const DELTA_DIGIT_WIDTH = 7;

function DeltaValue({ delta }: Readonly<{ delta: number }>) {
  if (delta === 0) return <span className="font-semibold text-slate-800">sem variação</span>;

  const { Icon, color } = getDeltaTrend(delta);

  return (
    <span className="inline-flex items-center gap-0.5 font-semibold tabular-nums" style={{ color }}>
      <Icon aria-hidden="true" className="size-3" strokeWidth={4} />
      {Math.abs(delta)}
    </span>
  );
}

function DeltaTick({ delta }: Readonly<{ delta: number }>) {
  const { Icon, color } = getDeltaTrend(delta);
  const value = delta === 0 ? "" : String(Math.abs(delta));
  const textWidth = value ? DELTA_ICON_GAP + value.length * DELTA_DIGIT_WIDTH : 0;
  const startX = -(DELTA_ICON_SIZE + textWidth) / 2;

  return (
    <>
      <Icon x={startX} y={18} size={DELTA_ICON_SIZE} color={color} strokeWidth={4} aria-hidden="true" />
      {value && (
        <text x={startX + DELTA_ICON_SIZE + DELTA_ICON_GAP} y={28} fontSize={12} fontWeight={700} fill={color}>
          {value}
        </text>
      )}
    </>
  );
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: unknown }>;
}

function renderTooltip({ active, payload }: ChartTooltipProps) {
  const item = payload?.[0]?.payload as EvolutionComparativeItem | undefined;
  if (!active || !item) return null;

  const levelLabel = getLevelLabel(item.level);

  return (
    <div className="min-w-40 rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs">
      <p className="font-semibold text-slate-800">
        {item.level}
        {levelLabel && <span className="font-normal text-slate-500"> · {levelLabel}</span>}
      </p>

      <ul className="mt-2 space-y-1">
        {SERIES.map((series) => (
          <li key={series.key} className="flex items-center gap-2">
            <span aria-hidden="true" className="h-0.5 w-3 rounded-full" style={{ backgroundColor: series.color }} />
            <span className="font-semibold tabular-nums text-slate-900">{item[series.key]}</span>
            <span className="text-slate-500">{series.label}</span>
          </li>
        ))}
      </ul>

      <p className="mt-2 flex items-center gap-1 border-t border-neutral-300 pt-2 text-slate-500">
        Variação: <DeltaValue delta={item.after - item.before} />
      </p>
    </div>
  );
}

interface LevelTickProps {
  x?: number | string;
  y?: number | string;
  payload?: { value?: unknown };
}

function createLevelTick(deltaByLevel: Map<string, number> | null) {
  return function LevelTick({ x = 0, y = 0, payload }: LevelTickProps) {
    const level = String(payload?.value ?? "");
    const delta = deltaByLevel?.get(level);

    return (
      <g transform={`translate(${x},${y})`}>
        <text dy={12} textAnchor="middle" fontSize={12} fontWeight={600} fill={LEVEL_TEXT_COLOR}>
          {level}
        </text>
        {delta !== undefined && <DeltaTick delta={delta} />}
      </g>
    );
  };
}

export function EvolutionComparativeCard({
  items,
  strandName,
  isFetching = false
}: Readonly<EvolutionComparativeCardProps>) {
  const totals = {
    before: items.reduce((sum, item) => sum + item.before, 0),
    after: items.reduce((sum, item) => sum + item.after, 0)
  };
  const hasBefore = totals.before > 0;

  const deltaByLevel = hasBefore
    ? new Map(items.map((item) => [item.level, item.after - item.before]))
    : null;

  return (
    <section
      aria-label={TITLE}
      aria-busy={isFetching}
      className="relative w-full overflow-hidden rounded-xl border border-neutral-300 bg-neutral-100"
    >
      {isFetching && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-md">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Carregando dados...</span>
          </div>
        </div>
      )}

      <header className="bg-primary px-4 py-3 text-white">
        <h2 className="text-sm font-semibold">{TITLE}</h2>
      </header>

      <div className="p-4">
        {totals.after === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Nenhum aluno avaliado com os filtros selecionados.
          </p>
        ) : (
          <div className="rounded-md border border-neutral-300 bg-white px-3 pb-3 pt-4">
            {!hasBefore && (
              <p className="mb-2 text-xs text-slate-500">
                Nenhum aluno tem uma sondagem anterior com os filtros selecionados, então ainda não há
                "Antes" para comparar.
              </p>
            )}

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={items} margin={{ top: 12, right: 12, bottom: 36, left: 8 }}>
                  <defs>
                    <linearGradient id={AFTER_FILL_ID} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={AFTER_COLOR} stopOpacity={0.20} />
                      <stop offset="100%" stopColor={AFTER_COLOR} stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke={SLATE_200_COLOR} vertical={false} />

                  <XAxis
                    dataKey="level"
                    tickLine={false}
                    axisLine={{ stroke: "SLATE_200_COLOR" }}
                    tick={createLevelTick(deltaByLevel)}
                    interval={0}
                    padding={{ left: 16, right: 16 }}
                    label={{
                      value: strandName ? `Níveis de ${strandName}` : "Níveis da Sondagem",
                      position: "insideBottom",
                      offset: -28,
                      fill: AXIS_TEXT_COLOR,
                      fontSize: 14
                    }}
                  />
                  <YAxis
                    allowDecimals={false}
                    domain={[0, "dataMax + 1"]}
                    tickLine={false}
                    axisLine={false}
                    width={50}
                    tick={{ fill: AXIS_TEXT_COLOR, fontSize: 12 }}
                    label={{
                      value: "Quantidade de Alunos",
                      angle: -90,
                      position: "insideLeft",
                      offset: 4,
                      fill: AXIS_TEXT_COLOR,
                      fontSize: 14,
                      style: { textAnchor: "middle" }
                    }}
                  />

                  <Tooltip content={renderTooltip} cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }} />

                  {hasBefore &&
                    items
                      .filter((item) => item.before !== item.after)
                      .map((item) => (
                        <ReferenceLine
                          key={`change-${item.level}`}
                          segment={[
                            { x: item.level, y: item.before },
                            { x: item.level, y: item.after }
                          ]}
                          stroke={SLATE_200_COLOR}
                          strokeWidth={8}
                          strokeLinecap="round"
                        />
                      ))}

                  <Area
                    type="linear"
                    dataKey="after"
                    stroke="none"
                    fill={`url(#${AFTER_FILL_ID})`}
                    isAnimationActive={false}
                    activeDot={false}
                    tooltipType="none"
                  />

                  {SERIES.filter((series) => series.key === "after" || hasBefore).map((series) => (
                    <Line
                      key={series.key}
                      type="linear"
                      dataKey={series.key}
                      name={series.label}
                      stroke={series.color}
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      dot={{ r: 8, fill: series.color, stroke: "#ffffff", strokeWidth: 2 }}
                      activeDot={{ r: 10, fill: series.color, stroke: "#ffffff", strokeWidth: 2 }}
                      isAnimationActive={true}
                    />
                  ))}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-slate-700">
              {SERIES.map((series) => (
                <li key={series.key} className="flex items-center gap-2">
                  <span aria-hidden="true" className="relative flex h-2 w-5 items-center">
                    <span className="h-0.5 w-full rounded-full" style={{ backgroundColor: series.color }} />
                    <span
                      className="absolute left-1/2 size-2 -translate-x-1/2 rounded-full"
                      style={{ backgroundColor: series.color }}
                    />
                  </span>
                  {series.label}
                  <span className="text-slate-500">({formatStudents(totals[series.key])})</span>
                </li>
              ))}
              {hasBefore && (
                <li className="flex items-center gap-1 text-xs text-slate-500">
                  <span aria-hidden="true" className="flex">
                    <ArrowUp className="size-3.5" color={DELTA_UP_COLOR} strokeWidth={4} />
                    <ArrowDown className="size-3.5" color={DELTA_DOWN_COLOR} strokeWidth={4} />
                  </span>
                  sob os níveis: diferença de alunos (Depois − Antes)
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}