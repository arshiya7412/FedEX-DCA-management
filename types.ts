export enum UserRole {
  FEDEX_ADMIN = 'FEDEX_ADMIN',
  DCA_MANAGER = 'DCA_MANAGER'
}

export enum AgencyStatus {
  ACTIVE = 'Active',
  PROBATION = 'Probation',
  SUSPENDED = 'Suspended',
  ONBOARDING = 'Onboarding'
}

export interface Agency {
  id: string;
  name: string;
  region: string;
  status: AgencyStatus;
  complianceScore: number;
  recoveryRate: number;
  activeCases: number;
  contactEmail: string;
  lastAuditDate: string;
}

export interface SLAConfig {
  firstContactDays: number;
  updateFrequencyDays: number;
  maxCaseDurationDays: number;
  promiseFollowUpDays: number;
  escalationInactivityDays: number;
}

export enum CaseStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  NOT_REACHABLE = 'Not Reachable',
  PROMISE_TO_PAY = 'Promise to Pay',
  PAID = 'Paid',
  BREACHED = 'SLA Breached'
}

export interface ActivityLog {
  id: string;
  date: string;
  action: string;
  user: string; // "DCA Agent" or "FedEx System"
  details: string;
}

export interface Case {
  id: string;
  customerName: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: CaseStatus;
  priority: 'High' | 'Medium' | 'Low';
  slaDueDate: string;
  dcaId: string | null;
  logs: ActivityLog[];
  remarks?: string;
  promiseDate?: string;
  phone?: string;
  email?: string;
}

export interface DebtBatch {
  id: string;
  batchName: string;
  totalAmount: number;
  currency: string;
  assignedAgencyId: string | null;
  status: 'Unassigned' | 'Assigned' | 'Closed';
  createdDate: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}
