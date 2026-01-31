"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  AlertTriangle,
  Brain,
  Calendar,
  ChevronDown,
  Command,
  Download,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  GitBranch,
  LayoutDashboard,
  Lightbulb,
  Moon,
  Network,
  RefreshCw,
  Shield,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";

import { KPIGrid } from "@/components/dashboard/kpi-cards";
import { TrendCharts, SkillGapChart, CostSustainabilityChart } from "@/components/dashboard/trend-charts";
import { DecisionEngine } from "@/components/modules/decision-engine";
import { RetentionIntelligence } from "@/components/modules/retention-intelligence";
import { KnowledgeRiskAnalyzer } from "@/components/modules/knowledge-risk";
import { ScenarioSimulator } from "@/components/modules/scenario-simulator";
import { SimulationLab } from "@/components/modules/simulation-lab";
import { SustainabilityMonitor } from "@/components/modules/sustainability-monitor";
import { LifecycleEngine } from "@/components/modules/lifecycle-engine";
import { AddEmployeeDialog } from "@/components/add-employee-dialog";
import { useEmployees } from "@/lib/employee-context";
import { useTheme } from "@/lib/theme-context";
import { dashboardMetrics, trendData, skillGaps, costComparisonData } from "@/lib/talent-data";

export default function TalentIQDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { employees, refreshData, isRefreshing } = useEmployees();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleRefresh = useCallback(async () => {
    await refreshData();
    setLastUpdated(new Date());
    toast({
      title: "Data Refreshed",
      description: "Dashboard metrics have been updated with latest data.",
    });
  }, [refreshData, toast]);

  const handleExportCSV = useCallback(() => {
    // Generate CSV content
    const headers = ["ID", "Name", "Role", "Department", "Attrition Risk", "Criticality", "Key Person", "Skills"];
    const rows = employees.map((emp) => [
      emp.id,
      emp.name,
      emp.role,
      emp.department,
      emp.attritionRisk,
      emp.criticality,
      emp.isKeyPerson ? "Yes" : "No",
      emp.skills.join("; "),
    ]);
    
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    
    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `talentiq-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Employee data has been exported as CSV.",
    });
  }, [employees, toast]);

  const handleExportPDF = useCallback(() => {
    // Use browser print dialog for PDF export
    toast({
      title: "Preparing PDF Export",
      description: "Opening print dialog. Select 'Save as PDF' to download.",
    });
    setTimeout(() => {
      window.print();
    }, 500);
  }, [toast]);

  const handleScheduleReport = useCallback(() => {
    toast({
      title: "Schedule Report",
      description: "Report scheduling feature requires email integration. Contact admin to configure.",
      variant: "default",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">TalentIQ</h1>
                  <p className="text-xs text-muted-foreground">Strategic Workforce Intelligence</p>
                </div>
              </div>
              <Badge variant="outline" className="hidden md:flex border-primary/50 text-primary">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="hidden md:flex">
                <Users className="h-3 w-3 mr-1" />
                {employees.length} Employees
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                <span>Last updated:</span>
                <span className="font-medium">
                  {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <AddEmployeeDialog />
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 bg-transparent"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Export
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportPDF}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportCSV}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleScheduleReport}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Alert Banner */}
      <div className="bg-warning/10 border-b border-warning/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3 text-sm">
            <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
            <span className="text-warning font-medium">Strategic Alert:</span>
            <span className="text-muted-foreground">
              4 critical personnel at high attrition risk. Quantum Lab team has 95% knowledge concentration.
              Immediate action recommended.
            </span>
            <Button variant="link" size="sm" className="ml-auto text-warning p-0 h-auto" onClick={() => setActiveTab("retention")}>
              View Details
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Executive Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="decision" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Decision Engine</span>
              <span className="sm:hidden">Decisions</span>
            </TabsTrigger>
            <TabsTrigger value="retention" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Retention Intelligence</span>
              <span className="sm:hidden">Retention</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">Knowledge Risk</span>
              <span className="sm:hidden">Risk</span>
            </TabsTrigger>
            <TabsTrigger value="simulation" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              <span className="hidden sm:inline">Scenario Simulation</span>
              <span className="sm:hidden">Simulate</span>
            </TabsTrigger>
            <TabsTrigger value="lab" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              <span className="hidden sm:inline">Simulation Lab</span>
              <span className="sm:hidden">Lab</span>
            </TabsTrigger>
            <TabsTrigger value="sustainability" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Sustainability Monitor</span>
              <span className="sm:hidden">Sustain</span>
            </TabsTrigger>
            <TabsTrigger value="lifecycle" className="flex items-center gap-2">
              <Command className="h-4 w-4" />
              <span className="hidden sm:inline">Lifecycle Command</span>
              <span className="sm:hidden">Lifecycle</span>
            </TabsTrigger>
          </TabsList>

          {/* Executive Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Executive Dashboard</h2>
                <p className="text-muted-foreground">
                  Real-time workforce intelligence and capability metrics
                </p>
              </div>
              <Badge variant="secondary" className="hidden md:flex">
                <Shield className="h-3 w-3 mr-1" />
                Data as of Q4 2025
              </Badge>
            </div>

            <KPIGrid metrics={dashboardMetrics} />

            <TrendCharts
              trendData={trendData}
              hiringVsUpskilling={dashboardMetrics.hiringVsUpskilling}
            />

            <div className="grid gap-6 lg:grid-cols-2">
              <SkillGapChart skillGaps={skillGaps} />
              <CostSustainabilityChart data={costComparisonData} />
            </div>

            {/* Strategic Summary */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-primary" />
                Strategic Intelligence Summary
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                  <h4 className="font-medium text-destructive flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    Critical Concerns
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>AI/ML capability gap at 55% - requires immediate strategy</li>
                    <li>Quantum Computing team has single point of failure</li>
                    <li>2 key personnel showing &gt;80% attrition risk</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                  <h4 className="font-medium text-warning flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4" />
                    Recommended Actions
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>Initiate AI augmentation strategy for 30% tasks</li>
                    <li>Launch cross-training program for critical skills</li>
                    <li>Review compensation for at-risk talent</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                  <h4 className="font-medium text-success flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4" />
                    Positive Indicators
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>Upskilling investment showing 8% capability improvement</li>
                    <li>Infrastructure team has healthy knowledge distribution</li>
                    <li>Budget utilization on track at 78%</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Decision Engine */}
          <TabsContent value="decision" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Talent Decision Engine</h2>
              <p className="text-muted-foreground">
                AI-powered capability gap analysis and strategic recommendations
              </p>
            </div>
            <DecisionEngine />
          </TabsContent>

          {/* Retention Intelligence */}
          <TabsContent value="retention" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Retention Intelligence</h2>
              <p className="text-muted-foreground">
                Predictive attrition analysis and retention strategy recommendations
              </p>
            </div>
            <RetentionIntelligence />
          </TabsContent>

          {/* Knowledge Risk */}
          <TabsContent value="knowledge" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Knowledge Risk Analyzer</h2>
              <p className="text-muted-foreground">
                Identify knowledge concentration risks and build organizational resilience
              </p>
            </div>
            <KnowledgeRiskAnalyzer />
          </TabsContent>

          {/* Scenario Simulation */}
          <TabsContent value="simulation" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Scenario Simulation Engine</h2>
              <p className="text-muted-foreground">
                Model different talent strategies and analyze long-term implications
              </p>
            </div>
            <ScenarioSimulator />
          </TabsContent>

          {/* Simulation Lab */}
          <TabsContent value="lab" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Scenario Simulation Lab</h2>
              <p className="text-muted-foreground">
                Advanced workforce planning with recruiter capacity and time-to-hire modeling
              </p>
            </div>
            <SimulationLab />
          </TabsContent>

          {/* Sustainability Risk Monitor */}
          <TabsContent value="sustainability" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Sustainability Risk Monitor</h2>
              <p className="text-muted-foreground">
                Systemic intervention recommendations for structural resilience over compensation-based retention
              </p>
            </div>
            <SustainabilityMonitor />
          </TabsContent>

          {/* Talent Lifecycle Command Center */}
          <TabsContent value="lifecycle" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Talent Lifecycle Command Center</h2>
              <p className="text-muted-foreground">
                Unified orchestration engine connecting workforce planning, recruitment, development, retention, and knowledge continuity
              </p>
            </div>
            <LifecycleEngine />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="h-4 w-4" />
              <span>TalentIQ Strategic Workforce Intelligence Platform</span>
            </div>
            <p className="text-xs text-muted-foreground text-center md:text-right">
              Demonstrating that sustainable capability strategy outperforms reactive recruitment.
              <br />
              <span className="text-primary">Hiring more is NOT always the solution.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
