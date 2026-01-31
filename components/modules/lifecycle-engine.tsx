"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  FileText,
  GitBranch,
  Lightbulb,
  RefreshCw,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
  Activity,
  BookOpen,
  Briefcase,
  GraduationCap,
  Heart,
  Network,
} from "lucide-react";
import { useEmployees } from "@/lib/employee-context";
import { teams } from "@/lib/talent-data";
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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Lifecycle stages
const lifecycleStages = [
  { id: "demand", name: "Demand Forecast", icon: Target, color: "hsl(250, 80%, 60%)" },
  { id: "hiring", name: "Hiring", icon: Briefcase, color: "hsl(200, 80%, 50%)" },
  { id: "development", name: "Skill Development", icon: GraduationCap, color: "hsl(165, 70%, 45%)" },
  { id: "contribution", name: "Project Contribution", icon: Zap, color: "hsl(85, 70%, 50%)" },
  { id: "retention", name: "Retention", icon: Heart, color: "hsl(340, 70%, 55%)" },
  { id: "knowledge", name: "Knowledge Transfer", icon: BookOpen, color: "hsl(40, 80%, 55%)" },
];

// Calculate capability stability score
function calculateCapabilityStability(
  externalHiringReliance: number,
  internalGrowthRate: number,
  criticalAttritionTrend: number,
  knowledgeRedundancy: number,
  expertiseConcentration: number
): { score: number; level: string; color: string } {
  // Lower reliance on external hiring is better (invert)
  const hiringScore = 100 - externalHiringReliance;
  // Higher internal growth is better
  const growthScore = internalGrowthRate;
  // Lower attrition trend is better (invert)
  const attritionScore = 100 - criticalAttritionTrend;
  // Higher knowledge redundancy is better
  const redundancyScore = knowledgeRedundancy;
  // Lower expertise concentration is better (invert)
  const concentrationScore = 100 - expertiseConcentration;

  const score = Math.round(
    hiringScore * 0.2 +
    growthScore * 0.25 +
    attritionScore * 0.2 +
    redundancyScore * 0.2 +
    concentrationScore * 0.15
  );

  let level: string;
  let color: string;
  if (score >= 70) {
    level = "High Stability";
    color = "text-green-500";
  } else if (score >= 45) {
    level = "Moderate Stability";
    color = "text-yellow-500";
  } else {
    level = "Low Stability";
    color = "text-red-500";
  }

  return { score, level, color };
}

// Calculate knowledge continuity health
function calculateKnowledgeContinuityHealth(
  documentationCompleteness: number,
  skillBackupCoverage: number,
  knowledgeSharingFrequency: number,
  expertDependencyReduction: number
): { score: number; level: string; color: string } {
  const score = Math.round(
    documentationCompleteness * 0.25 +
    skillBackupCoverage * 0.3 +
    knowledgeSharingFrequency * 0.25 +
    expertDependencyReduction * 0.2
  );

  let level: string;
  let color: string;
  if (score >= 75) {
    level = "Excellent";
    color = "text-green-500";
  } else if (score >= 55) {
    level = "Good";
    color = "text-blue-500";
  } else if (score >= 35) {
    level = "Needs Improvement";
    color = "text-yellow-500";
  } else {
    level = "Critical";
    color = "text-red-500";
  }

  return { score, level, color };
}

