"use client";

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Brain,
  Clock,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "warning" | "critical" | "success";
}

function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = "default",
}: KPICardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all hover:border-primary/50",
        variant === "critical" && "border-destructive/50 bg-destructive/5",
        variant === "warning" && "border-warning/50 bg-warning/5",
        variant === "success" && "border-success/50 bg-success/5"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "rounded-lg p-2",
            variant === "default" && "bg-primary/10 text-primary",
            variant === "critical" && "bg-destructive/10 text-destructive",
            variant === "warning" && "bg-warning/10 text-warning",
            variant === "success" && "bg-success/10 text-success"
          )}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {(subtitle || trendValue) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span
                className={cn(
                  "flex items-center text-xs font-medium",
                  trend === "up" && "text-destructive",
                  trend === "down" && "text-success"
                )}
              >
                {trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : trend === "down" ? (
                  <TrendingDown className="h-3 w-3 mr-1" />
                ) : null}
                {trendValue}
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface KPIGridProps {
  metrics: {
    talentRiskIndex: number;
    capabilityReadinessScore: number;
    retentionStability: number;
    avgTimeToFill: number;
    criticalRolesOpen: number;
    atRiskEmployees: number;
    budgetUtilization: number;
  };
}

export function KPIGrid({ metrics }: KPIGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Talent Risk Index"
        value={`${metrics.talentRiskIndex}%`}
        icon={<AlertTriangle className="h-5 w-5" />}
        trend="up"
        trendValue="+5%"
        subtitle="vs last month"
        variant={
          metrics.talentRiskIndex > 70
            ? "critical"
            : metrics.talentRiskIndex > 50
              ? "warning"
              : "default"
        }
      />
      <KPICard
        title="Capability Readiness"
        value={`${metrics.capabilityReadinessScore}%`}
        icon={<Brain className="h-5 w-5" />}
        trend="down"
        trendValue="-3%"
        subtitle="vs target 80%"
        variant={
          metrics.capabilityReadinessScore < 50
            ? "critical"
            : metrics.capabilityReadinessScore < 70
              ? "warning"
              : "success"
        }
      />
      <KPICard
        title="Retention Stability"
        value={`${metrics.retentionStability}%`}
        icon={<Shield className="h-5 w-5" />}
        trend="down"
        trendValue="-2%"
        subtitle="6-month trend"
        variant={
          metrics.retentionStability > 75
            ? "success"
            : metrics.retentionStability > 60
              ? "warning"
              : "critical"
        }
      />
      <KPICard
        title="Avg Time to Fill"
        value={`${metrics.avgTimeToFill}w`}
        icon={<Clock className="h-5 w-5" />}
        subtitle="for critical roles"
        variant={
          metrics.avgTimeToFill > 16
            ? "critical"
            : metrics.avgTimeToFill > 10
              ? "warning"
              : "default"
        }
      />
      <KPICard
        title="Critical Roles Open"
        value={metrics.criticalRolesOpen}
        icon={<Users className="h-5 w-5" />}
        subtitle="requiring immediate action"
        variant={metrics.criticalRolesOpen > 5 ? "warning" : "default"}
      />
      <KPICard
        title="At-Risk Employees"
        value={metrics.atRiskEmployees}
        icon={<AlertTriangle className="h-5 w-5" />}
        subtitle="key personnel"
        variant={metrics.atRiskEmployees > 3 ? "critical" : "warning"}
      />
      <KPICard
        title="Budget Utilization"
        value={`${metrics.budgetUtilization}%`}
        icon={<Wallet className="h-5 w-5" />}
        subtitle="of talent investment"
        variant="default"
      />
      <KPICard
        title="Skill Gap Coverage"
        value="62%"
        icon={<Brain className="h-5 w-5" />}
        trend="up"
        trendValue="+8%"
        subtitle="improvement"
        variant="success"
      />
    </div>
  );
}
