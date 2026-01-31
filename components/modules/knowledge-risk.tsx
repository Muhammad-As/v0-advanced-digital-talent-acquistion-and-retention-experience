"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Network,
  Shield,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { teams, type Employee } from "@/lib/talent-data";
import { useEmployees } from "@/lib/employee-context";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface HeatmapData {
  name: string;
  size: number;
  risk: number;
}

const COLORS = {
  critical: "hsl(25, 70%, 45%)",
  high: "hsl(45, 80%, 50%)",
  medium: "hsl(250, 80%, 55%)",
  low: "hsl(165, 60%, 45%)",
};

function getRiskColor(risk: number): string {
  if (risk >= 80) return COLORS.critical;
  if (risk >= 60) return COLORS.high;
  if (risk >= 40) return COLORS.medium;
  return COLORS.low;
}

function getRiskLevel(risk: number): "critical" | "high" | "medium" | "low" {
  if (risk >= 80) return "critical";
  if (risk >= 60) return "high";
  if (risk >= 40) return "medium";
  return "low";
}



function TeamRiskCard({ team, employees }: { team: (typeof teams)[0]; employees: Employee[] }) {
  const riskLevel = getRiskLevel(team.knowledgeConcentration);
  const teamMembers = employees.filter((e) => team.members.includes(e.id));
  const keyPersonCount = teamMembers.filter((e) => e.isKeyPerson).length;

  return (
    <Card
      className={cn(
        "transition-all hover:border-primary/50",
        riskLevel === "critical" && "border-destructive/50",
        riskLevel === "high" && "border-warning/50"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Network className="h-4 w-4 text-muted-foreground" />
            {team.name}
          </CardTitle>
          <Badge
            variant="outline"
            className={cn(
              riskLevel === "critical" && "border-destructive text-destructive",
              riskLevel === "high" && "border-warning text-warning",
              riskLevel === "medium" && "border-primary text-primary",
              riskLevel === "low" && "border-success text-success"
            )}
          >
            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Knowledge Concentration</p>
            <div className="flex items-center gap-2">
              <Progress
                value={team.knowledgeConcentration}
                className={cn(
                  "h-2",
                  riskLevel === "critical"
                    ? "[&>div]:bg-destructive"
                    : riskLevel === "high"
                      ? "[&>div]:bg-warning"
                      : riskLevel === "medium"
                        ? "[&>div]:bg-primary"
                        : "[&>div]:bg-success"
                )}
              />
              <span className="text-sm font-medium">{team.knowledgeConcentration}%</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Backup Coverage</p>
            <div className="flex items-center gap-2">
              <Progress
                value={team.backupCoverage}
                className={cn(
                  "h-2",
                  team.backupCoverage >= 60
                    ? "[&>div]:bg-success"
                    : team.backupCoverage >= 40
                      ? "[&>div]:bg-warning"
                      : "[&>div]:bg-destructive"
                )}
              />
              <span className="text-sm font-medium">{team.backupCoverage}%</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Team Composition</span>
            <span className="text-xs text-muted-foreground">
              {team.members.length} member{team.members.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs",
                  member.isKeyPerson
                    ? "bg-warning/10 text-warning border border-warning/30"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {member.isKeyPerson && <AlertTriangle className="h-3 w-3" />}
                {member.name.split(" ")[0]}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Critical Skills</p>
          <div className="flex flex-wrap gap-1">
            {team.criticalSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {keyPersonCount > 0 && (
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-warning">
              <AlertOctagon className="h-4 w-4" />
              <span>
                {keyPersonCount} single-point-of-failure employee{keyPersonCount > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function KnowledgeRiskAnalyzer() {
  const { employees } = useEmployees();
  
  const heatmapData: HeatmapData[] = teams.map((team) => ({
    name: team.name,
    size: 100 - team.backupCoverage,
    risk: team.knowledgeConcentration,
  }));

  const singlePointFailures = employees.filter((e) => e.isKeyPerson);
  const highRiskTeams = teams.filter((t) => t.knowledgeConcentration >= 70);

  const crossTrainingPlan = [
    {
      from: "Dr. Sarah Chen",
      to: "David Kim",
      skill: "Deep Learning Architecture",
      priority: "Critical",
      timeline: "Q1 2026",
    },
    {
      from: "Marcus Williams",
      to: "Research Team",
      skill: "Quantum Algorithms",
      priority: "Critical",
      timeline: "Q1-Q2 2026",
    },
    {
      from: "Aisha Patel",
      to: "Security Team",
      skill: "Incident Response",
      priority: "High",
      timeline: "Q1 2026",
    },
    {
      from: "Elena Rodriguez",
      to: "New Hire",
      skill: "Smart Contract Security",
      priority: "Medium",
      timeline: "Q2 2026",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertOctagon className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{singlePointFailures.length}</p>
                <p className="text-xs text-muted-foreground">Single-Point Failures</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Network className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{highRiskTeams.length}</p>
                <p className="text-xs text-muted-foreground">High-Risk Teams</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(teams.reduce((acc, t) => acc + t.knowledgeConcentration, 0) / teams.length)}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Knowledge Concentration</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(teams.reduce((acc, t) => acc + t.backupCoverage, 0) / teams.length)}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Backup Coverage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Knowledge Risk Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Knowledge Risk Heatmap
            </CardTitle>
            <CardDescription>
              Team knowledge concentration distribution - larger areas indicate higher risk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={heatmapData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 5%, 20%)" />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(270, 5%, 50%)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(270, 5%, 50%)" fontSize={11} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(270, 5%, 13%)",
                    borderColor: "hsl(270, 5%, 25%)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Knowledge Risk"]}
                />
                <Bar dataKey="risk" radius={[0, 4, 4, 0]}>
                  {heatmapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRiskColor(entry.risk)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.low }} />
                <span className="text-xs text-muted-foreground">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.medium }} />
                <span className="text-xs text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.high }} />
                <span className="text-xs text-muted-foreground">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.critical }} />
                <span className="text-xs text-muted-foreground">Critical</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cross-Training Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Suggested Cross-Training Plan
            </CardTitle>
            <CardDescription>
              Knowledge transfer priorities to reduce dependency risks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {crossTrainingPlan.map((plan, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg border transition-all hover:border-primary/50",
                  plan.priority === "Critical" && "border-destructive/30 bg-destructive/5"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      plan.priority === "Critical" && "border-destructive text-destructive",
                      plan.priority === "High" && "border-warning text-warning",
                      plan.priority === "Medium" && "border-primary text-primary"
                    )}
                  >
                    {plan.priority}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{plan.timeline}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{plan.from}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{plan.to}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{plan.skill}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2 bg-transparent">
              <Zap className="h-4 w-4 mr-2" />
              Generate Full Training Roadmap
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Team Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Team Knowledge Distribution
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams
            .sort((a, b) => b.knowledgeConcentration - a.knowledgeConcentration)
            .map((team) => (
              <TeamRiskCard key={team.id} team={team} employees={employees} />
            ))}
        </div>
      </div>

      {/* Backup Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Backup Capability Strategy
          </CardTitle>
          <CardDescription>
            Strategic recommendations to mitigate knowledge concentration risks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertOctagon className="h-5 w-5 text-destructive" />
                <span className="font-medium">Immediate Actions</span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  Document critical Quantum Computing processes from Marcus Williams
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  Initiate pair programming sessions for AI architecture
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  Create runbooks for security incident response
                </li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span className="font-medium">Short-term (30-90 days)</span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                  Establish mentorship program for key personnel
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                  Hire backup talent for Quantum Lab team
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                  Implement knowledge wiki for critical systems
                </li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-primary" />
                <span className="font-medium">Long-term (90+ days)</span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Build redundant expertise across all critical skills
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Establish rotation program for knowledge distribution
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Target backup coverage of 60%+ for all teams
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
