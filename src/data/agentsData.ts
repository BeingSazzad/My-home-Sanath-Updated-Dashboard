export type AgentStatus = "active" | "pending" | "suspended" | "ACTIVE" | "INACTIVE";
export type AgentPlan   = "Basic" | "Professional" | "Enterprise";

export interface Agent {
  _id?: string;
  id?: string;
  initials?: string;
  profileImage?: string;
  name: string;
  email: string;
  agencyName?: string;
  phone?: string;
  plan?: string | { title?: string; tier?: string };
  totalListings?: number;
  revenue?: number;
  status: AgentStatus;
  createdAt?: string;
}

