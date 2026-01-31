"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, UserPlus } from "lucide-react";
import { useEmployees } from "@/lib/employee-context";
import type { Employee } from "@/lib/talent-data";

const DEPARTMENTS = [
  "AI Research",
  "Quantum Lab",
  "Web3 Division",
  "Infrastructure",
  "Security",
  "Analytics",
  "Engineering",
  "Product",
  "Operations",
];

const COMMON_SKILLS = [
  "AI/ML Engineering",
  "Deep Learning",
  "Python",
  "Quantum Computing",
  "Blockchain Development",
  "Cloud Architecture",
  "Cybersecurity",
  "AWS",
  "Kubernetes",
  "React",
  "TypeScript",
  "Data Science",
  "DevOps",
  "Project Management",
];

interface FormData {
  name: string;
  role: string;
  department: string;
  skills: string[];
  criticality: Employee["criticality"];
  tenure: number;
  compensationPercentile: number;
  workloadStress: number;
  learningOpportunities: number;
  careerProgression: number;
  offerExposure: number;
  isKeyPerson: boolean;
}

const initialFormData: FormData = {
  name: "",
  role: "",
  department: "",
  skills: [],
  criticality: "medium",
  tenure: 1,
  compensationPercentile: 50,
  workloadStress: 50,
  learningOpportunities: 50,
  careerProgression: 50,
  offerExposure: 50,
  isKeyPerson: false,
};

export function AddEmployeeDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [customSkill, setCustomSkill] = useState("");
  const { addEmployee } = useEmployees();

  const calculateAttritionRisk = (data: FormData): number => {
    // Weighted calculation based on various factors
    const compensationFactor = (100 - data.compensationPercentile) * 0.25;
    const stressFactor = data.workloadStress * 0.2;
    const learningFactor = (100 - data.learningOpportunities) * 0.15;
    const progressionFactor = (100 - data.careerProgression) * 0.2;
    const offerFactor = data.offerExposure * 0.2;

    return Math.min(
      100,
      Math.round(compensationFactor + stressFactor + learningFactor + progressionFactor + offerFactor)
    );
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.role || !formData.department) {
      return;
    }

    const attritionRisk = calculateAttritionRisk(formData);

    addEmployee({
      name: formData.name,
      role: formData.role,
      department: formData.department,
      skills: formData.skills,
      criticality: formData.criticality,
      tenure: formData.tenure,
      attritionRisk,
      compensationPercentile: formData.compensationPercentile,
      workloadStress: formData.workloadStress,
      learningOpportunities: formData.learningOpportunities,
      careerProgression: formData.careerProgression,
      offerExposure: formData.offerExposure,
      isKeyPerson: formData.isKeyPerson,
    });

    setFormData(initialFormData);
    setOpen(false);
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleCustomSkillAdd = () => {
    if (customSkill.trim()) {
      addSkill(customSkill.trim());
      setCustomSkill("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Employee</DialogTitle>
          <DialogDescription>
            Enter employee details to add them to the talent intelligence system.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="e.g., John Smith"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role / Title</Label>
              <Input
                id="role"
                placeholder="e.g., Senior Engineer"
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Criticality Level</Label>
              <Select
                value={formData.criticality}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, criticality: value as Employee["criticality"] }))
                }
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tenure (Years)</Label>
              <Input
                type="number"
                min={0}
                max={40}
                value={formData.tenure}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tenure: Number.parseInt(e.target.value) || 0 }))
                }
                className="bg-input border-border"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="keyPerson"
                checked={formData.isKeyPerson}
                onChange={(e) => setFormData((prev) => ({ ...prev, isKeyPerson: e.target.checked }))}
                className="h-4 w-4 rounded border-border"
              />
              <Label htmlFor="keyPerson" className="cursor-pointer">
                Key Person (Critical Knowledge Holder)
              </Label>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom skill..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCustomSkillAdd()}
                className="bg-input border-border"
              />
              <Button type="button" variant="outline" size="icon" onClick={handleCustomSkillAdd}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {COMMON_SKILLS.filter((s) => !formData.skills.includes(s)).map((skill) => (
                <Button
                  key={skill}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => addSkill(skill)}
                >
                  + {skill}
                </Button>
              ))}
            </div>
          </div>

          {/* Risk Factors */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Risk Assessment Factors</Label>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Compensation Percentile</span>
                  <span className="text-muted-foreground">{formData.compensationPercentile}%</span>
                </div>
                <Slider
                  value={[formData.compensationPercentile]}
                  onValueChange={([value]) =>
                    setFormData((prev) => ({ ...prev, compensationPercentile: value }))
                  }
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Workload Stress Level</span>
                  <span className="text-muted-foreground">{formData.workloadStress}%</span>
                </div>
                <Slider
                  value={[formData.workloadStress]}
                  onValueChange={([value]) =>
                    setFormData((prev) => ({ ...prev, workloadStress: value }))
                  }
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Learning Opportunities</span>
                  <span className="text-muted-foreground">{formData.learningOpportunities}%</span>
                </div>
                <Slider
                  value={[formData.learningOpportunities]}
                  onValueChange={([value]) =>
                    setFormData((prev) => ({ ...prev, learningOpportunities: value }))
                  }
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Career Progression</span>
                  <span className="text-muted-foreground">{formData.careerProgression}%</span>
                </div>
                <Slider
                  value={[formData.careerProgression]}
                  onValueChange={([value]) =>
                    setFormData((prev) => ({ ...prev, careerProgression: value }))
                  }
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>External Offer Exposure</span>
                  <span className="text-muted-foreground">{formData.offerExposure}%</span>
                </div>
                <Slider
                  value={[formData.offerExposure]}
                  onValueChange={([value]) =>
                    setFormData((prev) => ({ ...prev, offerExposure: value }))
                  }
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            {/* Calculated Risk Preview */}
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Calculated Attrition Risk</span>
                <span
                  className={`text-lg font-bold ${
                    calculateAttritionRisk(formData) > 70
                      ? "text-destructive"
                      : calculateAttritionRisk(formData) > 50
                        ? "text-warning"
                        : "text-success"
                  }`}
                >
                  {calculateAttritionRisk(formData)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on compensation, stress, learning, progression, and market exposure factors
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.role || !formData.department}
          >
            Add Employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
