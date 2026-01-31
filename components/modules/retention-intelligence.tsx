"use client";

import React from "react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  ChevronRight,
  DollarSign,
  GraduationCap,
  Heart,
  Shield,
  Trash2,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  calculateAttritionRisk,
  Employee,
  getRetentionActions,
} from "@/lib/talent-data";
import { useEmployees } from "@/lib/employee-context";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function RiskBadge({ risk }: { risk: number }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        risk > 70
          ? "border-destructive text-destructive bg-destructive/10"
          : risk > 50
            ? "border-warning text-warning bg-warning/10"
            : "border-success text-success bg-success/10"
      )}
    >
      {risk > 70 ? "Critical" : risk > 50 ? "Moderate" : "Low"} Risk
    </Badge>
  );
}

function CriticalityBadge({ criticality }: { criticality: string }) {
  const colors: Record<string, string> = {
    critical: "border-destructive text-destructive",
    high: "border-warning text-warning",
    medium: "border-primary text-primary",
    low: "border-muted-foreground text-muted-foreground",
  };
  return (
    <Badge variant="outline" className={colors[criticality]}>
      {criticality.charAt(0).toUpperCase() + criticality.slice(1)}
    </Badge>
  );
}

function EmployeeCard({
  employee,
  isSelected,
  onClick,
  onDelete,
}: {
  employee: Employee;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-all hover:border-primary/50",
        isSelected && "border-primary bg-primary/5",
        employee.attritionRisk > 70 && "border-destructive/30"
      )}
    >
      <div className="flex items-start justify-between">
        <button onClick={onClick} className="flex items-center gap-3 flex-1 text-left">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
              employee.isKeyPerson ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            )}
          >
            {employee.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="font-medium text-sm">{employee.name}</p>
            <p className="text-xs text-muted-foreground">{employee.role}</p>
          </div>
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title="Remove employee"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <ChevronRight className={cn("h-4 w-4 transition-transform", isSelected && "rotate-90")} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <RiskBadge risk={employee.attritionRisk} />
        <CriticalityBadge criticality={employee.criticality} />
        {employee.isKeyPerson && (
          <Badge variant="secondary" className="text-xs">
            Key Person
          </Badge>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Attrition Risk</span>
          <span className="font-medium">{employee.attritionRisk}%</span>
        </div>
        <Progress
          value={employee.attritionRisk}
          className={cn(
            "h-1.5",
            employee.attritionRisk > 70
              ? "[&>div]:bg-destructive"
              : employee.attritionRisk > 50
                ? "[&>div]:bg-warning"
                : "[&>div]:bg-success"
          )}
        />
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  icon,
  isPositive,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  isPositive?: boolean;
}) {
  const isGood = isPositive ? value >= 60 : value <= 40;
  const isWarning = isPositive ? value >= 40 && value < 60 : value > 40 && value <= 60;

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{icon}</span>
        {label}
      </div>
      <div className="flex items-center gap-2">
        <Progress
          value={value}
          className={cn(
            "w-24 h-2",
            isGood
              ? "[&>div]:bg-success"
              : isWarning
                ? "[&>div]:bg-warning"
                : "[&>div]:bg-destructive"
          )}
        />
        <span
          className={cn(
            "text-sm font-medium w-10 text-right",
            isGood ? "text-success" : isWarning ? "text-warning" : "text-destructive"
          )}
        >
          {value}%
        </span>
      </div>
    </div>
  );
}

