
import React, { useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Gem, 
  Crown, 
  ShieldCheck, 
  Star,
  Layers,
  Sparkles
} from "lucide-react";
import { 
  useGetPackagesQuery, 
  useAddPackageMutation, 
  useUpdatePackageMutation, 
  useDeletePackageMutation 
} from "../../../redux/features/packages/packageApi";
import { 
  PLAN_TIER, 
  PLAN_STATUS, 
  PLATFORM_PLAN_DURATION 
} from "../../../types/package.types";
import type { IPlan } from "../../../types/package.types";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

// ────────────────────────────────────────────────────────────────
// Stat Card Sub-component
// ────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: "gold" | "green" | "blue" | "navy";
}

const themeStyles: Record<string, { cardBg: string; border: string; iconBg: string; iconColor: string }> = {
  gold:   { cardBg: "bg-white", border: "border-amber-100", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
  green:  { cardBg: "bg-white", border: "border-emerald-100", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  blue:   { cardBg: "bg-white", border: "border-blue-100", iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  navy:   { cardBg: "bg-white", border: "border-[#0b3c6d]/20", iconBg: "bg-[#0b3c6d]/10", iconColor: "text-[#0b3c6d]" },
};

function StatCard({ icon, label, value, color }: StatCardProps) {
  const theme = themeStyles[color] || themeStyles.blue;
  return (
    <div className={`rounded-xl border ${theme.border} p-4 ${theme.cardBg} shadow-xs hover:shadow-md transition-all duration-300`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${theme.iconBg} ${theme.iconColor} flex items-center justify-center flex-shrink-0 shadow-xs`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
          <span className="text-xl font-extrabold text-slate-800">{value}</span>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Main Page Component
// ────────────────────────────────────────────────────────────────
export default function Packages() {
  const { data: rawPackages, isLoading, refetch } = useGetPackagesQuery({});
  const [addPackage, { isLoading: isAdding }] = useAddPackageMutation();
  const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation();
  const [deletePackage] = useDeletePackageMutation();

  const packagesList: IPlan[] = rawPackages || [];

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<IPlan | null>(null);

  // Form Fields — empty string defaults instead of 0
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tier, setTier] = useState<PLAN_TIER>(PLAN_TIER.STARTER);
  const [status, setStatus] = useState<PLAN_STATUS>(PLAN_STATUS.ACTIVE);
  const [duration, setDuration] = useState<PLATFORM_PLAN_DURATION>(PLATFORM_PLAN_DURATION.MONTHLY);
  
  // Pricing — empty string so placeholder shows
  const [priceAmount, setPriceAmount] = useState<string>("");
  const [currency, setCurrency] = useState("GBP");

  // Limits
  const [isUnlimitedListings, setIsUnlimitedListings] = useState(true);
  const [maxListings, setMaxListings] = useState<string>("");

  // Features Toggles
  const [leadAccess, setLeadAccess] = useState(false);
  const [featuredListing, setFeaturedListing] = useState(false);
  const [verifiedBadge, setVerifiedBadge] = useState(false);
  const [agentProfilePage, setAgentProfilePage] = useState(false);

  // Optional Fields — empty string defaults
  const [sortOrder, setSortOrder] = useState<string>("");
  const [paymentLink, setPaymentLink] = useState("");
  const [productId, setProductId] = useState("");
  const [priceId, setPriceId] = useState("");

  // Trial Config
  const [trialEnabled, setTrialEnabled] = useState(false);
  const [trialDurationInMonths, setTrialDurationInMonths] = useState<string>("1");
  const [trialRestrictionsFeaturedListing, setTrialRestrictionsFeaturedListing] = useState(false);
  const [trialRestrictionsLeadAccess, setTrialRestrictionsLeadAccess] = useState(false);

  // ────────────────────────────────────────────────────────────────
  // Reset Form
  // ────────────────────────────────────────────────────────────────
  const resetForm = () => {
    setEditingPlan(null);
    setTitle("");
    setDescription("");
    setTier(PLAN_TIER.STARTER);
    setStatus(PLAN_STATUS.ACTIVE);
    setDuration(PLATFORM_PLAN_DURATION.MONTHLY);
    setPriceAmount("");
    setCurrency("GBP");
    setIsUnlimitedListings(true);
    setMaxListings("");
    setLeadAccess(false);
    setFeaturedListing(false);
    setVerifiedBadge(false);
    setAgentProfilePage(false);
    setSortOrder("");
    setPaymentLink("");
    setProductId("");
    setPriceId("");
    setTrialEnabled(false);
    setTrialDurationInMonths("1");
    setTrialRestrictionsFeaturedListing(false);
    setTrialRestrictionsLeadAccess(false);
  };

  // ────────────────────────────────────────────────────────────────
  // Populate Form for Editing
  // ────────────────────────────────────────────────────────────────
  const handleEditClick = (plan: IPlan) => {
    setEditingPlan(plan);
    setTitle(plan.title ?? "");
    setDescription(plan.description ?? "");
    setTier(plan.tier);
    setStatus(plan.status);
    setDuration(plan.duration);
    // Convert numeric values to strings for controlled inputs
    setPriceAmount(plan.pricing?.amount !== undefined ? String(plan.pricing.amount) : "");
    setCurrency(plan.pricing?.currency ?? "GBP");
    setIsUnlimitedListings((plan.limits?.maxListings ?? -1) === -1);
    setMaxListings(plan.limits?.maxListings !== undefined && plan.limits.maxListings !== -1 ? String(plan.limits.maxListings) : "");
    setLeadAccess(plan.features?.leadAccess ?? false);
    setFeaturedListing(plan.features?.featuredListing ?? false);
    setVerifiedBadge(plan.features?.verifiedBadge ?? false);
    setAgentProfilePage(plan.features?.agentProfilePage ?? false);
    setSortOrder(plan.sortOrder !== undefined ? String(plan.sortOrder) : "");
    setPaymentLink(plan.paymentLink ?? "");
    setProductId(plan.productId ?? "");
    setPriceId(plan.priceId ?? "");
    
    // Trial Info
    setTrialEnabled(plan.trial?.enabled ?? false);
    setTrialDurationInMonths(plan.trial?.durationInMonths !== undefined ? String(plan.trial.durationInMonths) : "1");
    setTrialRestrictionsFeaturedListing(plan.trial?.restrictions?.featuredListing ?? false);
    setTrialRestrictionsLeadAccess(plan.trial?.restrictions?.leadAccess ?? false);

    setIsModalOpen(true);
  };

  // ────────────────────────────────────────────────────────────────
  // Handle Submit Form (Add or Edit)
  // ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Plan title is required");
      return;
    }

    const payload: Omit<IPlan, "_id"> = {
      title,
      description,
      tier,
      status,
      duration,
      pricing: {
        amount: priceAmount !== "" ? Number(priceAmount) : 0,
        currency,
      },
      limits: {
        maxListings: isUnlimitedListings ? -1 : (maxListings !== "" ? Number(maxListings) : 0),
      },
      features: {
        leadAccess,
        featuredListing,
        verifiedBadge,
        agentProfilePage,
      },
      sortOrder: sortOrder !== "" ? Number(sortOrder) : 0,
      paymentLink: paymentLink || undefined,
      productId: productId || undefined,
      priceId: priceId || undefined,
      trial: {
        enabled: trialEnabled,
        durationInMonths: trialEnabled ? Number(trialDurationInMonths) : undefined,
        restrictions: trialEnabled ? {
          featuredListing: trialRestrictionsFeaturedListing,
          leadAccess: trialRestrictionsLeadAccess
        } : undefined
      }
    };

    try {
      if (editingPlan) {
        await updatePackage({
          id: editingPlan._id || editingPlan.id || "",
          data: {
            title,
            description,
            pricing: {
              amount: priceAmount !== "" ? Number(priceAmount) : 0,
              currency,
            },
          },
        })?.unwrap();
        toast.success("Subscription plan updated successfully!");
      } else {
        await addPackage(payload)?.unwrap();
        toast.success("Subscription plan created successfully!");
      }
      refetch();
      setIsModalOpen(false);
      resetForm();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message ?? "An error occurred while saving the plan.");
    }
  };

  // ────────────────────────────────────────────────────────────────
  // Handle Delete Plan
  // ────────────────────────────────────────────────────────────────
  const handleDeleteClick = async (planId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this! This subscription plan will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#fff",
      color: "#1F2937"
    });

    if (result.isConfirmed) {
      try {
        await deletePackage(planId).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "Plan has been successfully deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        Swal.fire({
          title: "Failed!",
          text: err?.data?.message ?? "Failed to delete the package plan.",
          icon: "error"
        });
      }
    }
  };

  // Stats
  const totalPlans = packagesList.length;
  const activePlans = packagesList.filter(p => p.status === PLAN_STATUS.ACTIVE).length;
  const trialPlans = packagesList.filter(p => p.tier === PLAN_TIER.TRIAL).length;
  const premiumPlans = packagesList.filter(p => p.tier === PLAN_TIER.PREMIUM || p.tier === PLAN_TIER.PROFESSIONAL).length;

  const getDurationLabel = (dur: PLATFORM_PLAN_DURATION) => {
    switch (dur) {
      case PLATFORM_PLAN_DURATION.MONTHLY: return "1 month";
      case PLATFORM_PLAN_DURATION.QUARTERLY: return "3 months";
      case PLATFORM_PLAN_DURATION.HALF_YEARLY: return "6 months";
      case PLATFORM_PLAN_DURATION.YEARLY: return "12 months";
      default: return "1 month";
    }
  };

  const getTierIcon = (tierType: PLAN_TIER) => {
    switch (tierType) {
      case PLAN_TIER.TRIAL: return <Star className="w-5 h-5 text-gray-400" />;
      case PLAN_TIER.STARTER: return <Layers className="w-5 h-5 text-blue-500" />;
      case PLAN_TIER.PROFESSIONAL: return <Crown className="w-5 h-5 text-purple-500" />;
      case PLAN_TIER.PREMIUM: return <Gem className="w-5 h-5 text-amber-500 animate-pulse" />;
      default: return <Sparkles className="w-5 h-5 text-gray-500" />;
    }
  };

  // Shared input class using #0b3c6d as focus accent
  const isEditMode = !!editingPlan;
  const inputCls = "w-full h-11 px-3.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#0b3c6d] focus:ring-1 focus:ring-[#0b3c6d]/30 transition-colors placeholder:text-slate-400";
  const selectCls = "w-full h-11 px-3.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#0b3c6d] focus:ring-1 focus:ring-[#0b3c6d]/30 transition-colors";
  const labelCls = "text-xs font-bold uppercase tracking-wider text-slate-500 block";
  const lockedCls = isEditMode ? " opacity-60 cursor-not-allowed bg-slate-100" : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Package Plans</h1>
          <p className="text-sm text-slate-500 mt-1">Manage pricing plans, listing limits, and feature access for subscribers</p>
        </div>
        <Button
          className="gap-2 bg-[#0b3c6d] hover:bg-[#0b3c6d]/90 text-white shadow-md font-semibold px-5 py-2.5 rounded-xl transition-all"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <Plus size={18} />
          Add New Plan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Layers size={18} />} label="Total Plans" value={totalPlans} color="navy" />
        <StatCard icon={<ShieldCheck size={18} />} label="Active Plans" value={activePlans} color="green" />
        <StatCard icon={<Star size={18} />} label="Trial Plans" value={trialPlans} color="blue" />
        <StatCard icon={<Gem size={18} />} label="Premium & Pro Plans" value={premiumPlans} color="gold" />
      </div>

      {/* Cards Layout */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-[#0b3c6d] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium animate-pulse">Loading subscription plans...</p>
        </div>
      ) : packagesList.length === 0 ? (
        <Card className="border border-dashed border-slate-200 py-16 text-center shadow-xs">
          <CardContent className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-400">
              <Layers size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No subscription plans found</h3>
            <p className="text-sm text-gray-500 max-w-sm mt-1">Get started by creating your very first subscription package plan for subscribers.</p>
            <Button
              className="mt-5 gap-2 bg-[#0b3c6d] hover:bg-[#0b3c6d]/90 text-white"
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
            >
              <Plus size={16} />
              Create A Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packagesList.map((plan) => {
            const isActive = plan.status === PLAN_STATUS.ACTIVE;
            const currencySymbol = plan.pricing?.currency === "GBP" ? "£" : plan.pricing?.currency === "USD" ? "$" : plan.pricing?.currency || "";
            const isTrial = plan.tier === PLAN_TIER.TRIAL;

            return (
              <div 
                key={plan._id || plan.id}
                className="relative rounded-2xl bg-slate-950 border border-slate-900 shadow-xl overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col h-full min-h-[500px]"
              >
                <div className={`h-1.5 w-full ${
                  plan.tier === PLAN_TIER.PREMIUM ? "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" :
                  plan.tier === PLAN_TIER.PROFESSIONAL ? "bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-600" :
                  isTrial ? "bg-gradient-to-r from-gray-400 via-slate-500 to-gray-600" :
                  "bg-gradient-to-r from-[#0b3c6d] via-blue-600 to-[#0b3c6d]"
                }`} />

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-slate-900 border border-slate-800 text-slate-300 rounded-lg flex items-center gap-1.5 shadow-xs">
                      {getDurationLabel(plan.duration)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isActive 
                          ? "bg-emerald-950/50 text-emerald-400 border-emerald-800" 
                          : "bg-slate-900 text-slate-400 border-slate-800"
                      }`}>
                        {plan.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                      {plan.title}
                    </h3>
                    <div className="shrink-0 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 shadow-xs">
                      {getTierIcon(plan.tier)}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 font-normal leading-relaxed mb-6 line-clamp-3">
                    {plan.description || "No description provided for this plan."}
                  </p>

                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white tracking-tight">
                      {currencySymbol}{plan.pricing?.amount}
                    </span>
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      / {plan.duration === PLATFORM_PLAN_DURATION.MONTHLY ? "mo" : 
                         plan.duration === PLATFORM_PLAN_DURATION.QUARTERLY ? "quarter" :
                         plan.duration === PLATFORM_PLAN_DURATION.HALF_YEARLY ? "6mo" : "yr"}
                    </span>
                  </div>

                  <div className="border-t border-slate-900/80 pt-4 mb-6">
                    <div className="flex justify-between items-center text-xs mb-2.5">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Listing Limit</span>
                      <span className="text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {plan.limits?.maxListings === -1 ? "Unlimited" : `${plan.limits?.maxListings} Listings`}
                      </span>
                    </div>
                    {plan.trial?.enabled && (
                      <div className="flex justify-between items-center text-xs mb-2.5">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Free Trial</span>
                        <span className="text-emerald-400 font-semibold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
                          {plan.trial.durationInMonths} Months
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    <span className="text-slate-500 uppercase tracking-widest text-[9px] font-bold block mb-1">Features Included</span>
                    
                    {[
                      { flag: plan.features?.leadAccess, label: "Lead Access & Inquiry Management" },
                      { flag: plan.features?.featuredListing, label: "Featured Listings Promotions" },
                      { flag: plan.features?.verifiedBadge, label: "Verified Agent Badge Indicator" },
                      { flag: plan.features?.agentProfilePage, label: "Custom Agent Profile Showcase Page" },
                    ].map(({ flag, label }) => (
                      <div key={label} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 size={14} className={flag ? "text-emerald-400 shrink-0" : "text-slate-700 shrink-0"} />
                        <span className={flag ? "text-slate-200" : "text-slate-500 line-through"}>{label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto border-t border-slate-900/80 pt-4 flex gap-2">
                    <Button
                      onClick={() => handleEditClick(plan)}
                      className="flex-1 gap-1.5 h-9 rounded-xl bg-[#0b3c6d] hover:bg-[#0b3c6d]/90 text-white shadow-md font-semibold text-xs transition-all"
                    >
                      <Edit3 size={13} />
                      Edit Plan
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(plan._id || plan.id || "")}
                      className="px-3 h-9 rounded-xl bg-[#0b3c6d] hover:bg-[#0b3c6d]/90 text-white shadow-md transition-all"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          Dialog: Add / Edit Plan  —  Light theme with #0b3c6d accents
      ────────────────────────────────────────────────────────── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-slate-800 border border-slate-200 rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-extrabold text-[#0b3c6d] flex items-center gap-2">
              <Layers className="text-[#0b3c6d]" />
              {editingPlan ? "Edit Subscription Plan" : "Add New Subscription Plan"}
            </DialogTitle>
            <p className="text-xs text-slate-400 font-medium">
              {isEditMode
                ? "You can update the plan title, description, and price. Other settings are locked."
                : "Configure plan settings, price structure, trial phases, and subscriber parameters."}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Row 1: Title & Tier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelCls}>Plan Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Starter Plan, Premium Access"
                  className={inputCls}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Plan Tier</label>
                <select
                  className={selectCls + lockedCls}
                  value={tier}
                  onChange={(e) => setTier(e.target.value as PLAN_TIER)}
                  disabled={isEditMode}
                >
                  <option value={PLAN_TIER.TRIAL}>Trial Package</option>
                  <option value={PLAN_TIER.STARTER}>Starter Package</option>
                  <option value={PLAN_TIER.PROFESSIONAL}>Professional Package</option>
                  <option value={PLAN_TIER.PREMIUM}>Premium Package</option>
                </select>
              </div>
            </div>

            {/* Row 2: Description */}
            <div className="space-y-1">
              <label className={labelCls}>Short Description</label>
              <textarea
                placeholder="A high-level description outlining what is included and who this subscription is tailored for."
                className="w-full min-h-16 max-h-24 p-3 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#0b3c6d] focus:ring-1 focus:ring-[#0b3c6d]/30 transition-colors placeholder:text-slate-400 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Row 3: Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className={labelCls}>Price Amount</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 149"
                  className={inputCls}
                  value={priceAmount}
                  onChange={(e) => setPriceAmount(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Currency</label>
                <input
                  type="text"
                  placeholder="e.g. GBP, USD"
                  className={inputCls + " uppercase"}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Billing Period</label>
                <select
                  className={selectCls + lockedCls}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as PLATFORM_PLAN_DURATION)}
                  disabled={isEditMode}
                >
                  <option value={PLATFORM_PLAN_DURATION.MONTHLY}>Monthly</option>
                  <option value={PLATFORM_PLAN_DURATION.QUARTERLY}>Quarterly (3 Months)</option>
                  <option value={PLATFORM_PLAN_DURATION.HALF_YEARLY}>Half Yearly (6 Months)</option>
                  <option value={PLATFORM_PLAN_DURATION.YEARLY}>Yearly (12 Months)</option>
                </select>
              </div>
            </div>

            {/* Row 4: Limits, Status, Sort */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className={labelCls}>Max Listings Limit</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    disabled={isEditMode || isUnlimitedListings}
                    placeholder="e.g. 10"
                    className={inputCls + (isUnlimitedListings || isEditMode ? " opacity-40 cursor-not-allowed" : "") + lockedCls}
                    value={isUnlimitedListings ? "" : maxListings}
                    onChange={(e) => setMaxListings(e.target.value)}
                  />
                  <label className={`flex items-center gap-1.5 select-none whitespace-nowrap ${isEditMode ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                    <input
                      type="checkbox"
                      checked={isUnlimitedListings}
                      onChange={(e) => setIsUnlimitedListings(e.target.checked)}
                      disabled={isEditMode}
                      className="rounded border-slate-300 text-[#0b3c6d] focus:ring-[#0b3c6d]/30 w-4 h-4 cursor-pointer accent-[#0b3c6d] disabled:cursor-not-allowed"
                    />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">∞</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelCls}>Plan Status</label>
                <select
                  className={selectCls + lockedCls}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PLAN_STATUS)}
                  disabled={isEditMode}
                >
                  <option value={PLAN_STATUS.ACTIVE}>ACTIVE (Live)</option>
                  <option value={PLAN_STATUS.INACTIVE}>INACTIVE (Draft/Hidden)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className={labelCls}>Sort Order</label>
                <input
                  type="number"
                  placeholder="e.g. 1, 2, 3"
                  className={inputCls + lockedCls}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  disabled={isEditMode}
                />
              </div>
            </div>

            {/* Row 6: Features */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 block">Included Features & Privileges</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: "leadAccess",
                    checked: leadAccess,
                    onChange: setLeadAccess,
                    label: "Lead Access",
                    desc: "Allows viewing generated inquiries & email leads."
                  },
                  {
                    id: "featuredListing",
                    checked: featuredListing,
                    onChange: setFeaturedListing,
                    label: "Featured Listings",
                    desc: "Allows marking and promoting listings to prime slots."
                  },
                  {
                    id: "verifiedBadge",
                    checked: verifiedBadge,
                    onChange: setVerifiedBadge,
                    label: "Verified Agent Badge",
                    desc: "Gives a badge next to the profile name for authenticity."
                  },
                ].map(({ id, checked, onChange, label, desc }) => (
                  <label
                    key={id}
                    className={`flex items-center gap-3 p-3.5 rounded-lg border select-none transition-colors ${
                      isEditMode ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                    } ${
                      checked
                        ? "bg-[#0b3c6d]/5 border-[#0b3c6d]/30"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => onChange(e.target.checked)}
                      disabled={isEditMode}
                      className="rounded border-slate-300 w-5 h-5 cursor-pointer accent-[#0b3c6d] disabled:cursor-not-allowed"
                    />
                    <div>
                      <span className={`text-xs font-bold block ${checked ? "text-[#0b3c6d]" : "text-slate-700"}`}>{label}</span>
                      <span className="text-[10px] text-slate-400 block">{desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Row 7: Trial */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 block">Trial Period Settings</span>
                <label className={`flex items-center gap-2 select-none ${isEditMode ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                  <input
                    type="checkbox"
                    checked={trialEnabled}
                    onChange={(e) => setTrialEnabled(e.target.checked)}
                    disabled={isEditMode}
                    className="rounded border-slate-300 w-5 h-5 cursor-pointer accent-[#0b3c6d] disabled:cursor-not-allowed"
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0b3c6d]">Enable Trial</span>
                </label>
              </div>

              {trialEnabled && (
                <div className="p-4 rounded-xl bg-[#0b3c6d]/5 border border-[#0b3c6d]/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={labelCls}>Trial Duration (Months)</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 1"
                        className={inputCls + lockedCls}
                        value={trialDurationInMonths}
                        onChange={(e) => setTrialDurationInMonths(e.target.value)}
                        disabled={isEditMode}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={labelCls}>Restrictions During Trial Phase</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className={`flex items-center gap-2.5 select-none ${isEditMode ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                        <input
                          type="checkbox"
                          checked={trialRestrictionsFeaturedListing}
                          onChange={(e) => setTrialRestrictionsFeaturedListing(e.target.checked)}
                          disabled={isEditMode}
                          className="rounded border-slate-300 text-red-500 w-4 h-4 cursor-pointer accent-red-500 disabled:cursor-not-allowed"
                        />
                        <span className="text-xs text-slate-600">Disable Featured Listings Promotions</span>
                      </label>
                      <label className={`flex items-center gap-2.5 select-none ${isEditMode ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                        <input
                          type="checkbox"
                          checked={trialRestrictionsLeadAccess}
                          onChange={(e) => setTrialRestrictionsLeadAccess(e.target.checked)}
                          disabled={isEditMode}
                          className="rounded border-slate-300 text-red-500 w-4 h-4 cursor-pointer accent-red-500 disabled:cursor-not-allowed"
                        />
                        <span className="text-xs text-slate-600">Disable Direct Lead & Enquiry Access</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="h-11 px-6 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors text-sm font-semibold border border-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isAdding || isUpdating}
                className="h-11 px-8 rounded-lg bg-[#0b3c6d] hover:bg-[#0b3c6d]/90 text-white font-bold shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2"
              >
                {(isAdding || isUpdating) ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Layers size={16} />
                )}
                {editingPlan ? "Save Plan Changes" : "Create Plan"}
              </Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}