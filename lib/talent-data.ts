// Mock talent market data and utilities

export interface Employee {
  id: string;
  name: string;
  role: string;
  skills: string[];
  criticality: "low" | "medium" | "high" | "critical";
  tenure: number; // years
  attritionRisk: number; // 0-100
  compensationPercentile: number; // 0-100
  workloadStress: number; // 0-100
  learningOpportunities: number; // 0-100
  careerProgression: number; // 0-100
  offerExposure: number; // 0-100
  department: string;
  isKeyPerson: boolean;
}

export interface SkillGap {
  skill: string;
  currentCapacity: number;
  requiredCapacity: number;
  gapPercentage: number;
  marketScarcity: "low" | "medium" | "high" | "extreme";
  avgHiringTime: number; // weeks
  avgSalary: number;
  trainingCost: number;
  trainingTime: number; // weeks
}

export interface Team {
  id: string;
  name: string;
  members: string[];
  knowledgeConcentration: number; // 0-100 (higher = more concentrated, riskier)
  criticalSkills: string[];
  backupCoverage: number; // 0-100
}

export const skillGaps: SkillGap[] = [
  {
    skill: "AI/ML Engineering",
    currentCapacity: 45,
    requiredCapacity: 100,
    gapPercentage: 55,
    marketScarcity: "extreme",
    avgHiringTime: 16,
    avgSalary: 185000,
    trainingCost: 25000,
    trainingTime: 24,
  },
  {
    skill: "Quantum Computing",
    currentCapacity: 15,
    requiredCapacity: 40,
    gapPercentage: 62.5,
    marketScarcity: "extreme",
    avgHiringTime: 24,
    avgSalary: 220000,
    trainingCost: 45000,
    trainingTime: 36,
  },
  {
    skill: "Blockchain Development",
    currentCapacity: 60,
    requiredCapacity: 85,
    gapPercentage: 29.4,
    marketScarcity: "high",
    avgHiringTime: 12,
    avgSalary: 165000,
    trainingCost: 18000,
    trainingTime: 16,
  },
  {
    skill: "Cloud Architecture",
    currentCapacity: 75,
    requiredCapacity: 95,
    gapPercentage: 21.1,
    marketScarcity: "medium",
    avgHiringTime: 8,
    avgSalary: 155000,
    trainingCost: 12000,
    trainingTime: 12,
  },
  {
    skill: "Cybersecurity",
    currentCapacity: 55,
    requiredCapacity: 90,
    gapPercentage: 38.9,
    marketScarcity: "high",
    avgHiringTime: 10,
    avgSalary: 160000,
    trainingCost: 15000,
    trainingTime: 14,
  },
];

