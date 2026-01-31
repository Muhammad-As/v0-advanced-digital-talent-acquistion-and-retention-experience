"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  Calculator,
  CheckCircle2,
  Clock,
  DollarSign,
  Info,
  Lightbulb,
  Play,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
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

// ============================================================
// FEATURE 1: Hiring Capacity Simulator
// ============================================================

interface HiringCapacityInputs {
  totalRolesRequired: number;
  rolesPerRecruiter: number;
  offerDeclineRate: number;
}

interface HiringCapacityResult {
  effectiveHiresPerRecruiter: number;
  requiredRecruiters: number;
  riskLevel: "Low" | "Medium" | "High";
  bufferRecommendation: number;
  insights: string[];
}

function calculateHiringCapacity(inputs: HiringCapacityInputs): HiringCapacityResult {
  // Core formula: effective_successful_hires = recruiter_close_rate × (1 − offer_decline_rate)
  const effectiveHiresPerRecruiter = inputs.rolesPerRecruiter * (1 - inputs.offerDeclineRate / 100);
  
  // Required recruiters = total_roles_required ÷ effective_successful_hires (rounded up)
  const requiredRecruiters = Math.ceil(inputs.totalRolesRequired / effectiveHiresPerRecruiter);
  
  // Calculate risk level based on decline rate and ratio
  let riskLevel: "Low" | "Medium" | "High" = "Low";
  if (inputs.offerDeclineRate >= 40 || requiredRecruiters > inputs.totalRolesRequired / 3) {
    riskLevel = "High";
  } else if (inputs.offerDeclineRate >= 25 || requiredRecruiters > inputs.totalRolesRequired / 5) {
    riskLevel = "Medium";
  }
  
  // Buffer recommendation (10-30% based on risk)
  const bufferMultiplier = riskLevel === "High" ? 0.3 : riskLevel === "Medium" ? 0.2 : 0.1;
  const bufferRecommendation = Math.ceil(requiredRecruiters * bufferMultiplier);
  
  // Generate insights
  const insights: string[] = [];
  
  if (inputs.offerDeclineRate > 30) {
    insights.push(`High offer decline rate (${inputs.offerDeclineRate}%) inflates recruiter demand by ${Math.round((1 / (1 - inputs.offerDeclineRate / 100) - 1) * 100)}%. Consider improving offer competitiveness or employer branding.`);
  }
  
  if (requiredRecruiters < inputs.totalRolesRequired / inputs.rolesPerRecruiter) {
    insights.push("Your current recruiter capacity appears sufficient. Focus on quality over speed.");
  } else {
    const shortfall = requiredRecruiters - Math.floor(inputs.totalRolesRequired / inputs.rolesPerRecruiter);
    insights.push(`You need ${shortfall} additional recruiter(s) to compensate for offer declines. Understaffing will lead to missed hiring targets or burnout.`);
  }
  
  const costPerRecruiter = 85000; // Average loaded cost
  const additionalCost = bufferRecommendation * costPerRecruiter;
  insights.push(`Adding ${bufferRecommendation} buffer recruiters costs approximately $${(additionalCost / 1000).toFixed(0)}K but prevents ${Math.round(bufferRecommendation * effectiveHiresPerRecruiter)} potential unfilled roles.`);
  
  return {
    effectiveHiresPerRecruiter,
    requiredRecruiters,
    riskLevel,
    bufferRecommendation,
    insights,
  };
}

