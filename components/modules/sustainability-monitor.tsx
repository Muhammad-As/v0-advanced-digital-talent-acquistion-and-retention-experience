"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  GitBranch,
  Lightbulb,
  Network,
  RefreshCw,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
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

// Types
interface RiskAlert {
  id: string;
  type: "knowledge_loss" | "single_expert" | "burnout" | "post_project_exit" | "skill_concentration";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  affectedTeams: string[];
  trend: "increasing" | "stable" | "decreasing";
  detectedAt: string;
}

interface Intervention {
  id: string;
  riskType: string;
  recommendation: string;
  impact: string;
  timeline: string;
  effort: "low" | "medium" | "high";
  resilienceGain: number;
  status: "pending" | "in_progress" | "completed";
}

interface SkillNode {
  id: string;
  name: string;
  experts: number;
  dependentProjects: number;
  riskLevel: number;
}

interface SkillLink {
  source: string;
  target: string;
  strength: number;
}

// Mock Data
const attritionAlerts: RiskAlert[] = [
  {
    id: "1",
    type: "knowledge_loss",
    severity: "critical",
    title: "Critical Knowledge Gap in ML Pipeline",
    description: "Senior ML Engineer departure creates 73% knowledge concentration risk in recommendation systems",
    affectedTeams: ["AI/ML Team", "Data Engineering"],
    trend: "increasing",
    detectedAt: "2 days ago",
  },
  {
    id: "2",
    type: "single_expert",
    severity: "high",
    title: "Single-Point Expert Dependency",
    description: "Only one engineer understands the payment gateway integration architecture",
    affectedTeams: ["Platform Team"],
    trend: "stable",
    detectedAt: "1 week ago",
  },
  {
    id: "3",
    type: "burnout",
    severity: "high",
    title: "Post-Delivery Burnout Pattern",
    description: "3 team members showing burnout indicators after Q4 release cycle",
    affectedTeams: ["Frontend Team", "QA Team"],
    trend: "increasing",
    detectedAt: "5 days ago",
  },
  {
    id: "4",
    type: "post_project_exit",
    severity: "medium",
    title: "Post-Project Exit Risk",
    description: "Historical pattern shows 40% exit rate within 3 months after major deliveries",
    affectedTeams: ["Mobile Team"],
    trend: "stable",
    detectedAt: "2 weeks ago",
  },
  {
    id: "5",
    type: "skill_concentration",
    severity: "medium",
    title: "Kubernetes Expertise Concentration",
    description: "DevOps capabilities concentrated in 2 individuals across 12 dependent services",
    affectedTeams: ["DevOps", "Infrastructure"],
    trend: "decreasing",
    detectedAt: "3 days ago",
  },
];

const interventionRecommendations: Intervention[] = [
  {
    id: "1",
    riskType: "Knowledge Loss",
    recommendation: "Mandatory Knowledge Transfer Cycles",
    impact: "Establish 2-week knowledge transfer sprints where departing experts document and train 2+ team members on critical systems",
    timeline: "4-6 weeks",
    effort: "medium",
    resilienceGain: 45,
    status: "pending",
  },
  {
    id: "2",
    riskType: "Single-Point Experts",
    recommendation: "Cross-Training Program",
    impact: "Implement pair programming rotations and shadow sessions to distribute specialized knowledge across 3+ engineers per critical system",
    timeline: "8-12 weeks",
    effort: "medium",
    resilienceGain: 62,
    status: "in_progress",
  },
  {
    id: "3",
    riskType: "Burnout After Delivery",
    recommendation: "Rotational Innovation Model",
    impact: "Create post-delivery innovation sprints allowing burned-out team members to work on passion projects for 2 weeks",
    timeline: "Immediate",
    effort: "low",
    resilienceGain: 38,
    status: "pending",
  },
  {
    id: "4",
    riskType: "High Post-Project Exits",
    recommendation: "Growth-Role Pathways",
    impact: "Define clear career advancement tracks with milestone-based promotions tied to project completions rather than tenure",
    timeline: "6-8 weeks",
    effort: "high",
    resilienceGain: 55,
    status: "pending",
  },
  {
    id: "5",
    riskType: "Critical Skill Concentration",
    recommendation: "Capability Distribution Strategy",
    impact: "Establish skill guilds with mandatory cross-team participation and certification requirements for critical technologies",
    timeline: "12-16 weeks",
    effort: "high",
    resilienceGain: 71,
    status: "in_progress",
  },
];

