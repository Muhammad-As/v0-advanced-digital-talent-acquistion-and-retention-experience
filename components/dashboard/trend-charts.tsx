"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TrendChartsProps {
  trendData: {
    month: string;
    talentRisk: number;
    capability: number;
    retention: number;
  }[];
  hiringVsUpskilling: { hiring: number; upskilling: number };
}

const chartColors = {
  primary: "hsl(250, 80%, 65%)",
  secondary: "hsl(165, 60%, 45%)",
  tertiary: "hsl(85, 60%, 55%)",
  quaternary: "hsl(25, 70%, 55%)",
  muted: "hsl(270, 5%, 40%)",
};

export function TrendCharts({ trendData, hiringVsUpskilling }: TrendChartsProps) {
  const strategyData = [
    { name: "Upskilling", value: hiringVsUpskilling.upskilling, color: chartColors.secondary },
    { name: "Hiring", value: hiringVsUpskilling.hiring, color: chartColors.primary },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Critical Metrics Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 5%, 20%)" />
              <XAxis dataKey="month" stroke="hsl(270, 5%, 50%)" fontSize={12} />
              <YAxis stroke="hsl(270, 5%, 50%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(270, 5%, 13%)",
                  borderColor: "hsl(270, 5%, 25%)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(0, 0%, 95%)" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="talentRisk"
                name="Talent Risk"
                stroke={chartColors.quaternary}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="capability"
                name="Capability"
                stroke={chartColors.primary}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="retention"
                name="Retention"
                stroke={chartColors.secondary}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hiring vs Upskilling Ratio</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={strategyData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {strategyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(270, 5%, 13%)",
                  borderColor: "hsl(270, 5%, 25%)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

interface SkillGapChartProps {
  skillGaps: {
    skill: string;
    currentCapacity: number;
    requiredCapacity: number;
    gapPercentage: number;
  }[];
}

export function SkillGapChart({ skillGaps }: SkillGapChartProps) {
  const chartData = skillGaps.map((gap) => ({
    skill: gap.skill.length > 15 ? gap.skill.slice(0, 15) + "..." : gap.skill,
    current: gap.currentCapacity,
    required: gap.requiredCapacity,
    gap: gap.gapPercentage,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Critical Skill Gap Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 5%, 20%)" />
            <XAxis type="number" stroke="hsl(270, 5%, 50%)" fontSize={12} />
            <YAxis type="category" dataKey="skill" stroke="hsl(270, 5%, 50%)" fontSize={11} width={120} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(270, 5%, 13%)",
                borderColor: "hsl(270, 5%, 25%)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(0, 0%, 95%)" }}
            />
            <Legend />
            <Bar dataKey="current" name="Current Capacity" fill={chartColors.primary} radius={[0, 4, 4, 0]} />
            <Bar dataKey="required" name="Required Capacity" fill={chartColors.muted} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface CostSustainabilityChartProps {
  data: {
    strategy: string;
    cost: number;
    sustainability: number;
    risk: number;
  }[];
}

export function CostSustainabilityChart({ data }: CostSustainabilityChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cost vs Sustainability Tradeoff</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 5%, 20%)" />
            <XAxis dataKey="strategy" stroke="hsl(270, 5%, 50%)" fontSize={10} angle={-15} textAnchor="end" height={60} />
            <YAxis stroke="hsl(270, 5%, 50%)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(270, 5%, 13%)",
                borderColor: "hsl(270, 5%, 25%)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(0, 0%, 95%)" }}
              formatter={(value: number, name: string) => [
                name === "cost" ? `$${(value / 1000).toFixed(0)}K` : `${value}%`,
                name.charAt(0).toUpperCase() + name.slice(1),
              ]}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="sustainability"
              name="Sustainability"
              stroke={chartColors.secondary}
              fill={chartColors.secondary}
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="risk"
              name="Risk"
              stroke={chartColors.quaternary}
              fill={chartColors.quaternary}
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