export const employees: Employee[] = [
  {
    id: "emp-001",
    name: "Dr. Sarah Chen",
    role: "Principal AI Architect",
    skills: ["AI/ML Engineering", "Deep Learning", "Python"],
    criticality: "critical",
    tenure: 5,
    attritionRisk: 72,
    compensationPercentile: 65,
    workloadStress: 85,
    learningOpportunities: 40,
    careerProgression: 35,
    offerExposure: 90,
    department: "AI Research",
    isKeyPerson: true,
  },
  {
    id: "emp-002",
    name: "Marcus Williams",
    role: "Quantum Research Lead",
    skills: ["Quantum Computing", "Physics", "Python"],
    criticality: "critical",
    tenure: 3,
    attritionRisk: 85,
    compensationPercentile: 55,
    workloadStress: 90,
    learningOpportunities: 50,
    careerProgression: 30,
    offerExposure: 95,
    department: "Quantum Lab",
    isKeyPerson: true,
  },
  {
    id: "emp-003",
    name: "Elena Rodriguez",
    role: "Senior Blockchain Engineer",
    skills: ["Blockchain Development", "Solidity", "Rust"],
    criticality: "high",
    tenure: 4,
    attritionRisk: 45,
    compensationPercentile: 75,
    workloadStress: 60,
    learningOpportunities: 70,
    careerProgression: 65,
    offerExposure: 60,
    department: "Web3 Division",
    isKeyPerson: false,
  },
  {
    id: "emp-004",
    name: "James O'Connor",
    role: "Cloud Solutions Architect",
    skills: ["Cloud Architecture", "AWS", "Kubernetes"],
    criticality: "high",
    tenure: 6,
    attritionRisk: 35,
    compensationPercentile: 80,
    workloadStress: 55,
    learningOpportunities: 75,
    careerProgression: 70,
    offerExposure: 45,
    department: "Infrastructure",
    isKeyPerson: false,
  },
  {
    id: "emp-005",
    name: "Aisha Patel",
    role: "Cybersecurity Director",
    skills: ["Cybersecurity", "Penetration Testing", "Compliance"],
    criticality: "critical",
    tenure: 7,
    attritionRisk: 28,
    compensationPercentile: 85,
    workloadStress: 70,
    learningOpportunities: 60,
    careerProgression: 75,
    offerExposure: 55,
    department: "Security",
    isKeyPerson: true,
  },
  {
    id: "emp-006",
    name: "David Kim",
    role: "ML Engineer",
    skills: ["AI/ML Engineering", "TensorFlow", "MLOps"],
    criticality: "high",
    tenure: 2,
    attritionRisk: 58,
    compensationPercentile: 60,
    workloadStress: 75,
    learningOpportunities: 55,
    careerProgression: 45,
    offerExposure: 75,
    department: "AI Research",
    isKeyPerson: false,
  },
  {
    id: "emp-007",
    name: "Lisa Thompson",
    role: "Senior Data Scientist",
    skills: ["AI/ML Engineering", "Statistics", "Python"],
    criticality: "medium",
    tenure: 4,
    attritionRisk: 42,
    compensationPercentile: 70,
    workloadStress: 65,
    learningOpportunities: 65,
    careerProgression: 55,
    offerExposure: 50,
    department: "Analytics",
    isKeyPerson: false,
  },
  {
    id: "emp-008",
    name: "Robert Zhang",
    role: "DevOps Engineer",
    skills: ["Cloud Architecture", "CI/CD", "Terraform"],
    criticality: "medium",
    tenure: 3,
    attritionRisk: 38,
    compensationPercentile: 72,
    workloadStress: 60,
    learningOpportunities: 70,
    careerProgression: 60,
    offerExposure: 40,
    department: "Infrastructure",
    isKeyPerson: false,
  },
];

export const teams: Team[] = [
  {
    id: "team-001",
    name: "AI Research",
    members: ["emp-001", "emp-006", "emp-007"],
    knowledgeConcentration: 78,
    criticalSkills: ["AI/ML Engineering", "Deep Learning"],
    backupCoverage: 35,
  },
  {
    id: "team-002",
    name: "Quantum Lab",
    members: ["emp-002"],
    knowledgeConcentration: 95,
    criticalSkills: ["Quantum Computing"],
    backupCoverage: 10,
  },
  {
    id: "team-003",
    name: "Web3 Division",
    members: ["emp-003"],
    knowledgeConcentration: 85,
    criticalSkills: ["Blockchain Development", "Solidity"],
    backupCoverage: 25,
  },
  {
    id: "team-004",
    name: "Infrastructure",
    members: ["emp-004", "emp-008"],
    knowledgeConcentration: 45,
    criticalSkills: ["Cloud Architecture", "DevOps"],
    backupCoverage: 65,
  },
  {
    id: "team-005",
    name: "Security",
    members: ["emp-005"],
    knowledgeConcentration: 80,
    criticalSkills: ["Cybersecurity"],
    backupCoverage: 30,
  },
];

// Dashboard KPIs
export const dashboardMetrics = {
  talentRiskIndex: 68,
  capabilityReadinessScore: 54,
  hiringVsUpskilling: { hiring: 35, upskilling: 65 },
  retentionStability: 72,
  avgTimeToFill: 14, // weeks
  criticalRolesOpen: 8,
  atRiskEmployees: 4,
  budgetUtilization: 78,
};

// Historical trend data
export const trendData = [
  { month: "Jul", talentRisk: 58, capability: 62, retention: 78 },
  { month: "Aug", talentRisk: 62, capability: 58, retention: 76 },
  { month: "Sep", talentRisk: 65, capability: 55, retention: 74 },
  { month: "Oct", talentRisk: 63, capability: 52, retention: 73 },
  { month: "Nov", talentRisk: 66, capability: 53, retention: 71 },
  { month: "Dec", talentRisk: 68, capability: 54, retention: 72 },
];

export const costComparisonData = [
  { strategy: "External Hire", cost: 185000, time: 16, risk: 65, sustainability: 45 },
  { strategy: "Internal Upskill", cost: 45000, time: 24, risk: 25, sustainability: 85 },
  { strategy: "Contractor", cost: 240000, time: 4, risk: 75, sustainability: 20 },
  { strategy: "Role Redesign", cost: 15000, time: 8, risk: 40, sustainability: 70 },
  { strategy: "AI Augmentation", cost: 80000, time: 12, risk: 35, sustainability: 90 },
];

