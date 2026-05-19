export type AgentStatus = "active" | "pending" | "suspended";
export type AgentPlan   = "Basic" | "Professional" | "Enterprise";

export interface Agent {
  id: string;
  initials: string;
  name: string;
  email: string;
  agency: string;
  phone: string;
  plan: AgentPlan;
  listings: number;
  revenue: number;
  status: AgentStatus;
  joined: string;
}

export const agentsData: Agent[] = [
  { id:"1", initials:"S", name:"Sarah Williams",  email:"sarah@premierproperties.com", agency:"Premier Properties Ltd",   phone:"+44 7700 900 123", plan:"Professional", listings:34,  revenue:1188, status:"active",  joined:"15 Jun 2023" },
  { id:"2", initials:"J", name:"James Anderson",  email:"james@cityhomes.co.uk",       agency:"City Homes Estate Agents", phone:"+44 7700 900 456", plan:"Enterprise",   listings:127, revenue:2388, status:"active",  joined:"20 Feb 2023" },
  { id:"3", initials:"E", name:"Emma Thompson",   email:"emma@luxeestates.com",        agency:"Luxe Estates",             phone:"+44 7700 900 789", plan:"Basic",        listings:8,   revenue:147,  status:"active",  joined:"10 Jan 2024" },
  { id:"4", initials:"M", name:"Michael Brown",   email:"michael@brownrealty.com",     agency:"Brown Realty",             phone:"+44 7700 900 012", plan:"Professional", listings:0,   revenue:0,    status:"pending", joined:"1 Mar 2024"  },
  { id:"5", initials:"S", name:"Sophie Martinez", email:"sophie@modernliving.co.uk",   agency:"Modern Living Properties", phone:"+44 7700 900 345", plan:"Enterprise",   listings:89,  revenue:1776, status:"active",  joined:"5 May 2023"  },
];