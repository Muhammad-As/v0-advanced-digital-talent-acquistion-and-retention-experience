"use client";

import React from "react"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  DollarSign,
  Lightbulb,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  calculateDecision,
  DecisionInputs,
  DecisionOutput,
  skillGaps,
  Strategy,
} from "@/lib/talent-data";

const strategyIcons: Record<Strategy, React.ReactNode> = {
  "External Hiring": <Target className="h-5 w-5" />,
  "Internal Upskilling": <TrendingUp className="h-5 w-5" />,
  "Role Redesign": <Sparkles className="h-5 w-5" />,
  "Contractor/Partner": <Zap className="h-5 w-5" />,
  "AI Augmentation": <Brain className="h-5 w-5" />,
};

const strategyColors: Record<Strategy, string> = {
  "External Hiring": "bg-chart-1/10 text-chart-1 border-chart-1/30",
  "Internal Upskilling": "bg-chart-2/10 text-chart-2 border-chart-2/30",
  "Role Redesign": "bg-chart-3/10 text-chart-3 border-chart-3/30",
  "Contractor/Partner": "bg-chart-4/10 text-chart-4 border-chart-4/30",
  "AI Augmentation": "bg-chart-5/10 text-chart-5 border-chart-5/30",
};

export function DecisionEngine() {
  const [inputs, setInputs] = useState<DecisionInputs>({
    skill: "AI/ML Engineering",
    urgency: "medium",
    budget: 150000,
    internalInventory: 45,
    timeToDelivery: 16,
    riskTolerance: "medium",
  });

  const [decision, setDecision] = useState<DecisionOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = calculateDecision(inputs);
      setDecision(result);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Capability Gap Assessment
          </CardTitle>
          <CardDescription>
            Define the talent requirement parameters for AI-powered strategy recommendation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Skill Selection */}
          <div className="space-y-2">
            <Label>Required Skill</Label>
            <Select
              value={inputs.skill}
              onValueChange={(value) => setInputs({ ...inputs, skill: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select skill" />
              </SelectTrigger>
              <SelectContent>
                {skillGaps.map((skill) => (
                  <SelectItem key={skill.skill} value={skill.skill}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>{skill.skill}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          skill.marketScarcity === "extreme" && "border-destructive text-destructive",
                          skill.marketScarcity === "high" && "border-warning text-warning"
                        )}
                      >
                        {skill.marketScarcity} scarcity
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Urgency Level */}
          <div className="space-y-2">
            <Label>Urgency Level</Label>
            <Select
              value={inputs.urgency}
              onValueChange={(value) =>
                setInputs({ ...inputs, urgency: value as "low" | "medium" | "critical" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    Low - Flexible timeline
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-warning" />
                    Medium - Business priority
                  </div>
                </SelectItem>
                <SelectItem value="critical">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-destructive" />
                    Critical - Immediate need
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Budget Availability</Label>
              <span className="text-sm text-muted-foreground">
                ${inputs.budget.toLocaleString()}
              </span>
            </div>
            <Slider
              value={[inputs.budget]}
              onValueChange={([value]) => setInputs({ ...inputs, budget: value })}
              min={25000}
              max={300000}
              step={5000}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$25K</span>
              <span>$300K</span>
            </div>
          </div>

          {/* Internal Inventory */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Current Internal Skill Inventory</Label>
              <span className="text-sm text-muted-foreground">
                {inputs.internalInventory}%
              </span>
            </div>
            <Slider
              value={[inputs.internalInventory]}
              onValueChange={([value]) => setInputs({ ...inputs, internalInventory: value })}
              min={0}
              max={100}
              step={5}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>No existing skills</span>
              <span>Fully staffed</span>
            </div>
          </div>

          {/* Time to Delivery */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Time-to-Delivery Requirement</Label>
              <span className="text-sm text-muted-foreground">
                {inputs.timeToDelivery} weeks
              </span>
            </div>
            <Slider
              value={[inputs.timeToDelivery]}
              onValueChange={([value]) => setInputs({ ...inputs, timeToDelivery: value })}
              min={4}
              max={52}
              step={2}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 month</span>
              <span>1 year</span>
            </div>
          </div>

          {/* Risk Tolerance */}
          <div className="space-y-2">
            <Label>Risk Tolerance Level</Label>
            <Select
              value={inputs.riskTolerance}
              onValueChange={(value) =>
                setInputs({ ...inputs, riskTolerance: value as "low" | "medium" | "high" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select risk tolerance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Minimize uncertainty</SelectItem>
                <SelectItem value="medium">Medium - Balanced approach</SelectItem>
                <SelectItem value="high">High - Accept calculated risks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" size="lg" onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-pulse" />
                Analyzing Scenarios...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Strategic Recommendation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output Panel */}
      <div className="space-y-4">
        {decision ? (
          <>
            {/* Primary Recommendation */}
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Strategic Recommendation
                  </CardTitle>
                  <Badge className={cn("border", strategyColors[decision.recommendedStrategy])}>
                    {strategyIcons[decision.recommendedStrategy]}
                    <span className="ml-1">{decision.recommendedStrategy}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {decision.justification}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3" /> Risk Score
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          decision.riskScore > 60
                            ? "text-destructive"
                            : decision.riskScore > 40
                              ? "text-warning"
                              : "text-success"
                        )}
                      >
                        {decision.riskScore}%
                      </span>
                    </div>
                    <Progress
                      value={decision.riskScore}
                      className={cn(
                        "h-2",
                        decision.riskScore > 60
                          ? "[&>div]:bg-destructive"
                          : decision.riskScore > 40
                            ? "[&>div]:bg-warning"
                            : "[&>div]:bg-success"
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> Sustainability
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          decision.sustainabilityScore > 70
                            ? "text-success"
                            : decision.sustainabilityScore > 40
                              ? "text-warning"
                              : "text-destructive"
                        )}
                      >
                        {decision.sustainabilityScore}%
                      </span>
                    </div>
                    <Progress
                      value={decision.sustainabilityScore}
                      className={cn(
                        "h-2",
                        decision.sustainabilityScore > 70
                          ? "[&>div]:bg-success"
                          : decision.sustainabilityScore > 40
                            ? "[&>div]:bg-warning"
                            : "[&>div]:bg-destructive"
                      )}
                    />
                  </div>
                </div>

                {/* Alternative Strategies */}
                <div className="pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">Alternative strategies:</span>
                  <div className="flex gap-2 mt-2">
                    {decision.alternativeStrategies.map((strategy) => (
                      <Badge
                        key={strategy}
                        variant="outline"
                        className={cn("text-xs", strategyColors[strategy])}
                      >
                        {strategy}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Cost & Time Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {decision.costComparison.map((item, index) => (
                    <div
                      key={item.strategy}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all",
                        index === 0 && "border-primary/50 bg-primary/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-md", strategyColors[item.strategy])}>
                          {strategyIcons[item.strategy]}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.strategy}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              ${(item.estimatedCost / 1000).toFixed(0)}K
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.timeToCapability}w
                            </span>
                          </div>
                        </div>
                      </div>
                      {index === 0 && (
                        <Badge variant="default" className="text-xs">
                          Recommended
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="h-full flex items-center justify-center min-h-[400px]">
            <CardContent className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Brain className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">AI Decision Engine Ready</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure your capability gap parameters and click analyze to receive
                  strategic recommendations
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ArrowRight className="h-4 w-4" />
                Fill out the form to begin
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
