"use client";

import React from "react"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  ChevronDown,
  ChevronUp,
  DollarSign,
  GitBranch,
  Layers,
  LineChart,
  Play,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ScenarioParams {
  hiringBudget: number;
  trainingInvestment: number;
  contractorUsage: number;
  aiAdoption: number;
  attritionRate: number;
}

interface ScenarioResult {
  year: number;
  capability: number;
  cost: number;
  risk: number;
  sustainability: number;
}

const defaultParams: ScenarioParams = {
  hiringBudget: 500000,
  trainingInvestment: 150000,
  contractorUsage: 20,
  aiAdoption: 30,
  attritionRate: 15,
};

function calculateScenario(params: ScenarioParams): ScenarioResult[] {
  const results: ScenarioResult[] = [];
  let capability = 54; // Starting capability from dashboard
  let baseCost = params.hiringBudget + params.trainingInvestment + (params.contractorUsage * 2400);

  for (let year = 2026; year <= 2030; year++) {
    // Calculate capability growth
    const hiringImpact = (params.hiringBudget / 100000) * 3;
    const trainingImpact = (params.trainingInvestment / 50000) * 4;
    const aiImpact = (params.aiAdoption / 10) * 2;
    const attritionImpact = params.attritionRate * 1.2;

    capability = Math.min(
      100,
      capability + hiringImpact + trainingImpact + aiImpact - attritionImpact + (year - 2026) * 2
    );

    // Calculate costs (compounding slightly)
    const yearMultiplier = 1 + (year - 2026) * 0.05;
    const cost = Math.round(
      (baseCost * yearMultiplier -
        (params.aiAdoption / 100) * 100000 +
        (params.contractorUsage / 100) * 150000) /
        1000
    );

    // Calculate risk
    const risk = Math.max(
      10,
      Math.min(
        100,
        68 - // Starting risk
          (params.trainingInvestment / 30000) -
          (params.aiAdoption / 5) +
          params.contractorUsage * 0.3 +
          params.attritionRate * 1.5
      )
    );

    // Calculate sustainability
    const sustainability = Math.max(
      10,
      Math.min(
        100,
        40 +
          (params.trainingInvestment / 20000) +
          (params.aiAdoption / 3) -
          (params.contractorUsage / 4) -
          params.attritionRate * 0.5
      )
    );

    results.push({
      year,
      capability: Math.round(capability),
      cost,
      risk: Math.round(risk),
      sustainability: Math.round(sustainability),
    });
  }

  return results;
}

interface PresetScenario {
  name: string;
  description: string;
  icon: React.ReactNode;
  params: ScenarioParams;
  badge: string;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
}

const presetScenarios: PresetScenario[] = [
  {
    name: "Aggressive Hiring",
    description: "Maximize external hiring to fill gaps quickly",
    icon: <Users className="h-5 w-5" />,
    params: {
      hiringBudget: 1200000,
      trainingInvestment: 50000,
      contractorUsage: 40,
      aiAdoption: 20,
      attritionRate: 18,
    },
    badge: "High Cost",
    badgeVariant: "destructive",
  },
  {
    name: "Sustainable Growth",
    description: "Balance hiring with internal development",
    icon: <TrendingUp className="h-5 w-5" />,
    params: {
      hiringBudget: 400000,
      trainingInvestment: 300000,
      contractorUsage: 15,
      aiAdoption: 50,
      attritionRate: 10,
    },
    badge: "Recommended",
    badgeVariant: "default",
  },
  {
    name: "AI-First Strategy",
    description: "Maximize AI augmentation to reduce talent dependency",
    icon: <Sparkles className="h-5 w-5" />,
    params: {
      hiringBudget: 200000,
      trainingInvestment: 200000,
      contractorUsage: 10,
      aiAdoption: 80,
      attritionRate: 12,
    },
    badge: "Innovative",
    badgeVariant: "secondary",
  },
  {
    name: "Cost Minimization",
    description: "Minimize spend while maintaining baseline capability",
    icon: <DollarSign className="h-5 w-5" />,
    params: {
      hiringBudget: 150000,
      trainingInvestment: 100000,
      contractorUsage: 5,
      aiAdoption: 40,
      attritionRate: 20,
    },
    badge: "Budget",
    badgeVariant: "outline",
  },
];

