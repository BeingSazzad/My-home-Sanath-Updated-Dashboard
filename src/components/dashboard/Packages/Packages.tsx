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
  color: "gold" | "green" | "blue" | "purple";
}

const themeStyles: Record<string, { cardBg: string; border: string; iconBg: string; iconColor: string }> = {
  gold:   { cardBg: "bg-white", border: "border-amber-100", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
  green:  { cardBg: "bg-white", border: "border-emerald-100", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  blue:   { cardBg: "bg-white", border: "border-blue-100", iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  purple: { cardBg: "bg-white", border: "border-purple-100", iconBg: "bg-purple-50", iconColor: "text-purple-600" },
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

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tier, setTier] = useState<PLAN_TIER>(PLAN_TIER.STARTER);
  const [status, setStatus] = useState<PLAN_STATUS>(PLAN_STATUS.ACTIVE);
  const [duration, setDuration] = useState<PLATFORM_PLAN_DURATION>(PLATFORM_PLAN_DURATION.MONTHLY);
  
  // Pricing
  const [priceAmount, setPriceAmount] = useState<number>(0);
  const [currency, setCurrency] = useState("GBP");

  // Limits
  const [isUnlimitedListings, setIsUnlimitedListings] = useState(true);
  const [maxListings, setMaxListings] = useState<number>(-1);

  // Features Toggles
  const [leadAccess, setLeadAccess] = useState(false);
  const [featuredListing, setFeaturedListing] = useState(false);
  const [verifiedBadge, setVerifiedBadge] = useState(false);
  const [agentProfilePage, setAgentProfilePage] = useState(false);

  // Optional Fields
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [paymentLink, setPaymentLink] = useState("");
  const [productId, setProductId] = useState("");
  const [priceId, setPriceId] = useState("");

  // Trial Config
  const [trialEnabled, setTrialEnabled] = useState(false);
  const [trialDurationInMonths, setTrialDurationInMonths] = useState<number>(1);
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
    setPriceAmount(0);
    setCurrency("GBP");
    setIsUnlimitedListings(true);
    setMaxListings(-1);
    setLeadAccess(false);
    setFeaturedListing(false);
    setVerifiedBadge(false);
    setAgentProfilePage(false);
    setSortOrder(0);
    setPaymentLink("");
    setProductId("");
    setPriceId("");
    setTrialEnabled(false);
    setTrialDurationInMonths(1);
    setTrialRestrictionsFeaturedListing(false);
    setTrialRestrictionsLeadAccess(false);
  };

  // ────────────────────────────────────────────────────────────────
  // Populate Form for Editing
  // ────────────────────────────────────────────────────────────────
  const handleEditClick = (plan: IPlan) => {
    setEditingPlan(plan);
    setTitle(plan.title);
    setDescription(plan.description || "");
    setTier(plan.tier);
    setStatus(plan.status);
    setDuration(plan.duration);
    setPriceAmount(plan.pricing?.amount || 0);
    setCurrency(plan.pricing?.currency || "GBP");
    setIsUnlimitedListings((plan.limits?.maxListings ?? -1) === -1);
    setMaxListings(plan.limits?.maxListings ?? -1);
    setLeadAccess(plan.features?.leadAccess ?? false);
    setFeaturedListing(plan.features?.featuredListing ?? false);
    setVerifiedBadge(plan.features?.verifiedBadge ?? false);
    setAgentProfilePage(plan.features?.agentProfilePage ?? false);
    setSortOrder(plan.sortOrder || 0);
    setPaymentLink(plan.paymentLink || "");
    setProductId(plan.productId || "");
    setPriceId(plan.priceId || "");
    
    // Trial Info
    setTrialEnabled(plan.trial?.enabled ?? false);
    setTrialDurationInMonths(plan.trial?.durationInMonths ?? 1);
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
        amount: Number(priceAmount),
        currency,
      },
      limits: {
        maxListings: isUnlimitedListings ? -1 : Number(maxListings),
      },
      features: {
        leadAccess,
        featuredListing,
        verifiedBadge,
        agentProfilePage,
      },
      sortOrder: Number(sortOrder),
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
        // Edit flow
        await updatePackage({ id: editingPlan._id || editingPlan.id || "", data: payload })?.unwrap();
        toast.success("Subscription plan updated successfully!");
      } else {
        // Add flow
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

  // Stats Calculations
  const totalPlans = packagesList.length;
  const activePlans = packagesList.filter(p => p.status === PLAN_STATUS.ACTIVE).length;
  const trialPlans = packagesList.filter(p => p.tier === PLAN_TIER.TRIAL).length;
  const premiumPlans = packagesList.filter(p => p.tier === PLAN_TIER.PREMIUM || p.tier === PLAN_TIER.PROFESSIONAL).length;

  // Help format duration label
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Package Plans</h1>
          <p className="text-sm text-slate-500 mt-1">Manage pricing plans, listing limits, and feature access for subscribers</p>
        </div>
        <Button
          className="gap-2 bg-[#0B3C6D] hover:bg-[#0B3C6D]/95 text-white shadow-md font-semibold px-5 py-2.5 rounded-xl transition-all"
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
        <StatCard icon={<Layers size={18} />} label="Total Plans" value={totalPlans} color="blue" />
        <StatCard icon={<ShieldCheck size={18} />} label="Active Plans" value={activePlans} color="green" />
        <StatCard icon={<Star size={18} />} label="Trial Plans" value={trialPlans} color="purple" />
        <StatCard icon={<Gem size={18} />} label="Premium & Pro Plans" value={premiumPlans} color="gold" />
      </div>

      {/* Cards Layout */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-[#0B3C6D] border-t-transparent rounded-full animate-spin"></div>
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
              className="mt-5 gap-2 bg-[#0B3C6D] hover:bg-[#0B3C6D]/95 text-white"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packagesList.map((plan) => {
            const isActive = plan.status === PLAN_STATUS.ACTIVE;
            const currencySymbol = plan.pricing?.currency === "GBP" ? "£" : plan.pricing?.currency === "USD" ? "$" : plan.pricing?.currency || "";
            const isTrial = plan.tier === PLAN_TIER.TRIAL;

            return (
              <div 
                key={plan._id || plan.id}
                className="relative rounded-2xl bg-slate-950 border border-slate-900 shadow-xl overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col h-full min-h-[500px]"
              >
                {/* Premium Accent Line */}
                <div className={`h-1.5 w-full ${
                  plan.tier === PLAN_TIER.PREMIUM ? "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" :
                  plan.tier === PLAN_TIER.PROFESSIONAL ? "bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-600" :
                  isTrial ? "bg-gradient-to-r from-gray-400 via-slate-500 to-gray-600" :
                  "bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600"
                }`} />

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-slate-900 border border-slate-800 text-slate-300 rounded-lg flex items-center gap-1.5 shadow-xs">
                      {getDurationLabel(plan.duration)}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Active Status Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isActive 
                          ? "bg-emerald-950/50 text-emerald-400 border-emerald-800" 
                          : "bg-slate-900 text-slate-400 border-slate-800"
                      }`}>
                        {plan.status}
                      </span>
                    </div>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors">
                      {plan.title}
                    </h3>
                    <div className="shrink-0 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 shadow-xs">
                      {getTierIcon(plan.tier)}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 font-normal leading-relaxed mb-6 line-clamp-3">
                    {plan.description || "No description provided for this plan."}
                  </p>

                  {/* Pricing Display */}
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

                  {/* Limits and Details Info */}
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

                  {/* Features List */}
                  <div className="space-y-3 mb-6 flex-1">
                    <span className="text-slate-500 uppercase tracking-widest text-[9px] font-bold block mb-1">Features Included</span>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 size={14} className={plan.features?.leadAccess ? "text-emerald-400 shrink-0" : "text-slate-700 shrink-0"} />
                      <span className={plan.features?.leadAccess ? "text-slate-200" : "text-slate-500 line-through"}>
                        Lead Access & Inquiry Management
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 size={14} className={plan.features?.featuredListing ? "text-emerald-400 shrink-0" : "text-slate-700 shrink-0"} />
                      <span className={plan.features?.featuredListing ? "text-slate-200" : "text-slate-500 line-through"}>
                        Featured Listings Promotions
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 size={14} className={plan.features?.verifiedBadge ? "text-emerald-400 shrink-0" : "text-slate-700 shrink-0"} />
                      <span className={plan.features?.verifiedBadge ? "text-slate-200" : "text-slate-500 line-through"}>
                        Verified Agent Badge Indicator
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 size={14} className={plan.features?.agentProfilePage ? "text-emerald-400 shrink-0" : "text-slate-700 shrink-0"} />
                      <span className={plan.features?.agentProfilePage ? "text-slate-200" : "text-slate-500 line-through"}>
                        Custom Agent Profile Showcase Page
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto border-t border-slate-900/80 pt-4 flex gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => handleEditClick(plan)}
                      className="flex-1 gap-1.5 h-9 rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 hover:border-slate-700 text-xs font-semibold font-sans bg-transparent"
                    >
                      <Edit3 size={13} />
                      Edit Plan
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleDeleteClick(plan._id || plan.id || "")}
                      className="px-3 h-9 rounded-lg border border-red-950/30 text-red-400 hover:text-white hover:bg-red-950/30 hover:border-red-900/50 text-xs bg-transparent"
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

      {/* dialog for Add / Edit Plan */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 text-white border border-slate-800 rounded-2xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Layers className="text-[#E2B93B]" />
              {editingPlan ? "Edit Subscription Plan" : "Add New Subscription Plan"}
            </DialogTitle>
            <p className="text-xs text-slate-400 font-medium">Configure plan settings, price structure, trial phases, and subscriber parameters.</p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Row 1: Plan Title & Tier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Plan Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Starter Plan, Premium Access"
                  className="w-full h-11 px-3.5 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-600"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Plan Tier</label>
                <select
                  className="w-full h-11 px-3.5 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-amber-500 transition-colors text-white"
                  value={tier}
                  onChange={(e) => setTier(e.target.value as PLAN_TIER)}
                >
                  <option value={PLAN_TIER.TRIAL}>Trial Package</option>
                  <option value={PLAN_TIER.STARTER}>Starter Package</option>
                  <option value={PLAN_TIER.PROFESSIONAL}>Professional Package</option>
                  <option value={PLAN_TIER.PREMIUM}>Premium Package</option>
                </select>
              </div>
            </div>

            {/* Row 2: Short Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Short Description</label>
              <textarea
                placeholder="A high-level description outlining what is included and who this subscription is tailored for."
                className="w-full min-h-16 max-h-24 p-3 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-600"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Row 3: Pricing & Currency & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Price Amount</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 149"
                  className="w-full h-11 px-3.5 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-amber-500 transition-colors text-white placeholder:text-slate-600"
                  value={priceAmount}
                  onChange={(e) => setPriceAmount(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Currency</label>
                <input
                  type="text"
                  placeholder="e.g. GBP, USD"
                  className="w-full h-11 px-3.5 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-amber-500 transition-colors text-white uppercase placeholder:text-slate-600"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Billing Period</label>
                <select
                  className="w-full h-11 px-3.5 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-amber-500 transition-colors text-white"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as PLATFORM_PLAN_DURATION)}
                >
                  <option value={PLATFORM_PLAN_DURATION.MONTHLY}>Monthly</option>
                  <option value={PLATFORM_PLAN_DURATION.QUARTERLY}>Quarterly (3 Months)</option>
                  <option value={PLATFORM_PLAN_DURATION.HALF_YEARLY}>Half Yearly (6 Months)</option>
                  <option value={PLATFORM_PLAN_DURATION.YEARLY}>Yearly (12 Months)</option>
                </select>
              </div>
            </div>

            {/* Row 4: Listing Limits & Status & Sort Order */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Max Listings Limit</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    disabled={isUnlimitedListings}
                    placeholder="Unlimited (-1)"
                    className="flex-1 h-11 px-3.5 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    value={isUnlimitedListings ? -1 : maxListings}
                    onChange={(e) => setMaxListings(Number(e.target.value))}
                  />
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isUnlimitedListings}
                      onChange={(e) => setIsUnlimitedListings(e.target.checked)}
                      className="rounded border-slate-800 text-amber-500 focus:ring-transparent bg-slate-900 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Unlimited</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Plan Status</label>
                <select
                  className="w-full h-11 px-3.5 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-amber-500 transition-colors text-white"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PLAN_STATUS)}
                >
                  <option value={PLAN_STATUS.ACTIVE}>ACTIVE (Live)</option>
                  <option value={PLAN_STATUS.INACTIVE}>INACTIVE (Draft/Hidden)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Sort Order</label>
                <input
                  type="number"
                  placeholder="e.g. 0, 1, 2"
                  className="w-full h-11 px-3.5 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Row 5: Payment Links (Optional) */}
            <div className="border-t border-slate-900 pt-4 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 block">Stripe / Payment Gateway Integration (Optional)</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1 md:col-span-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">Stripe Product ID</label>
                  <input
                    type="text"
                    placeholder="prod_..."
                    className="w-full h-11 px-3.5 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-700"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                  />
                </div>

                <div className="space-y-1 md:col-span-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">Stripe Price ID</label>
                  <input
                    type="text"
                    placeholder="price_..."
                    className="w-full h-11 px-3.5 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-700"
                    value={priceId}
                    onChange={(e) => setPriceId(e.target.value)}
                  />
                </div>

                <div className="space-y-1 md:col-span-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">Direct Checkout URL</label>
                  <input
                    type="text"
                    placeholder="https://buy.stripe.com/..."
                    className="w-full h-11 px-3.5 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-700"
                    value={paymentLink}
                    onChange={(e) => setPaymentLink(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Row 6: Features Checked Box Selection */}
            <div className="border-t border-slate-900 pt-4 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 block">Included Features & Privileges</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-900/60 border border-slate-850 hover:border-slate-800 cursor-pointer select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={leadAccess}
                    onChange={(e) => setLeadAccess(e.target.checked)}
                    className="rounded border-slate-800 text-amber-500 focus:ring-transparent bg-slate-900 w-5 h-5 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Lead Access</span>
                    <span className="text-[10px] text-slate-500 block">Allows viewing generated inquiries & email leads.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-900/60 border border-slate-850 hover:border-slate-800 cursor-pointer select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={featuredListing}
                    onChange={(e) => setFeaturedListing(e.target.checked)}
                    className="rounded border-slate-800 text-amber-500 focus:ring-transparent bg-slate-900 w-5 h-5 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Featured Listings</span>
                    <span className="text-[10px] text-slate-500 block">Allows marking and promoting listings to prime slots.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-900/60 border border-slate-850 hover:border-slate-800 cursor-pointer select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={verifiedBadge}
                    onChange={(e) => setVerifiedBadge(e.target.checked)}
                    className="rounded border-slate-800 text-amber-500 focus:ring-transparent bg-slate-900 w-5 h-5 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Verified Agent Badge</span>
                    <span className="text-[10px] text-slate-500 block">Gives a badge next to the profile name for authenticity.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-900/60 border border-slate-850 hover:border-slate-800 cursor-pointer select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={agentProfilePage}
                    onChange={(e) => setAgentProfilePage(e.target.checked)}
                    className="rounded border-slate-800 text-amber-500 focus:ring-transparent bg-slate-900 w-5 h-5 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Custom Agent Profile Showcase Page</span>
                    <span className="text-[10px] text-slate-500 block">Access to custom dedicated URL page for agency profile.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Row 7: Trial Configurations */}
            <div className="border-t border-slate-900 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 block">Trial Period Settings</span>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={trialEnabled}
                    onChange={(e) => setTrialEnabled(e.target.checked)}
                    className="rounded border-slate-800 text-amber-500 focus:ring-transparent bg-slate-900 w-5 h-5 cursor-pointer"
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Enable Trial Configuration</span>
                </label>
              </div>

              {trialEnabled && (
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-850 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">Trial Duration (Months)</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 1"
                        className="w-full h-11 px-3.5 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                        value={trialDurationInMonths}
                        onChange={(e) => setTrialDurationInMonths(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">Restrictions During Trial Phase</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={trialRestrictionsFeaturedListing}
                          onChange={(e) => setTrialRestrictionsFeaturedListing(e.target.checked)}
                          className="rounded border-slate-800 text-red-500 focus:ring-transparent bg-slate-900 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs text-slate-300">Disable Featured Listings Promotions</span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={trialRestrictionsLeadAccess}
                          onChange={(e) => setTrialRestrictionsLeadAccess(e.target.checked)}
                          className="rounded border-slate-800 text-red-500 focus:ring-transparent bg-slate-900 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs text-slate-300">Disable Direct Lead & Enquiry Access</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Save / Cancel buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-900">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="h-11 px-6 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors text-sm font-semibold border border-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isAdding || isUpdating}
                className="h-11 px-8 rounded-lg bg-[#E2B93B] hover:bg-[#E2B93B]/90 text-slate-950 font-bold shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2"
              >
                {(isAdding || isUpdating) ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
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