const fragilityHeatmapData = [
  { team: "AI/ML", knowledge: 78, documentation: 35, backup: 25, overall: 72 },
  { team: "Platform", knowledge: 65, documentation: 45, backup: 40, overall: 58 },
  { team: "Frontend", knowledge: 42, documentation: 68, backup: 72, overall: 38 },
  { team: "DevOps", knowledge: 71, documentation: 52, backup: 30, overall: 65 },
  { team: "Mobile", knowledge: 55, documentation: 40, backup: 55, overall: 48 },
  { team: "Data Eng", knowledge: 68, documentation: 38, backup: 35, overall: 62 },
];

const postDeliveryExitTrend = [
  { month: "Jan", exits: 2, deliveries: 3, exitRate: 15 },
  { month: "Feb", exits: 1, deliveries: 2, exitRate: 12 },
  { month: "Mar", exits: 4, deliveries: 5, exitRate: 28 },
  { month: "Apr", exits: 3, deliveries: 4, exitRate: 22 },
  { month: "May", exits: 5, deliveries: 6, exitRate: 35 },
  { month: "Jun", exits: 2, deliveries: 3, exitRate: 18 },
  { month: "Jul", exits: 6, deliveries: 7, exitRate: 42 },
  { month: "Aug", exits: 4, deliveries: 5, exitRate: 32 },
  { month: "Sep", exits: 3, deliveries: 4, exitRate: 25 },
  { month: "Oct", exits: 5, deliveries: 6, exitRate: 38 },
  { month: "Nov", exits: 7, deliveries: 8, exitRate: 45 },
  { month: "Dec", exits: 4, deliveries: 5, exitRate: 30 },
];

const skillDependencyData: { nodes: SkillNode[]; links: SkillLink[] } = {
  nodes: [
    { id: "kubernetes", name: "Kubernetes", experts: 2, dependentProjects: 12, riskLevel: 85 },
    { id: "ml-pipeline", name: "ML Pipeline", experts: 1, dependentProjects: 8, riskLevel: 92 },
    { id: "payment", name: "Payment Gateway", experts: 1, dependentProjects: 15, riskLevel: 95 },
    { id: "react", name: "React/Frontend", experts: 8, dependentProjects: 20, riskLevel: 25 },
    { id: "postgres", name: "PostgreSQL", experts: 4, dependentProjects: 18, riskLevel: 45 },
    { id: "redis", name: "Redis/Caching", experts: 3, dependentProjects: 10, riskLevel: 55 },
    { id: "graphql", name: "GraphQL API", experts: 5, dependentProjects: 14, riskLevel: 38 },
    { id: "terraform", name: "Terraform/IaC", experts: 2, dependentProjects: 9, riskLevel: 78 },
  ],
  links: [
    { source: "kubernetes", target: "terraform", strength: 0.8 },
    { source: "ml-pipeline", target: "kubernetes", strength: 0.7 },
    { source: "ml-pipeline", target: "postgres", strength: 0.6 },
    { source: "payment", target: "postgres", strength: 0.9 },
    { source: "payment", target: "redis", strength: 0.7 },
    { source: "graphql", target: "postgres", strength: 0.8 },
    { source: "graphql", target: "redis", strength: 0.5 },
    { source: "react", target: "graphql", strength: 0.9 },
  ],
};

const resilienceProjection = [
  { month: "Now", current: 45, withInterventions: 45 },
  { month: "M+1", current: 43, withInterventions: 52 },
  { month: "M+2", current: 41, withInterventions: 58 },
  { month: "M+3", current: 40, withInterventions: 65 },
  { month: "M+4", current: 38, withInterventions: 71 },
  { month: "M+5", current: 36, withInterventions: 76 },
  { month: "M+6", current: 35, withInterventions: 82 },
];

// Helper functions
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "high":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "low":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getEffortColor = (effort: string) => {
  switch (effort) {
    case "low":
      return "text-green-400";
    case "medium":
      return "text-yellow-400";
    case "high":
      return "text-orange-400";
    default:
      return "text-muted-foreground";
  }
};

const getRiskIcon = (type: string) => {
  switch (type) {
    case "knowledge_loss":
      return <Brain className="h-4 w-4" />;
    case "single_expert":
      return <Users className="h-4 w-4" />;
    case "burnout":
      return <Zap className="h-4 w-4" />;
    case "post_project_exit":
      return <TrendingDown className="h-4 w-4" />;
    case "skill_concentration":
      return <Network className="h-4 w-4" />;
    default:
      return <AlertTriangle className="h-4 w-4" />;
  }
};

