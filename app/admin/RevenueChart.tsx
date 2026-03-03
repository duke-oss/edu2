"use client";

type MonthData = { month: string; revenue: number };

export default function RevenueChart({ data }: { data: MonthData[] }) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="mt-3">
      <div className="flex items-end gap-3 h-32">
        {data.map((d) => {
          const pct = Math.max((d.revenue / maxRevenue) * 100, d.revenue > 0 ? 4 : 0);
          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">
                {d.revenue > 0 ? `₩${(d.revenue / 10000).toFixed(0)}만` : ""}
              </span>
              <div className="w-full flex items-end" style={{ height: "80px" }}>
                <div
                  className="w-full rounded-t-md bg-primary/80 transition-all duration-500"
                  style={{ height: `${pct}%`, minHeight: d.revenue > 0 ? "4px" : "0" }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{d.month.slice(5)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