function HiringCapacitySimulator() {
  const [inputs, setInputs] = useState<HiringCapacityInputs>({
    totalRolesRequired: 50,
    rolesPerRecruiter: 8,
    offerDeclineRate: 25,
  });
  const [hasRun, setHasRun] = useState(false);
  
  const result = useMemo(() => calculateHiringCapacity(inputs), [inputs]);
  
  // Chart data for capacity vs demand
  const capacityChartData = useMemo(() => {
    const baseRecruiters = Math.ceil(inputs.totalRolesRequired / inputs.rolesPerRecruiter);
    return [
      {
        name: "Without Decline Adj.",
        recruiters: baseRecruiters,
        capacity: baseRecruiters * inputs.rolesPerRecruiter,
        actual: inputs.totalRolesRequired,
      },
      {
        name: "With Decline Adj.",
        recruiters: result.requiredRecruiters,
        capacity: Math.round(result.requiredRecruiters * result.effectiveHiresPerRecruiter),
        actual: inputs.totalRolesRequired,
      },
      {
        name: "With Buffer",
        recruiters: result.requiredRecruiters + result.bufferRecommendation,
        capacity: Math.round((result.requiredRecruiters + result.bufferRecommendation) * result.effectiveHiresPerRecruiter),
        actual: inputs.totalRolesRequired,
      },
    ];
  }, [inputs, result]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Input Parameters
            </CardTitle>
            <CardDescription>Configure your hiring scenario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  Total Roles Required (Quarterly)
                </Label>
              </div>
              <Input
                type="number"
                value={inputs.totalRolesRequired}
                onChange={(e) => {
                  setInputs({ ...inputs, totalRolesRequired: Math.max(1, parseInt(e.target.value) || 1) });
                  setHasRun(true);
                }}
                min={1}
                max={500}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Roles Closed per Recruiter/Quarter
                </Label>
                <span className="text-sm font-medium">{inputs.rolesPerRecruiter}</span>
              </div>
              <Slider
                value={[inputs.rolesPerRecruiter]}
                onValueChange={([value]) => {
                  setInputs({ ...inputs, rolesPerRecruiter: value });
                  setHasRun(true);
                }}
                min={1}
                max={20}
                step={1}
              />
              <p className="text-xs text-muted-foreground">Industry average: 6-10 roles/quarter</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  Offer Decline Rate
                </Label>
                <span className="text-sm font-medium">{inputs.offerDeclineRate}%</span>
              </div>
              <Slider
                value={[inputs.offerDeclineRate]}
                onValueChange={([value]) => {
                  setInputs({ ...inputs, offerDeclineRate: value });
                  setHasRun(true);
                }}
                min={0}
                max={60}
                step={5}
              />
              <p className="text-xs text-muted-foreground">Market average: 15-30%</p>
            </div>

            <Button 
              className="w-full" 
              onClick={() => setHasRun(true)}
            >
              <Play className="h-4 w-4 mr-2" />
              Calculate Capacity
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Capacity Analysis Results
            </CardTitle>
            <CardDescription>Recruiter requirements and risk assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 rounded-lg bg-muted/30 border">
                <p className="text-sm text-muted-foreground mb-1">Effective Hires/Recruiter</p>
                <p className="text-2xl font-bold">{result.effectiveHiresPerRecruiter.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  down from {inputs.rolesPerRecruiter}
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-sm text-muted-foreground mb-1">Recruiters Required</p>
                <p className="text-2xl font-bold text-primary">{result.requiredRecruiters}</p>
                <p className="text-xs text-muted-foreground mt-1">minimum needed</p>
              </div>
              
              <div className={cn(
                "p-4 rounded-lg border",
                result.riskLevel === "High" && "bg-destructive/10 border-destructive/30",
                result.riskLevel === "Medium" && "bg-warning/10 border-warning/30",
                result.riskLevel === "Low" && "bg-success/10 border-success/30"
              )}>
                <p className="text-sm text-muted-foreground mb-1">Capacity Risk Level</p>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    result.riskLevel === "High" ? "destructive" : 
                    result.riskLevel === "Medium" ? "secondary" : "default"
                  }>
                    {result.riskLevel}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                <p className="text-sm text-muted-foreground mb-1">Buffer Recommendation</p>
                <p className="text-2xl font-bold text-accent">+{result.bufferRecommendation}</p>
                <p className="text-xs text-muted-foreground mt-1">additional recruiters</p>
              </div>
            </div>

            {/* Chart */}
            <div>
              <h4 className="text-sm font-medium mb-4">Capacity vs Demand Analysis</h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={capacityChartData} barGap={0}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 5%, 20%)" />
                  <XAxis dataKey="name" stroke="hsl(270, 5%, 50%)" fontSize={11} />
                  <YAxis stroke="hsl(270, 5%, 50%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(270, 5%, 13%)",
                      borderColor: "hsl(270, 5%, 25%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="recruiters" name="Recruiters" fill="hsl(250, 80%, 65%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="capacity" name="Expected Hires" fill="hsl(165, 60%, 45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" name="Target Roles" fill="hsl(85, 60%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insight Engine */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Insight Engine
          </CardTitle>
          <CardDescription>Strategic analysis and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.insights.map((insight, index) => (
              <div key={index} className="flex gap-3 p-4 rounded-lg bg-muted/30 border">
                <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm">{insight}</p>
              </div>
            ))}
            
            <div className="flex gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm space-y-2">
                <p className="font-medium">Understanding the Formula:</p>
                <p className="text-muted-foreground">
                  <strong>Effective Hires per Recruiter</strong> = Roles Closed × (1 - Offer Decline Rate)
                </p>
                <p className="text-muted-foreground">
                  = {inputs.rolesPerRecruiter} × (1 - {inputs.offerDeclineRate/100}) = <strong>{result.effectiveHiresPerRecruiter.toFixed(2)}</strong>
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong>Required Recruiters</strong> = Total Roles ÷ Effective Hires (rounded up)
                </p>
                <p className="text-muted-foreground">
                  = {inputs.totalRolesRequired} ÷ {result.effectiveHiresPerRecruiter.toFixed(2)} = <strong>{result.requiredRecruiters}</strong>
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mt-4">
              <div className="p-4 rounded-lg border bg-destructive/5 border-destructive/20">
                <h4 className="font-medium text-destructive flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  If Understaffed
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>Recruiter burnout and turnover</li>
                  <li>Lower quality hires due to rushed process</li>
                  <li>Missed quarterly targets</li>
                  <li>Delayed project timelines</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border bg-warning/5 border-warning/20">
                <h4 className="font-medium text-warning flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4" />
                  Cost Trade-off
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>Each unfilled role costs ~$50K/quarter in lost productivity</li>
                  <li>Buffer recruiters cost ~$85K/year each</li>
                  <li>ROI positive if they fill 2+ extra roles</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border bg-success/5 border-success/20">
                <h4 className="font-medium text-success flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Optimal Strategy
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>Staff to {result.requiredRecruiters + result.bufferRecommendation} recruiters</li>
                  <li>Reduce decline rate via better offers</li>
                  <li>Improve recruiter efficiency with AI tools</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// FEATURE 2: Time-to-Hire Inflation Simulator
// ============================================================

interface TimeToHireInputs {
  baseTimeToHire: number;
  competitionIncrease: number;
  affectedRolesPercent: number;
}

interface TimeToHireResult {
  adjustedTimeAffected: number;
  effectiveAverageTime: number;
  delayDays: number;
  riskLevel: "Low" | "Medium" | "High";
  suggestedStrategy: string[];
  insights: string[];
}

function calculateTimeToHire(inputs: TimeToHireInputs): TimeToHireResult {
  // Adjusted time for affected roles = base_time × (1 + competition_increase)
  const adjustedTimeAffected = inputs.baseTimeToHire * (1 + inputs.competitionIncrease / 100);
  
  // Effective average time-to-hire = (affected_roles% × adjusted_time) + (unaffected_roles% × base_time)
  const effectiveAverageTime = 
    (inputs.affectedRolesPercent / 100) * adjustedTimeAffected +
    (1 - inputs.affectedRolesPercent / 100) * inputs.baseTimeToHire;
  
  const delayDays = effectiveAverageTime - inputs.baseTimeToHire;
  
  // Risk level
  let riskLevel: "Low" | "Medium" | "High" = "Low";
  if (delayDays > 15 || effectiveAverageTime > 60) {
    riskLevel = "High";
  } else if (delayDays > 7 || effectiveAverageTime > 45) {
    riskLevel = "Medium";
  }
  
  // Suggested strategies based on delay
  const suggestedStrategy: string[] = [];
  if (delayDays > 10) {
    suggestedStrategy.push("Accelerate hiring by expanding sourcing channels");
    suggestedStrategy.push("Use contractors to bridge immediate gaps");
  }
  if (inputs.competitionIncrease > 30) {
    suggestedStrategy.push("Improve offer competitiveness to reduce negotiation time");
  }
  if (inputs.affectedRolesPercent > 50) {
    suggestedStrategy.push("Shift focus to internal upskilling for less competitive roles");
  }
  if (suggestedStrategy.length === 0) {
    suggestedStrategy.push("Current timeline is manageable with standard processes");
  }
  
  // Insights
  const insights: string[] = [];
  
  if (inputs.competitionIncrease > 0) {
    insights.push(`Ignoring competition leads to underestimating timelines by ${Math.round(delayDays)} days on average. This compounds across multiple hires, causing significant project delays.`);
  }
  
  const quarterlyImpact = Math.round((delayDays / 90) * 100);
  insights.push(`A ${Math.round(delayDays)}-day delay per hire reduces quarterly hiring capacity by approximately ${quarterlyImpact}%. Plan workforce needs 1-2 quarters ahead to compensate.`);
  
  if (effectiveAverageTime > 45) {
    insights.push(`Extended time-to-hire (${Math.round(effectiveAverageTime)} days) increases candidate dropout risk by 40%. Consider parallel interviewing and faster decision-making.`);
  }
  
  return {
    adjustedTimeAffected,
    effectiveAverageTime,
    delayDays,
    riskLevel,
    suggestedStrategy,
    insights,
  };
}

function TimeToHireSimulator() {
  const [inputs, setInputs] = useState<TimeToHireInputs>({
    baseTimeToHire: 35,
    competitionIncrease: 40,
    affectedRolesPercent: 60,
  });
  
  const result = useMemo(() => calculateTimeToHire(inputs), [inputs]);
  
  // Timeline inflation chart data
  const timelineChartData = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 100; i += 10) {
      const affected = inputs.baseTimeToHire * (1 + inputs.competitionIncrease / 100);
      const effective = (i / 100) * affected + (1 - i / 100) * inputs.baseTimeToHire;
      points.push({
        affected: i,
        baseline: inputs.baseTimeToHire,
        effective: Math.round(effective),
        label: `${i}%`,
      });
    }
    return points;
  }, [inputs]);

  // Workforce readiness delay meter data
  const readinessData = useMemo(() => {
    return [
      { name: "Baseline Plan", days: inputs.baseTimeToHire, fill: "hsl(165, 60%, 45%)" },
      { name: "Effective Reality", days: Math.round(result.effectiveAverageTime), fill: "hsl(250, 80%, 65%)" },
      { name: "Competitive Roles", days: Math.round(result.adjustedTimeAffected), fill: "hsl(25, 80%, 55%)" },
    ];
  }, [inputs, result]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Input Parameters
            </CardTitle>
            <CardDescription>Configure market competition factors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Base Time-to-Hire (days)
                </Label>
                <span className="text-sm font-medium">{inputs.baseTimeToHire}</span>
              </div>
              <Slider
                value={[inputs.baseTimeToHire]}
                onValueChange={([value]) => setInputs({ ...inputs, baseTimeToHire: value })}
                min={14}
                max={90}
                step={1}
              />
              <p className="text-xs text-muted-foreground">Industry average: 30-45 days</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  Competition Increase
                </Label>
                <span className="text-sm font-medium">+{inputs.competitionIncrease}%</span>
              </div>
              <Slider
                value={[inputs.competitionIncrease]}
                onValueChange={([value]) => setInputs({ ...inputs, competitionIncrease: value })}
                min={0}
                max={100}
                step={5}
              />
              <p className="text-xs text-muted-foreground">How much longer competitive roles take</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  Roles Affected by Competition
                </Label>
                <span className="text-sm font-medium">{inputs.affectedRolesPercent}%</span>
              </div>
              <Slider
                value={[inputs.affectedRolesPercent]}
                onValueChange={([value]) => setInputs({ ...inputs, affectedRolesPercent: value })}
                min={0}
                max={100}
                step={5}
              />
              <p className="text-xs text-muted-foreground">Percentage of roles in competitive markets</p>
            </div>

            <div className="pt-4 border-t">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="text-sm font-medium mb-2">Formula Breakdown</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Adjusted Time = {inputs.baseTimeToHire} × (1 + {inputs.competitionIncrease/100})</p>
                  <p>= <strong>{result.adjustedTimeAffected.toFixed(1)} days</strong></p>
                  <p className="mt-2">Effective Avg = ({inputs.affectedRolesPercent}% × {result.adjustedTimeAffected.toFixed(1)}) + ({100-inputs.affectedRolesPercent}% × {inputs.baseTimeToHire})</p>
                  <p>= <strong>{result.effectiveAverageTime.toFixed(1)} days</strong></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Timeline Analysis Results
            </CardTitle>
            <CardDescription>Adjusted hiring timelines and delivery risk</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 rounded-lg bg-muted/30 border">
                <p className="text-sm text-muted-foreground mb-1">Base Timeline</p>
                <p className="text-2xl font-bold">{inputs.baseTimeToHire}</p>
                <p className="text-xs text-muted-foreground mt-1">days (original)</p>
              </div>
              
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-sm text-muted-foreground mb-1">Effective Timeline</p>
                <p className="text-2xl font-bold text-primary">{Math.round(result.effectiveAverageTime)}</p>
                <p className="text-xs text-muted-foreground mt-1">days (adjusted)</p>
              </div>
              
              <div className={cn(
                "p-4 rounded-lg border",
                result.riskLevel === "High" && "bg-destructive/10 border-destructive/30",
                result.riskLevel === "Medium" && "bg-warning/10 border-warning/30",
                result.riskLevel === "Low" && "bg-success/10 border-success/30"
              )}>
                <p className="text-sm text-muted-foreground mb-1">Delivery Risk</p>
                <Badge variant={
                  result.riskLevel === "High" ? "destructive" : 
                  result.riskLevel === "Medium" ? "secondary" : "default"
                }>
                  {result.riskLevel}
                </Badge>
              </div>
              
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                <p className="text-sm text-muted-foreground mb-1">Timeline Inflation</p>
                <p className="text-2xl font-bold text-warning">+{Math.round(result.delayDays)}</p>
                <p className="text-xs text-muted-foreground mt-1">days per hire</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium mb-4">Timeline Inflation by Competition %</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={timelineChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 5%, 20%)" />
                    <XAxis dataKey="label" stroke="hsl(270, 5%, 50%)" fontSize={11} />
                    <YAxis stroke="hsl(270, 5%, 50%)" fontSize={12} domain={[0, 'auto']} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(270, 5%, 13%)",
                        borderColor: "hsl(270, 5%, 25%)",
                        borderRadius: "8px",
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="baseline" 
                      name="Baseline" 
                      stroke="hsl(165, 60%, 45%)" 
                      strokeDasharray="5 5"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="effective" 
                      name="Effective Time" 
                      stroke="hsl(250, 80%, 65%)" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-4">Workforce Readiness Delay</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={readinessData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 5%, 20%)" />
                    <XAxis type="number" stroke="hsl(270, 5%, 50%)" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="hsl(270, 5%, 50%)" fontSize={11} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(270, 5%, 13%)",
                        borderColor: "hsl(270, 5%, 25%)",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value} days`, "Timeline"]}
                    />
                    <Bar dataKey="days" radius={[0, 4, 4, 0]}>
                      {readinessData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggested Strategies and Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Suggested Strategies
            </CardTitle>
            <CardDescription>Recommended actions to mitigate delays</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.suggestedStrategy.map((strategy, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <p className="text-sm">{strategy}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 rounded-lg bg-accent/5 border border-accent/20">
              <h4 className="font-medium text-accent flex items-center gap-2 mb-2">
                <ArrowRight className="h-4 w-4" />
                Quick Mitigation Options
              </h4>
              <div className="grid gap-2 md:grid-cols-3 text-sm">
                <div className="p-2 rounded bg-muted/30 text-center">
                  <p className="font-medium">Accelerate</p>
                  <p className="text-xs text-muted-foreground">More recruiters</p>
                </div>
                <div className="p-2 rounded bg-muted/30 text-center">
                  <p className="font-medium">Bridge</p>
                  <p className="text-xs text-muted-foreground">Use contractors</p>
                </div>
                <div className="p-2 rounded bg-muted/30 text-center">
                  <p className="font-medium">Build</p>
                  <p className="text-xs text-muted-foreground">Internal upskilling</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Insight Engine
            </CardTitle>
            <CardDescription>Long-term planning implications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.insights.map((insight, index) => (
                <div key={index} className="flex gap-3 p-4 rounded-lg bg-muted/30 border">
                  <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{insight}</p>
                </div>
              ))}
              
              <div className="flex gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-destructive mb-1">Planning Blindspot Warning</p>
                  <p className="text-muted-foreground">
                    Organizations that ignore market competition in workforce planning consistently underestimate 
                    timelines by 20-40%. This leads to understaffed teams, delayed projects, and reactive 
                    (expensive) hiring decisions.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// Main Export: Scenario Simulation Lab
// ============================================================

export function SimulationLab() {
  return (
    <Tabs defaultValue="capacity" className="space-y-6">
      <TabsList className="bg-muted/50 p-1">
        <TabsTrigger value="capacity" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Hiring Capacity Simulator
        </TabsTrigger>
        <TabsTrigger value="timeline" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Time-to-Hire Inflation Simulator
        </TabsTrigger>
      </TabsList>

      <TabsContent value="capacity">
        <HiringCapacitySimulator />
      </TabsContent>

      <TabsContent value="timeline">
        <TimeToHireSimulator />
      </TabsContent>
    </Tabs>
  );
}
