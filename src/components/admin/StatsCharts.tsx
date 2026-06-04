"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["#E7162A", "#6366F1", "#10B981", "#F59E0B", "#14B8A6"];

export function StatsCharts({ data }: { data: any }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const revenueData = data?.revenueData || [];
  const studentData = data?.studentData || [];
  const levelData = data?.levelData || [];

  if (!mounted) {
    return (
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-[360px] animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--card)]" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <ChartCard title="Revenus (XOF)" color="bg-[var(--primary)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
            <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#E7162A", fontWeight: "bold" }} />
            <Bar dataKey="total" fill="#E7162A" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Nouveaux étudiants" color="bg-indigo-500">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={studentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#6366F1", fontWeight: "bold" }} />
            <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={4} dot={{ r: 6, fill: "#6366F1" }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Répartition par niveau" color="bg-emerald-500" wide>
        <div className="flex h-full w-full items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={levelData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                {levelData.map((entry: any, index: number) => (
                  <Cell key={`cell-${entry.name || index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mr-12 hidden flex-col gap-3 sm:flex">
            {levelData.map((entry: any, index: number) => (
              <div key={entry.name} className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">{entry.name}</span>
                <span className="text-xs font-black text-[var(--foreground)]">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  color: "var(--foreground)",
};

function ChartCard({ title, color, wide = false, children }: { title: string; color: string; wide?: boolean; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--foreground)] shadow-sm ${wide ? "lg:col-span-2" : ""}`}>
      <h3 className="mb-6 flex items-center gap-2 text-lg font-black">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        {title}
      </h3>
      <div className="h-[300px] w-full">{children}</div>
    </div>
  );
}
