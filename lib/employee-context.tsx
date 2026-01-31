"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { Employee, employees as initialEmployees } from "./talent-data";

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, "id">) => void;
  removeEmployee: (id: string) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  getEmployeeById: (id: string) => Employee | undefined;
  refreshData: () => Promise<void>;
  isRefreshing: boolean;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Refresh with slightly randomized attrition risks to simulate real-time updates
    setEmployees((prev) =>
      prev.map((emp) => ({
        ...emp,
        attritionRisk: Math.min(100, Math.max(0, emp.attritionRisk + Math.floor(Math.random() * 10) - 5)),
      }))
    );
    setIsRefreshing(false);
  }, []);

  const addEmployee = useCallback((employee: Omit<Employee, "id">) => {
    const newEmployee: Employee = {
      ...employee,
      id: `emp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setEmployees((prev) => [...prev, newEmployee]);
  }, []);

  const removeEmployee = useCallback((id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  }, []);

  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp))
    );
  }, []);

  const getEmployeeById = useCallback(
    (id: string) => {
      return employees.find((emp) => emp.id === id);
    },
    [employees]
  );

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        addEmployee,
        removeEmployee,
        updateEmployee,
        getEmployeeById,
        refreshData,
        isRefreshing,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error("useEmployees must be used within an EmployeeProvider");
  }
  return context;
}