export function RetentionIntelligence() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { employees, removeEmployee } = useEmployees();

  const highRiskEmployees = employees.filter((e) => e.attritionRisk > 50);
  const criticalEmployees = employees.filter((e) => e.criticality === "critical");

  const chartData = employees
    .sort((a, b) => b.attritionRisk - a.attritionRisk)
    .map((e) => ({
      name: e.name.split(" ")[1],
      risk: e.attritionRisk,
      isCritical: e.criticality === "critical",
    }));

  const riskAnalysis = selectedEmployee ? calculateAttritionRisk(selectedEmployee) : null;
  const retentionActions = selectedEmployee ? getRetentionActions(selectedEmployee) : [];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Employee List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            At-Risk Talent
          </CardTitle>
          <CardDescription>
            {highRiskEmployees.length} employees above 50% attrition risk threshold
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[600px] overflow-auto">
          {employees
            .sort((a, b) => b.attritionRisk - a.attritionRisk)
            .map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                isSelected={selectedEmployee?.id === employee.id}
                onClick={() => setSelectedEmployee(employee)}
                onDelete={() => {
                  removeEmployee(employee.id);
                  if (selectedEmployee?.id === employee.id) {
                    setSelectedEmployee(null);
                  }
                }}
              />
            ))}
        </CardContent>
      </Card>

      {/* Detail Panel */}
      <div className="lg:col-span-2 space-y-4">
        {selectedEmployee ? (
          <>
            {/* Employee Profile */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold text-primary">
                      {selectedEmployee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <CardTitle>{selectedEmployee.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {selectedEmployee.role} &middot; {selectedEmployee.department}
                      </CardDescription>
                      <div className="flex gap-2 mt-2">
                        <CriticalityBadge criticality={selectedEmployee.criticality} />
                        <Badge variant="outline">{selectedEmployee.tenure} years tenure</Badge>
                        {selectedEmployee.isKeyPerson && (
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            Key Personnel
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Attrition Risk Score</p>
                    <p
                      className={cn(
                        "text-4xl font-bold",
                        selectedEmployee.attritionRisk > 70
                          ? "text-destructive"
                          : selectedEmployee.attritionRisk > 50
                            ? "text-warning"
                            : "text-success"
                      )}
                    >
                      {selectedEmployee.attritionRisk}%
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium mb-3">Performance Indicators</h4>
                    <MetricRow
                      label="Compensation Percentile"
                      value={selectedEmployee.compensationPercentile}
                      icon={<DollarSign className="h-4 w-4" />}
                      isPositive
                    />
                    <MetricRow
                      label="Workload Stress"
                      value={selectedEmployee.workloadStress}
                      icon={<Zap className="h-4 w-4" />}
                      isPositive={false}
                    />
                    <MetricRow
                      label="Learning Opportunities"
                      value={selectedEmployee.learningOpportunities}
                      icon={<GraduationCap className="h-4 w-4" />}
                      isPositive
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium mb-3">Engagement Factors</h4>
                    <MetricRow
                      label="Career Progression"
                      value={selectedEmployee.careerProgression}
                      icon={<TrendingUp className="h-4 w-4" />}
                      isPositive
                    />
                    <MetricRow
                      label="External Offer Exposure"
                      value={selectedEmployee.offerExposure}
                      icon={<Briefcase className="h-4 w-4" />}
                      isPositive={false}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Factors & Actions */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Risk Factor Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {riskAnalysis?.factors.map((factor, index) => (
                    <div key={index} className="p-3 rounded-lg bg-muted/50 border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{factor.factor}</span>
                        <Badge variant="outline" className="text-xs">
                          Impact: +{factor.impact}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{factor.suggestion}</p>
                    </div>
                  ))}
                  {riskAnalysis?.factors.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No significant risk factors identified
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    Recommended Retention Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {retentionActions.map((action, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">{action}</span>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    <Shield className="h-4 w-4 mr-2" />
                    Generate Retention Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
            {/* Overview Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Attrition Risk Distribution</CardTitle>
                <CardDescription>
                  Employee risk scores across the organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 5%, 20%)" />
                    <XAxis dataKey="name" stroke="hsl(270, 5%, 50%)" fontSize={12} />
                    <YAxis stroke="hsl(270, 5%, 50%)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(270, 5%, 13%)",
                        borderColor: "hsl(270, 5%, 25%)",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "hsl(0, 0%, 95%)" }}
                    />
                    <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.risk > 70
                              ? "hsl(25, 70%, 55%)"
                              : entry.risk > 50
                                ? "hsl(85, 60%, 55%)"
                                : "hsl(165, 60%, 45%)"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{highRiskEmployees.length}</p>
                      <p className="text-sm text-muted-foreground">High Risk Employees</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{criticalEmployees.length}</p>
                      <p className="text-sm text-muted-foreground">Critical Personnel</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {Math.round(employees.reduce((acc, e) => acc + e.attritionRisk, 0) / employees.length)}%
                      </p>
                      <p className="text-sm text-muted-foreground">Avg Attrition Risk</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/30">
              <CardContent className="py-8 text-center">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold">Select an Employee</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Click on any employee card to view detailed risk analysis and retention recommendations
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