function WhatIfCard({
  title,
  before,
  after,
  isPositive,
}: {
  title: string;
  before: number;
  after: number;
  isPositive: boolean;
}) {
  const diff = after - before;
  const isImproved = isPositive ? diff > 0 : diff < 0;

  return (
    <div className="p-4 rounded-lg bg-muted/30 border">
      <p className="text-sm text-muted-foreground mb-2">{title}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">{after}%</span>
        <div
          className={cn(
            "flex items-center gap-1 text-sm font-medium",
            isImproved ? "text-success" : "text-destructive"
          )}
        >
          {isImproved ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {diff > 0 ? "+" : ""}
          {diff}%
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1">from {before}% baseline</p>
    </div>
  );
}

export function ScenarioSimulator() {
  const [params, setParams] = useState<ScenarioParams>(defaultParams);
  const [results, setResults] = useState<ScenarioResult[] | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareResults, setCompareResults] = useState<ScenarioResult[] | null>(null);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      if (compareMode && results) {
        setCompareResults(calculateScenario(params));
      } else {
        setResults(calculateScenario(params));
      }
      setIsSimulating(false);
    }, 1200);
  };

  const applyPreset = (preset: PresetScenario) => {
    setParams(preset.params);
    setActivePreset(preset.name);
  };

  const resetToDefaults = () => {
    setParams(defaultParams);
    setActivePreset(null);
    setCompareResults(null);
  };

  const finalResult = results?.[results.length - 1];
  const baseline = { capability: 54, risk: 68, sustainability: 40, cost: 650 };

  return (
    <div className="space-y-6">
      {/* Preset Scenarios */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          Scenario Presets
        </h3>
        <div className="grid gap-4 md:grid-cols-4">
          {presetScenarios.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={cn(
                "p-4 rounded-lg border text-left transition-all hover:border-primary/50",
                activePreset === preset.name && "border-primary bg-primary/5"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-muted">{preset.icon}</div>
                <Badge variant={preset.badgeVariant}>{preset.badge}</Badge>
              </div>
              <h4 className="font-medium text-sm">{preset.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Parameter Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Simulation Parameters
            </CardTitle>
            <CardDescription>Adjust variables to model different scenarios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Annual Hiring Budget
                </Label>
                <span className="text-sm font-medium">${(params.hiringBudget / 1000).toFixed(0)}K</span>
              </div>
              <Slider
                value={[params.hiringBudget]}
                onValueChange={([value]) => setParams({ ...params, hiringBudget: value })}
                min={0}
                max={2000000}
                step={50000}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  Training Investment
                </Label>
                <span className="text-sm font-medium">${(params.trainingInvestment / 1000).toFixed(0)}K</span>
              </div>
              <Slider
                value={[params.trainingInvestment]}
                onValueChange={([value]) => setParams({ ...params, trainingInvestment: value })}
                min={0}
                max={500000}
                step={10000}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  Contractor Usage
                </Label>
                <span className="text-sm font-medium">{params.contractorUsage}%</span>
              </div>
              <Slider
                value={[params.contractorUsage]}
                onValueChange={([value]) => setParams({ ...params, contractorUsage: value })}
                min={0}
                max={100}
                step={5}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  AI Adoption Level
                </Label>
                <span className="text-sm font-medium">{params.aiAdoption}%</span>
              </div>
              <Slider
                value={[params.aiAdoption]}
                onValueChange={([value]) => setParams({ ...params, aiAdoption: value })}
                min={0}
                max={100}
                step={5}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  Expected Attrition Rate
                </Label>
                <span className="text-sm font-medium">{params.attritionRate}%</span>
              </div>
              <Slider
                value={[params.attritionRate]}
                onValueChange={([value]) => setParams({ ...params, attritionRate: value })}
                min={5}
                max={30}
                step={1}
              />
            </div>

            <div className="pt-4 border-t space-y-2">
              <Button className="w-full" onClick={runSimulation} disabled={isSimulating}>
                {isSimulating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run 5-Year Simulation
                  </>
                )}
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={resetToDefaults}>
                  Reset
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setCompareMode(!compareMode)}
                  disabled={!results}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  {compareMode ? "Exit Compare" : "Compare"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {results ? (
            <>
              {/* What-If Summary */}
              <div className="grid gap-4 md:grid-cols-4">
                <WhatIfCard
                  title="Capability (2030)"
                  before={baseline.capability}
                  after={finalResult?.capability || 0}
                  isPositive={true}
                />
                <WhatIfCard
                  title="Risk Score (2030)"
                  before={baseline.risk}
                  after={finalResult?.risk || 0}
                  isPositive={false}
                />
                <WhatIfCard
                  title="Sustainability (2030)"
                  before={baseline.sustainability}
                  after={finalResult?.sustainability || 0}
                  isPositive={true}
                />
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">5-Year Total Cost</p>
                  <p className="text-2xl font-bold">
                    ${results.reduce((acc, r) => acc + r.cost, 0).toLocaleString()}K
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">cumulative investment</p>
                </Card>
              </div>

              {/* Charts */}
              <Tabs defaultValue="capability" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="capability">Capability Forecast</TabsTrigger>
                  <TabsTrigger value="cost">Cost Projection</TabsTrigger>
                  <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="capability" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Capability Readiness Projection</CardTitle>
                      <CardDescription>
                        5-year forecast based on current parameters
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={results}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 5%, 20%)" />
                          <XAxis dataKey="year" stroke="hsl(270, 5%, 50%)" fontSize={12} />
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
                            dataKey="capability"
                            name="Capability Score"
                            stroke="hsl(250, 80%, 65%)"
                            fill="hsl(250, 80%, 65%)"
                            fillOpacity={0.3}
                          />
                          <Area
                            type="monotone"
                            dataKey="sustainability"
                            name="Sustainability"
                            stroke="hsl(165, 60%, 45%)"
                            fill="hsl(165, 60%, 45%)"
                            fillOpacity={0.3}
                          />
                          {compareResults && (
                            <>
                              <Area
                                type="monotone"
                                data={compareResults}
                                dataKey="capability"
                                name="Compare: Capability"
                                stroke="hsl(250, 80%, 45%)"
                                fill="none"
                                strokeDasharray="5 5"
                              />
                            </>
                          )}
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cost" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Annual Cost Projection</CardTitle>
                      <CardDescription>Investment requirements over 5 years</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={results}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 5%, 20%)" />
                          <XAxis dataKey="year" stroke="hsl(270, 5%, 50%)" fontSize={12} />
                          <YAxis stroke="hsl(270, 5%, 50%)" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(270, 5%, 13%)",
                              borderColor: "hsl(270, 5%, 25%)",
                              borderRadius: "8px",
                            }}
                            formatter={(value: number) => [`$${value}K`, "Cost"]}
                          />
                          <Legend />
                          <Bar dataKey="cost" name="Annual Cost ($K)" fill="hsl(250, 80%, 65%)" radius={[4, 4, 0, 0]} />
                          {compareResults && (
                            <Bar
                              data={compareResults}
                              dataKey="cost"
                              name="Compare: Cost"
                              fill="hsl(85, 60%, 55%)"
                              radius={[4, 4, 0, 0]}
                            />
                          )}
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="risk" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Risk Trajectory</CardTitle>
                      <CardDescription>Talent risk index evolution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsLineChart data={results}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 5%, 20%)" />
                          <XAxis dataKey="year" stroke="hsl(270, 5%, 50%)" fontSize={12} />
                          <YAxis stroke="hsl(270, 5%, 50%)" fontSize={12} domain={[0, 100]} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(270, 5%, 13%)",
                              borderColor: "hsl(270, 5%, 25%)",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="risk"
                            name="Risk Score"
                            stroke="hsl(25, 70%, 55%)"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                          {compareResults && (
                            <Line
                              type="monotone"
                              data={compareResults}
                              dataKey="risk"
                              name="Compare: Risk"
                              stroke="hsl(25, 70%, 35%)"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              dot={{ r: 3 }}
                            />
                          )}
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Strategic Insight */}
              <Card className="bg-primary/5 border-primary/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Strategic Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">
                    {finalResult && finalResult.sustainability > 60 && finalResult.capability > 70 ? (
                      <>
                        Based on this scenario, your organization achieves a <strong>sustainable capability trajectory</strong> with a {finalResult.capability}% readiness score by 2030. The balance of training investment and AI adoption creates long-term resilience while managing costs effectively. This approach demonstrates that <strong>strategic capability building outperforms reactive hiring</strong> for sustained competitive advantage.
                      </>
                    ) : finalResult && finalResult.risk > 60 ? (
                      <>
                        This scenario results in elevated talent risk ({finalResult.risk}%) and sustainability concerns. The over-reliance on external hiring or contractors without sufficient knowledge transfer creates organizational vulnerability. Consider increasing training investment and AI adoption to build more sustainable internal capabilities. <strong>Reactive recruitment alone is not a long-term solution.</strong>
                      </>
                    ) : (
                      <>
                        This balanced scenario achieves moderate capability growth ({finalResult?.capability}%) with acceptable risk levels. To optimize further, consider adjusting the training-to-hiring ratio or increasing AI augmentation to reduce dependency on scarce talent. The data suggests that <strong>sustainable capability strategy yields better long-term ROI</strong> than aggressive hiring alone.
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[500px]">
              <CardContent className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <LineChart className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Scenario Simulation Engine</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    Model different talent strategies and see their 5-year impact on capability, cost, and organizational risk
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4" />
                  Configure parameters and run simulation
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
