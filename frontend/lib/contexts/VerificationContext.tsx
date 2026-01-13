'use client';

import React, { createContext, useContext, useState } from 'react';

interface AgentProgress {
  scan: number;
  visual: number;
  identity: number;
  courier: number;
  provenance: number;
  anomaly: number;
  risk: number;
}

interface VerificationState {
  currentStep: string;
  productId: string | null;
  agents: AgentProgress;
  completed: boolean;
  // New boolean flags for completion tracking
  isScanComplete: boolean;
  isIdentityComplete: boolean;
  isProvenanceComplete: boolean;
  isAnomalyComplete: boolean;
  isRiskComplete: boolean;
}

const defaultState: VerificationState = {
  currentStep: 'scan',
  productId: null,
  agents: {
    scan: 0,
    visual: 0,
    identity: 0,
    courier: 0,
    provenance: 0,
    anomaly: 0,
    risk: 0,
  },
  completed: false,
  // New boolean flags - all false for clean slate
  isScanComplete: false,
  isIdentityComplete: false,
  isProvenanceComplete: false,
  isAnomalyComplete: false,
  isRiskComplete: false,
};

const VerificationContext = createContext<{
  state: VerificationState;
  updateAgentProgress: (agent: keyof AgentProgress, progress: number) => void;
  setCurrentStep: (step: string) => void;
  setProductId: (id: string) => void;
  reset: () => void;
  // New completion marking functions
  markScanComplete: () => void;
  markIdentityComplete: () => void;
  markProvenanceComplete: () => void;
  markAnomalyComplete: () => void;
  markRiskComplete: () => void;
} | null>(null);

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<VerificationState>(defaultState);

  const updateAgentProgress = (agent: keyof AgentProgress, progress: number) => {
    setState(prev => ({
      ...prev,
      agents: {
        ...prev.agents,
        [agent]: Math.min(100, Math.max(0, progress)),
      },
    }));
  };

  const setCurrentStep = (step: string) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const setProductId = (id: string) => {
    setState(prev => ({ ...prev, productId: id }));
  };

  const reset = () => {
    setState(defaultState);
  };

  // New completion marking functions - set boolean flags
  const markScanComplete = () => {
    setState(prev => ({ ...prev, isScanComplete: true }));
  };

  const markIdentityComplete = () => {
    setState(prev => ({ ...prev, isIdentityComplete: true }));
  };

  const markProvenanceComplete = () => {
    setState(prev => ({ ...prev, isProvenanceComplete: true }));
  };

  const markAnomalyComplete = () => {
    setState(prev => ({ ...prev, isAnomalyComplete: true }));
  };

  const markRiskComplete = () => {
    setState(prev => ({ ...prev, isRiskComplete: true }));
  };

  return (
    <VerificationContext.Provider value={{
      state,
      updateAgentProgress,
      setCurrentStep,
      setProductId,
      reset,
      markScanComplete,
      markIdentityComplete,
      markProvenanceComplete,
      markAnomalyComplete,
      markRiskComplete,
    }}>
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification must be used within VerificationProvider');
  }
  return context;
};