// Lifecycle Flow Visualization Component
function LifecycleFlowDiagram({ bottlenecks }: { bottlenecks: string[] }) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4">
        {lifecycleStages.map((stage, index) => {
          const Icon = stage.icon;
          const isBottleneck = bottlenecks.includes(stage.id);
          return (
            <div key={stage.id} className="flex items-center">
              <div
                className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all min-w-[120px] ${
                  isBottleneck
                    ? "border-destructive bg-destructive/10"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                {isBottleneck && (
                  <div className="absolute -top-2 -right-2">
                    <Badge variant="destructive" className="text-xs px-1.5">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Bottleneck
                    </Badge>
                  </div>
                )}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${stage.color}20` }}
                >
                  <Icon className="h-6 w-6" style={{ color: stage.color }} />
                </div>
                <span className="text-xs font-medium text-center">{stage.name}</span>
              </div>
              {index < lifecycleStages.length - 1 && (
                <ArrowRight className="h-5 w-5 mx-2 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Capability Stability Score Card
function CapabilityStabilityCard({
  stability,
  factors,
}: {
  stability: { score: number; level: string; color: string };
  factors: {
    externalHiringReliance: number;
    internalGrowthRate: number;
    criticalAttritionTrend: number;
    knowledgeRedundancy: number;
    expertiseConcentration: number;
  };
}) {
  const factorItems = [
    { label: "External Hiring Reliance", value: factors.externalHiringReliance, inverted: true },
    { label: "Internal Skill Growth Rate", value: factors.internalGrowthRate, inverted: false },
    { label: "Critical-Skill Attrition Trend", value: factors.criticalAttritionTrend, inverted: true },
    { label: "Knowledge Redundancy", value: factors.knowledgeRedundancy, inverted: false },
    { label: "Expertise Concentration", value: factors.expertiseConcentration, inverted: true },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Capability Stability Score
          </CardTitle>
          <Badge variant="outline" className={stability.color}>
            {stability.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 mb-6">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${stability.score * 2.51} 251`}
                className={stability.score >= 70 ? "text-green-500" : stability.score >= 45 ? "text-yellow-500" : "text-red-500"}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{stability.score}</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            {factorItems.map((factor) => (
              <div key={factor.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{factor.label}</span>
                  <span className="font-medium">{factor.value}%</span>
                </div>
                <Progress
                  value={factor.value}
                  className="h-1.5"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Knowledge Continuity Health Card
function KnowledgeContinuityCard({
  health,
  metrics,
}: {
  health: { score: number; level: string; color: string };
  metrics: {
    documentationCompleteness: number;
    skillBackupCoverage: number;
    knowledgeSharingFrequency: number;
    expertDependencyReduction: number;
  };
}) {
  const metricItems = [
    { label: "Documentation Completeness", value: metrics.documentationCompleteness, icon: FileText },
    { label: "Skill Backup Coverage", value: metrics.skillBackupCoverage, icon: Users },
    { label: "Knowledge Sharing Frequency", value: metrics.knowledgeSharingFrequency, icon: RefreshCw },
    { label: "Expert Dependency Reduction", value: metrics.expertDependencyReduction, icon: TrendingDown },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent" />
            Knowledge Continuity Health
          </CardTitle>
          <Badge variant="outline" className={health.color}>
            {health.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 mb-4">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${health.score * 2.51} 251`}
                className={health.score >= 75 ? "text-green-500" : health.score >= 55 ? "text-blue-500" : health.score >= 35 ? "text-yellow-500" : "text-red-500"}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{health.score}</span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            {metricItems.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{metric.value}%</span>
                    <Progress value={metric.value} className="h-1.5 flex-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Cross-Module Impact Visualization
function CrossModuleImpact({ impacts }: { impacts: { source: string; target: string; effect: string; direction: "up" | "down" }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          Cross-Module Impact Engine
        </CardTitle>
        <CardDescription>Cause-effect relationships across workforce systems</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {impacts.map((impact, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border"
            >
              <Badge variant="secondary" className="min-w-[120px] justify-center">
                {impact.source}
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 flex items-center gap-2">
                <span className="text-sm">{impact.effect}</span>
                {impact.direction === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
              <Badge variant="outline" className="min-w-[100px] justify-center">
                {impact.target}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Strategic Trade-off Simulator
function TradeoffSimulator({
  settings,
  onSettingsChange,
  results,
}: {
  settings: {
    externalHiring: number;
    upskilling: number;
    knowledgeTransfer: number;
    dependencyReduction: number;
  };
  onSettingsChange: (key: string, value: number) => void;
  results: {
    costImpact: number;
    timelineImpact: number;
    sustainabilityImpact: number;
    stabilityChange: number;
  };
}) {
  const sliders = [
    { key: "externalHiring", label: "External Hiring Intensity", icon: Briefcase },
    { key: "upskilling", label: "Internal Upskilling Investment", icon: GraduationCap },
    { key: "knowledgeTransfer", label: "Knowledge Transfer Effort", icon: BookOpen },
    { key: "dependencyReduction", label: "Dependency Reduction Initiatives", icon: Shield },
  ];

  const resultItems = [
    {
      label: "Cost Impact",
      value: results.costImpact,
      suffix: "%",
      color: results.costImpact > 0 ? "text-red-500" : "text-green-500",
      icon: results.costImpact > 0 ? TrendingUp : TrendingDown,
    },
    {
      label: "Timeline Impact",
      value: results.timelineImpact,
      suffix: " weeks",
      color: results.timelineImpact > 0 ? "text-yellow-500" : "text-green-500",
      icon: results.timelineImpact > 0 ? TrendingUp : TrendingDown,
    },
    {
      label: "Sustainability Impact",
      value: results.sustainabilityImpact,
      suffix: "%",
      color: results.sustainabilityImpact > 0 ? "text-green-500" : "text-red-500",
      icon: results.sustainabilityImpact > 0 ? TrendingUp : TrendingDown,
    },
    {
      label: "Stability Change",
      value: results.stabilityChange,
      suffix: " pts",
      color: results.stabilityChange > 0 ? "text-green-500" : "text-red-500",
      icon: results.stabilityChange > 0 ? TrendingUp : TrendingDown,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          Strategic Trade-off Simulator
        </CardTitle>
        <CardDescription>Adjust parameters to see impact on workforce outcomes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h4 className="text-sm font-medium text-muted-foreground">Adjust Strategy Parameters</h4>
            {sliders.map((slider) => {
              const Icon = slider.icon;
              const value = settings[slider.key as keyof typeof settings];
              return (
                <div key={slider.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{slider.label}</span>
                    </div>
                    <span className="text-sm font-medium">{value}%</span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={([v]) => onSettingsChange(slider.key, v)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Projected Outcomes</h4>
            <div className="grid grid-cols-2 gap-3">
              {resultItems.map((result) => {
                const Icon = result.icon;
                return (
                  <div key={result.label} className="p-4 rounded-lg bg-muted/50 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">{result.label}</span>
                      <Icon className={`h-4 w-4 ${result.color}`} />
                    </div>
                    <span className={`text-xl font-bold ${result.color}`}>
                      {result.value > 0 ? "+" : ""}
                      {result.value}
                      {result.suffix}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">AI Recommendation</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {results.stabilityChange > 5
                      ? "Current settings optimize for long-term stability. Consider this as your baseline strategy."
                      : results.costImpact > 20
                      ? "High cost trajectory detected. Consider increasing upskilling investment to reduce external hiring dependency."
                      : "Balance achieved. Monitor sustainability metrics for continued optimization."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Long-term Resilience Indicator
function ResilienceIndicator({ score, trend }: { score: number; trend: number[] }) {
  const trendData = trend.map((value, index) => ({
    month: `M${index + 1}`,
    score: value,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-accent" />
          Long-term Resilience Indicator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">{score}</div>
            <div className="text-xs text-muted-foreground mt-1">Current Score</div>
          </div>
          <div className="flex-1 h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="resilienceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(250, 80%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(250, 80%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(250, 80%, 60%)"
                  fill="url(#resilienceGradient)"
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(270, 5%, 13%)",
                    borderColor: "hsl(270, 5%, 25%)",
                    borderRadius: "8px",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Export Component
export function LifecycleEngine() {
  const { employees } = useEmployees();
  
  // Trade-off simulator settings
  const [tradeoffSettings, setTradeoffSettings] = useState({
    externalHiring: 60,
    upskilling: 40,
    knowledgeTransfer: 35,
    dependencyReduction: 30,
  });

  // Calculate metrics from employee data
  const metrics = useMemo(() => {
    const totalEmployees = employees.length;
    const criticalEmployees = employees.filter((e) => e.criticality === "critical");
    const keyPersons = employees.filter((e) => e.isKeyPerson);
    const highRiskEmployees = employees.filter((e) => e.attritionRisk > 60);

    // Capability stability factors
    const externalHiringReliance = 55; // Simulated
    const internalGrowthRate = 42;
    const criticalAttritionTrend = highRiskEmployees.filter((e) => e.criticality === "critical").length / Math.max(criticalEmployees.length, 1) * 100;
    const avgTeamBackup = teams.reduce((sum, t) => sum + t.backupCoverage, 0) / teams.length;
    const knowledgeRedundancy = avgTeamBackup;
    const expertiseConcentration = (keyPersons.length / Math.max(totalEmployees, 1)) * 100;

    // Knowledge continuity metrics
    const documentationCompleteness = 62;
    const skillBackupCoverage = avgTeamBackup;
    const knowledgeSharingFrequency = 48;
    const expertDependencyReduction = 35;

    return {
      externalHiringReliance: Math.round(externalHiringReliance),
      internalGrowthRate: Math.round(internalGrowthRate),
      criticalAttritionTrend: Math.round(criticalAttritionTrend),
      knowledgeRedundancy: Math.round(knowledgeRedundancy),
      expertiseConcentration: Math.round(expertiseConcentration),
      documentationCompleteness,
      skillBackupCoverage: Math.round(skillBackupCoverage),
      knowledgeSharingFrequency,
      expertDependencyReduction,
    };
  }, [employees]);

  // Calculate stability score
  const capabilityStability = useMemo(() => {
    return calculateCapabilityStability(
      metrics.externalHiringReliance,
      metrics.internalGrowthRate,
      metrics.criticalAttritionTrend,
      metrics.knowledgeRedundancy,
      metrics.expertiseConcentration
    );
  }, [metrics]);

  // Calculate knowledge continuity health
  const knowledgeHealth = useMemo(() => {
    return calculateKnowledgeContinuityHealth(
      metrics.documentationCompleteness,
      metrics.skillBackupCoverage,
      metrics.knowledgeSharingFrequency,
      metrics.expertDependencyReduction
    );
  }, [metrics]);

  // Detect bottlenecks
  const bottlenecks = useMemo(() => {
    const result: string[] = [];
    if (metrics.externalHiringReliance > 60) result.push("hiring");
    if (metrics.internalGrowthRate < 40) result.push("development");
    if (metrics.criticalAttritionTrend > 30) result.push("retention");
    if (metrics.knowledgeRedundancy < 50) result.push("knowledge");
    return result;
  }, [metrics]);

  // Cross-module impacts
  const crossModuleImpacts = useMemo(() => {
    const impacts = [];
    
    if (tradeoffSettings.externalHiring > 50) {
      impacts.push({
        source: "High Hiring",
        target: "Cost",
        effect: "Recruitment costs increase",
        direction: "up" as const,
      });
      impacts.push({
        source: "High Hiring",
        target: "Dependency",
        effect: "External talent dependency rises",
        direction: "up" as const,
      });
    }
    
    if (tradeoffSettings.upskilling > 50) {
      impacts.push({
        source: "Upskilling",
        target: "Timeline",
        effect: "Capability development extends",
        direction: "up" as const,
      });
      impacts.push({
        source: "Upskilling",
        target: "Sustainability",
        effect: "Long-term capability improves",
        direction: "up" as const,
      });
    }
    
    if (tradeoffSettings.knowledgeTransfer > 40) {
      impacts.push({
        source: "Knowledge Transfer",
        target: "Resilience",
        effect: "Single-point-of-failure risk decreases",
        direction: "down" as const,
      });
    }
    
    if (tradeoffSettings.dependencyReduction > 40) {
      impacts.push({
        source: "Dependency Reduction",
        target: "Stability",
        effect: "Capability stability strengthens",
        direction: "up" as const,
      });
    }

    return impacts.length > 0 ? impacts : [
      { source: "Baseline", target: "All Systems", effect: "Operating at default parameters", direction: "up" as const },
    ];
  }, [tradeoffSettings]);

  // Trade-off results calculation
  const tradeoffResults = useMemo(() => {
    const costImpact = Math.round(
      (tradeoffSettings.externalHiring * 0.4) -
      (tradeoffSettings.upskilling * 0.1) -
      (tradeoffSettings.dependencyReduction * 0.05)
    );
    
    const timelineImpact = Math.round(
      (tradeoffSettings.upskilling * 0.15) +
      (tradeoffSettings.knowledgeTransfer * 0.1) -
      (tradeoffSettings.externalHiring * 0.08)
    );
    
    const sustainabilityImpact = Math.round(
      (tradeoffSettings.upskilling * 0.3) +
      (tradeoffSettings.knowledgeTransfer * 0.25) +
      (tradeoffSettings.dependencyReduction * 0.2) -
      (tradeoffSettings.externalHiring * 0.15)
    );
    
    const stabilityChange = Math.round(
      (tradeoffSettings.upskilling * 0.15) +
      (tradeoffSettings.knowledgeTransfer * 0.12) +
      (tradeoffSettings.dependencyReduction * 0.1) -
      (tradeoffSettings.externalHiring * 0.08)
    );

    return { costImpact, timelineImpact, sustainabilityImpact, stabilityChange };
  }, [tradeoffSettings]);

  // Resilience trend (simulated 12-month projection)
  const resilienceTrend = useMemo(() => {
    const baseScore = capabilityStability.score;
    const monthlyChange = tradeoffResults.stabilityChange / 12;
    return Array.from({ length: 12 }, (_, i) => 
      Math.min(100, Math.max(0, Math.round(baseScore + (monthlyChange * (i + 1)) + (Math.random() * 4 - 2))))
    );
  }, [capabilityStability.score, tradeoffResults.stabilityChange]);

  const handleTradeoffChange = (key: string, value: number) => {
    setTradeoffSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Lifecycle Flow Diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Capability Lifecycle Flow Model
          </CardTitle>
          <CardDescription>
            Track talent capability across stages - bottlenecks highlighted in red
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LifecycleFlowDiagram bottlenecks={bottlenecks} />
          {bottlenecks.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">Bottlenecks Detected</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {bottlenecks.length} stage(s) require attention: {bottlenecks.map((b) => 
                      lifecycleStages.find((s) => s.id === b)?.name
                    ).join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Score Cards Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <CapabilityStabilityCard
          stability={capabilityStability}
          factors={{
            externalHiringReliance: metrics.externalHiringReliance,
            internalGrowthRate: metrics.internalGrowthRate,
            criticalAttritionTrend: metrics.criticalAttritionTrend,
            knowledgeRedundancy: metrics.knowledgeRedundancy,
            expertiseConcentration: metrics.expertiseConcentration,
          }}
        />
        <KnowledgeContinuityCard
          health={knowledgeHealth}
          metrics={{
            documentationCompleteness: metrics.documentationCompleteness,
            skillBackupCoverage: metrics.skillBackupCoverage,
            knowledgeSharingFrequency: metrics.knowledgeSharingFrequency,
            expertDependencyReduction: metrics.expertDependencyReduction,
          }}
        />
      </div>

      {/* Cross-Module Impact */}
      <CrossModuleImpact impacts={crossModuleImpacts} />

      {/* Trade-off Simulator */}
      <TradeoffSimulator
        settings={tradeoffSettings}
        onSettingsChange={handleTradeoffChange}
        results={tradeoffResults}
      />

      {/* Resilience Indicator */}
      <ResilienceIndicator
        score={Math.round((capabilityStability.score + knowledgeHealth.score) / 2)}
        trend={resilienceTrend}
      />
    </div>
  );
}