const getFragilityColor = (value: number) => {
  if (value >= 70) return "hsl(0, 70%, 50%)";
  if (value >= 50) return "hsl(30, 70%, 50%)";
  if (value >= 30) return "hsl(45, 70%, 50%)";
  return "hsl(150, 70%, 40%)";
};

export function SustainabilityMonitor() {
  const [selectedAlert, setSelectedAlert] = useState<RiskAlert | null>(null);
  const [activeSubTab, setActiveSubTab] = useState("alerts");

  const criticalAlerts = attritionAlerts.filter((a) => a.severity === "critical" || a.severity === "high").length;
  const pendingInterventions = interventionRecommendations.filter((i) => i.status === "pending").length;
  const avgResilienceGain =
    interventionRecommendations.reduce((sum, i) => sum + i.resilienceGain, 0) / interventionRecommendations.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Risk Alerts</p>
                <p className="text-2xl font-bold text-foreground">{attritionAlerts.length}</p>
                <p className="text-xs text-red-400">{criticalAlerts} critical/high</p>
              </div>
              <div className="rounded-full bg-red-500/20 p-3">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Interventions</p>
                <p className="text-2xl font-bold text-foreground">{pendingInterventions}</p>
                <p className="text-xs text-yellow-400">Awaiting implementation</p>
              </div>
              <div className="rounded-full bg-yellow-500/20 p-3">
                <Lightbulb className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Resilience Gain</p>
                <p className="text-2xl font-bold text-foreground">+{avgResilienceGain.toFixed(0)}%</p>
                <p className="text-xs text-green-400">If interventions applied</p>
              </div>
              <div className="rounded-full bg-green-500/20 p-3">
                <Shield className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Knowledge Continuity</p>
                <p className="text-2xl font-bold text-foreground">45%</p>
                <p className="text-xs text-orange-400">Below target (70%)</p>
              </div>
              <div className="rounded-full bg-orange-500/20 p-3">
                <RefreshCw className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-4 bg-secondary">
          <TabsTrigger value="alerts">Attrition Alerts</TabsTrigger>
          <TabsTrigger value="heatmap">Fragility Heatmap</TabsTrigger>
          <TabsTrigger value="network">Skill Network</TabsTrigger>
          <TabsTrigger value="trends">Exit Trends</TabsTrigger>
        </TabsList>

        {/* Attrition Pattern Alerts */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Alerts List */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  Risk Alerts
                </CardTitle>
                <CardDescription>AI-detected sustainability risks requiring structural intervention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {attritionAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary/50 ${
                      selectedAlert?.id === alert.id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => setSelectedAlert(alert)}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedAlert(alert)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-muted p-2">{getRiskIcon(alert.type)}</div>
                        <div>
                          <p className="font-medium text-foreground">{alert.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {alert.affectedTeams.map((team) => (
                              <Badge key={team} variant="outline" className="text-xs">
                                {team}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {alert.trend === "increasing" ? (
                            <TrendingUp className="h-3 w-3 text-red-400" />
                          ) : alert.trend === "decreasing" ? (
                            <TrendingDown className="h-3 w-3 text-green-400" />
                          ) : (
                            <ArrowRight className="h-3 w-3" />
                          )}
                          {alert.detectedAt}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Intervention Recommendations */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Brain className="h-5 w-5 text-primary" />
                  Systemic Intervention Engine
                </CardTitle>
                <CardDescription>
                  AI-recommended structural fixes for long-term resilience (not salary-based)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {interventionRecommendations.map((intervention) => (
                  <div key={intervention.id} className="rounded-lg border border-border bg-secondary/30 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {intervention.riskType}
                          </Badge>
                          {intervention.status === "in_progress" && (
                            <Badge className="bg-blue-500/20 text-blue-400">In Progress</Badge>
                          )}
                        </div>
                        <p className="mt-2 font-semibold text-foreground">{intervention.recommendation}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{intervention.impact}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border pt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Timeline</p>
                        <p className="text-sm font-medium text-foreground">{intervention.timeline}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Effort</p>
                        <p className={`text-sm font-medium capitalize ${getEffortColor(intervention.effort)}`}>
                          {intervention.effort}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Resilience Gain</p>
                        <p className="text-sm font-medium text-green-400">+{intervention.resilienceGain}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Resilience Projection */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Target className="h-5 w-5 text-green-400" />
                Resilience Projection: Interventions vs Status Quo
              </CardTitle>
              <CardDescription>
                Projected organizational resilience with and without structural interventions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={resilienceProjection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 5%, 20%)" />
                  <XAxis dataKey="month" stroke="hsl(270, 5%, 50%)" fontSize={12} />
                  <YAxis stroke="hsl(270, 5%, 50%)" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(270, 5%, 13%)",
                      borderColor: "hsl(270, 5%, 25%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="current"
                    name="Without Interventions"
                    stroke="hsl(0, 70%, 50%)"
                    fill="hsl(0, 70%, 50%)"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="withInterventions"
                    name="With Interventions"
                    stroke="hsl(150, 70%, 40%)"
                    fill="hsl(150, 70%, 40%)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-400" />
                  <div>
                    <p className="font-medium text-green-400">AI Insight: Structural Resilience Strategy</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Implementing the recommended interventions is projected to increase organizational resilience by{" "}
                      <span className="font-semibold text-green-400">+47%</span> over 6 months. This approach reduces
                      reliance on scarce experts through knowledge continuity and structural improvements rather than
                      compensation-based retention, creating sustainable capability distribution across the
                      organization.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Fragility Heatmap */}
        <TabsContent value="heatmap" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Network className="h-5 w-5 text-orange-400" />
                Knowledge Fragility Heatmap
              </CardTitle>
              <CardDescription>
                Risk assessment across teams showing knowledge concentration, documentation gaps, and backup coverage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-end gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded" style={{ backgroundColor: "hsl(150, 70%, 40%)" }} />
                  <span className="text-muted-foreground">Low Risk (0-30%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded" style={{ backgroundColor: "hsl(45, 70%, 50%)" }} />
                  <span className="text-muted-foreground">Moderate (30-50%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded" style={{ backgroundColor: "hsl(30, 70%, 50%)" }} />
                  <span className="text-muted-foreground">High (50-70%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded" style={{ backgroundColor: "hsl(0, 70%, 50%)" }} />
                  <span className="text-muted-foreground">Critical (70%+)</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Team</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                        Knowledge Concentration
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                        Documentation Gap
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                        Backup Deficit
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Overall Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fragilityHeatmapData.map((row) => (
                      <tr key={row.team} className="border-b border-border/50">
                        <td className="px-4 py-4 font-medium text-foreground">{row.team}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center">
                            <div
                              className="flex h-12 w-16 items-center justify-center rounded font-semibold text-foreground"
                              style={{ backgroundColor: getFragilityColor(row.knowledge) }}
                            >
                              {row.knowledge}%
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center">
                            <div
                              className="flex h-12 w-16 items-center justify-center rounded font-semibold text-foreground"
                              style={{ backgroundColor: getFragilityColor(100 - row.documentation) }}
                            >
                              {100 - row.documentation}%
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center">
                            <div
                              className="flex h-12 w-16 items-center justify-center rounded font-semibold text-foreground"
                              style={{ backgroundColor: getFragilityColor(100 - row.backup) }}
                            >
                              {100 - row.backup}%
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center">
                            <div
                              className="flex h-12 w-20 items-center justify-center rounded font-bold text-foreground"
                              style={{ backgroundColor: getFragilityColor(row.overall) }}
                            >
                              {row.overall}%
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
                <div className="flex items-start gap-3">
                  <Brain className="mt-0.5 h-5 w-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-orange-400">AI Analysis: Knowledge Fragility Patterns</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      The <span className="font-semibold text-foreground">AI/ML Team</span> shows the highest overall
                      fragility (72%) due to severe knowledge concentration and poor documentation coverage. Recommended
                      action: Initiate mandatory documentation sprints and establish cross-training partnerships with
                      Data Engineering team to distribute ML pipeline expertise.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skill Dependency Network */}
        <TabsContent value="network" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <GitBranch className="h-5 w-5 text-primary" />
                Skill Dependency Network
              </CardTitle>
              <CardDescription>
                Critical skill nodes and their dependencies across the organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Network Visualization as Bar Chart */}
                <div>
                  <h4 className="mb-4 text-sm font-medium text-muted-foreground">Risk Level by Skill</h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={skillDependencyData.nodes} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 5%, 20%)" />
                      <XAxis type="number" domain={[0, 100]} stroke="hsl(270, 5%, 50%)" fontSize={12} />
                      <YAxis dataKey="name" type="category" stroke="hsl(270, 5%, 50%)" fontSize={11} width={100} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(270, 5%, 13%)",
                          borderColor: "hsl(270, 5%, 25%)",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value}%`, "Risk Level"]}
                      />
                      <Bar dataKey="riskLevel" radius={[0, 4, 4, 0]}>
                        {skillDependencyData.nodes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getFragilityColor(entry.riskLevel)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Skill Details */}
                <div className="space-y-3">
                  <h4 className="mb-4 text-sm font-medium text-muted-foreground">Critical Skill Nodes</h4>
                  {skillDependencyData.nodes
                    .sort((a, b) => b.riskLevel - a.riskLevel)
                    .slice(0, 5)
                    .map((node) => (
                      <div key={node.id} className="rounded-lg border border-border bg-secondary/30 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">{node.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {node.experts} expert{node.experts !== 1 ? "s" : ""} | {node.dependentProjects} dependent
                              projects
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className="text-lg font-bold"
                              style={{ color: node.riskLevel >= 70 ? "hsl(0, 70%, 60%)" : "hsl(45, 70%, 60%)" }}
                            >
                              {node.riskLevel}%
                            </p>
                            <p className="text-xs text-muted-foreground">Risk Score</p>
                          </div>
                        </div>
                        <Progress value={node.riskLevel} className="mt-3 h-2" />
                      </div>
                    ))}
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-red-400" />
                  <div>
                    <p className="font-medium text-red-400">AI Alert: Single-Point-of-Failure Skills</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Payment Gateway</span> (95% risk) and{" "}
                      <span className="font-semibold text-foreground">ML Pipeline</span> (92% risk) are critical
                      single-point-of-failure skills with only 1 expert each supporting 8-15 dependent projects.
                      Immediate action required: Establish dedicated cross-training programs and knowledge
                      documentation initiatives for these skills.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Post-Delivery Exit Trends */}
        <TabsContent value="trends" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingDown className="h-5 w-5 text-red-400" />
                Post-Delivery Exit Trend Analysis
              </CardTitle>
              <CardDescription>
                Correlation between major project deliveries and subsequent employee exits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={postDeliveryExitTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 5%, 20%)" />
                  <XAxis dataKey="month" stroke="hsl(270, 5%, 50%)" fontSize={12} />
                  <YAxis yAxisId="left" stroke="hsl(270, 5%, 50%)" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(270, 5%, 50%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(270, 5%, 13%)",
                      borderColor: "hsl(270, 5%, 25%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="deliveries"
                    name="Major Deliveries"
                    stroke="hsl(250, 70%, 60%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(250, 70%, 60%)" }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="exits"
                    name="Exits (within 90 days)"
                    stroke="hsl(0, 70%, 60%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(0, 70%, 60%)" }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="exitRate"
                    name="Exit Rate %"
                    stroke="hsl(45, 70%, 60%)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "hsl(45, 70%, 60%)" }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="border-border bg-secondary/30">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Avg Exit Rate Post-Delivery</p>
                    <p className="text-2xl font-bold text-red-400">29.5%</p>
                    <p className="text-xs text-muted-foreground">Within 90 days of major release</p>
                  </CardContent>
                </Card>
                <Card className="border-border bg-secondary/30">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Peak Exit Month</p>
                    <p className="text-2xl font-bold text-orange-400">November</p>
                    <p className="text-xs text-muted-foreground">45% exit rate (post-Q4 delivery)</p>
                  </CardContent>
                </Card>
                <Card className="border-border bg-secondary/30">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Correlation Score</p>
                    <p className="text-2xl font-bold text-yellow-400">0.78</p>
                    <p className="text-xs text-muted-foreground">Strong delivery-exit correlation</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 rounded-lg border border-primary/30 bg-primary/10 p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-primary">AI Recommendation: Break the Exit Cycle</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Analysis reveals a strong correlation (0.78) between major project deliveries and subsequent
                      exits. Instead of reactive retention bonuses, implement these structural changes:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-400" />
                        <span>
                          <span className="font-medium text-foreground">Rotational Innovation Sprints:</span> 2-week
                          post-delivery periods for passion projects
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-400" />
                        <span>
                          <span className="font-medium text-foreground">Growth-Role Pathways:</span> Clear advancement
                          tied to delivery milestones
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-400" />
                        <span>
                          <span className="font-medium text-foreground">Workload Rebalancing:</span> Automatic capacity
                          reduction after intense delivery cycles
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