export type Strategy =
  | "External Hiring"
  | "Internal Upskilling"
  | "Role Redesign"
  | "Contractor/Partner"
  | "AI Augmentation";

export interface DecisionInputs {
  skill: string;
  urgency: "low" | "medium" | "critical";
  budget: number;
  internalInventory: number;
  timeToDelivery: number;
  riskTolerance: "low" | "medium" | "high";
}

export interface DecisionOutput {
  recommendedStrategy: Strategy;
  costComparison: {
    strategy: Strategy;
    estimatedCost: number;
    timeToCapability: number;
  }[];
  riskScore: number;
  sustainabilityScore: number;
  justification: string;
  alternativeStrategies: Strategy[];
}

export function calculateDecision(inputs: DecisionInputs): DecisionOutput {
  const skillData = skillGaps.find((s) => s.skill === inputs.skill) || skillGaps[0];

  // Calculate scores for each strategy
  const strategies: {
    strategy: Strategy;
    score: number;
    cost: number;
    time: number;
    risk: number;
    sustainability: number;
  }[] = [];

  // External Hiring
  const hiringScore = calculateStrategyScore(
    inputs,
    skillData,
    skillData.avgSalary * 1.3, // Total cost including hiring
    skillData.avgHiringTime,
    skillData.marketScarcity === "extreme" ? 80 : skillData.marketScarcity === "high" ? 60 : 40,
    40
  );
  strategies.push({
    strategy: "External Hiring",
    ...hiringScore,
  });

  // Internal Upskilling
  const upskillScore = calculateStrategyScore(
    inputs,
    skillData,
    skillData.trainingCost,
    skillData.trainingTime,
    20,
    85
  );
  strategies.push({
    strategy: "Internal Upskilling",
    ...upskillScore,
  });

  // Role Redesign
  const redesignScore = calculateStrategyScore(inputs, skillData, 25000, 8, 35, 75);
  strategies.push({
    strategy: "Role Redesign",
    ...redesignScore,
  });

  // Contractor/Partner
  const contractorScore = calculateStrategyScore(
    inputs,
    skillData,
    skillData.avgSalary * 1.5,
    4,
    70,
    25
  );
  strategies.push({
    strategy: "Contractor/Partner",
    ...contractorScore,
  });

  // AI Augmentation
  const aiScore = calculateStrategyScore(inputs, skillData, 85000, 10, 30, 90);
  strategies.push({
    strategy: "AI Augmentation",
    ...aiScore,
  });

  // Sort by score
  strategies.sort((a, b) => b.score - a.score);
  const recommended = strategies[0];

  const justifications: Record<Strategy, string> = {
    "External Hiring": `Given the ${inputs.urgency} urgency and current market conditions for ${inputs.skill}, external hiring is recommended. While the ${skillData.marketScarcity} market scarcity presents challenges, your budget of $${inputs.budget.toLocaleString()} and ${inputs.timeToDelivery}-week timeline make this viable. Consider aggressive sourcing strategies and competitive compensation packages to attract top talent.`,
    "Internal Upskilling": `Based on your ${inputs.riskTolerance} risk tolerance and emphasis on sustainable capability building, internal upskilling is the optimal strategy for ${inputs.skill}. Your existing team has foundational skills that can be developed over ${skillData.trainingTime} weeks at approximately $${skillData.trainingCost.toLocaleString()}. This approach minimizes knowledge dependency risks and builds long-term organizational resilience.`,
    "Role Redesign": `Given budget constraints and current internal capabilities at ${inputs.internalInventory}%, role redesign offers an efficient path forward. By redistributing ${inputs.skill} responsibilities across existing roles and potentially automating routine tasks, you can address capability gaps without significant hiring investment while maintaining organizational agility.`,
    "Contractor/Partner": `Your ${inputs.urgency} urgency level and ${inputs.timeToDelivery}-week delivery requirement favor a contractor/partner model for ${inputs.skill}. This approach provides immediate capability access while you develop longer-term talent strategies. Consider this as a bridge solution with clear knowledge transfer protocols to mitigate dependency risks.`,
    "AI Augmentation": `For ${inputs.skill}, AI augmentation presents a compelling long-term strategy. This approach offers the highest sustainability score and addresses capability gaps through technology rather than scarce human talent. Given the ${skillData.marketScarcity} market scarcity, reducing human dependency for routine ${inputs.skill} tasks is strategically sound.`,
  };

  return {
    recommendedStrategy: recommended.strategy,
    costComparison: strategies.map((s) => ({
      strategy: s.strategy,
      estimatedCost: s.cost,
      timeToCapability: s.time,
    })),
    riskScore: recommended.risk,
    sustainabilityScore: recommended.sustainability,
    justification: justifications[recommended.strategy],
    alternativeStrategies: strategies.slice(1, 3).map((s) => s.strategy),
  };
}

