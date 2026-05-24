export const PLATFORM_PLAN_DURATION = {
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  HALF_YEARLY: "HALF_YEARLY",
  YEARLY: "YEARLY",
} as const;
export type PLATFORM_PLAN_DURATION = typeof PLATFORM_PLAN_DURATION[keyof typeof PLATFORM_PLAN_DURATION];

export const PLAN_TIER = {
  TRIAL: "TRIAL",
  STARTER: "STARTER",
  PROFESSIONAL: "PROFESSIONAL",
  PREMIUM: "PREMIUM",
} as const;
export type PLAN_TIER = typeof PLAN_TIER[keyof typeof PLAN_TIER];

export const PLAN_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;
export type PLAN_STATUS = typeof PLAN_STATUS[keyof typeof PLAN_STATUS];

export interface IPlanLimits {
  maxListings: number; // -1 = unlimited
}

export interface IPlanFeatures {
  leadAccess: boolean;
  listings: boolean;
  verifiedBadge: boolean;
  agentProfilePage: boolean;
}

export interface IPlanTrial {
  enabled: boolean;
  durationInMonths?: number; // only for TRIAL (e.g. 6)
  restrictions?: {
    featuredListing: boolean;
    leadAccess: boolean;
  };
}

export interface IPlanPricing {
  amount: number;
  currency: string; // "GBP", "USD", etc.
}

export interface IPlan {
  _id?: string;
  id?: string;
  title: string;
  description?: string;

  tier: PLAN_TIER;
  status: PLAN_STATUS;

  duration: PLATFORM_PLAN_DURATION;

  pricing: IPlanPricing;

  limits: IPlanLimits;
  features: IPlanFeatures;
  sortOrder?: number;
  paymentLink?: string;
  productId?: string;
  priceId?: string;
  trial?: IPlanTrial;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