function calculateStrategyScore(
  inputs: DecisionInputs,
  skillData: SkillGap,
  cost: number,
  time: number,
  risk: number,
  sustainability: number
): { score: number; cost: number; time: number; risk: number; sustainability: number } {
  let score = 0;

  // Budget fit (0-25 points)
  if (cost <= inputs.budget) {
    score += 25 * (1 - cost / inputs.budget);
  }

  // Time fit (0-30 points) - more important for critical urgency
  const urgencyMultiplier =
    inputs.urgency === "critical" ? 1.5 : inputs.urgency === "medium" ? 1 : 0.7;
  if (time <= inputs.timeToDelivery) {
    score += 30 * (1 - time / inputs.timeToDelivery) * urgencyMultiplier;
  } else {
    score -= 15 * urgencyMultiplier;
  }

  // Risk alignment (0-20 points)
  const riskThreshold =
    inputs.riskTolerance === "low" ? 30 : inputs.riskTolerance === "medium" ? 50 : 70;
  if (risk <= riskThreshold) {
    score += 20 * (1 - risk / 100);
  } else {
    score -= 10;
  }

  // Sustainability (0-25 points)
  score += 25 * (sustainability / 100);

  // Internal capability bonus
  if (inputs.internalInventory > 50) {
    score += 10;
  }

  return { score, cost, time, risk, sustainability };
}

export function calculateAttritionRisk(employee: Employee): {
  riskScore: number;
  factors: { factor: string; impact: number; suggestion: string }[];
} {
  const factors: { factor: string; impact: number; suggestion: string }[] = [];

  // Compensation competitiveness
  if (employee.compensationPercentile < 60) {
    factors.push({
      factor: "Below-market compensation",
      impact: Math.round((60 - employee.compensationPercentile) * 0.8),
      suggestion: `Consider salary adjustment to ${Math.min(80, employee.compensationPercentile + 15)}th percentile`,
    });
  }

  // Workload stress
  if (employee.workloadStress > 70) {
    factors.push({
      factor: "High workload stress",
      impact: Math.round((employee.workloadStress - 70) * 0.7),
      suggestion: "Redistribute workload and consider additional team support",
    });
  }

  // Learning opportunities
  if (employee.learningOpportunities < 50) {
    factors.push({
      factor: "Limited learning opportunities",
      impact: Math.round((50 - employee.learningOpportunities) * 0.5),
      suggestion: "Assign stretch projects and provide training budget",
    });
  }

  // Career progression
  if (employee.careerProgression < 50) {
    factors.push({
      factor: "Unclear career path",
      impact: Math.round((50 - employee.careerProgression) * 0.6),
      suggestion: "Create clear promotion roadmap with mentorship program",
    });
  }

  // External offer exposure
  if (employee.offerExposure > 70) {
    factors.push({
      factor: "High external offer exposure",
      impact: Math.round((employee.offerExposure - 70) * 0.9),
      suggestion: "Proactive retention package with equity refresh",
    });
  }

  return {
    riskScore: employee.attritionRisk,
    factors: factors.sort((a, b) => b.impact - a.impact),
  };
}

export function getRetentionActions(employee: Employee): string[] {
  const actions: string[] = [];

  if (employee.compensationPercentile < 70) {
    actions.push("Salary adjustment to competitive market rate");
  }
  if (employee.learningOpportunities < 60) {
    actions.push("Skill growth path with dedicated training allocation");
  }
  if (employee.careerProgression < 60) {
    actions.push("Internal mobility opportunity mapping");
  }
  if (employee.workloadStress > 65) {
    actions.push("Workload rebalancing and support resources");
  }
  if (employee.isKeyPerson) {
    actions.push("Executive mentorship and strategic project involvement");
    actions.push("Reduced dependency planning with knowledge transfer");
  }

  return actions;
}
