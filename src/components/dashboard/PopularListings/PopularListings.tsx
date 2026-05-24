import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import {
  ChevronDown,
  Edit3,
  MapPin,
  Plus,
  Trash2,
  X,
  Home,
  Loader2,
  Search,
  CheckSquare,
  Square,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { SingleImageUpload } from "../../Shared/SingleImageUpload";
import { imageUrl } from "../../../redux/base/baseAPI";
import {
  useCreatePopularLocationMutation,
  useDeletePopularLocationMutation,
  useGetAvailableListingsQuery,
  useGetPopularLocationsQuery,
  useUpdatePopularLocationMutation,
} from "../../../redux/features/popularLocations/popularLocationApi";
import type {
  IPopularLocation,
  IPublishedListingOption,
} from "../../../types/popularLocation.types";

function parseListingsFromLocation(location: IPopularLocation): IPublishedListingOption[] {
  return (location.listings ?? [])
    .map((listing) => {
      if (typeof listing === "object" && listing !== null) {
        const id = listing._id || (listing as { id?: string }).id || "";
        return {
          _id: id,
          title: listing.title ?? "Listing",
          location: listing.location,
          city: (listing as IPublishedListingOption).city,
          country: (listing as IPublishedListingOption).country,
          postalCode: (listing as IPublishedListingOption).postalCode,
        };
      }
      return { _id: String(listing), title: "Listing" };
    })
    .filter((l) => l._id);
}

function resolveLocationListings(
  location: IPopularLocation,
  lookup: Map<string, IPublishedListingOption>
): IPublishedListingOption[] {
  return (location.listings ?? []).map((listing) => {
    if (typeof listing === "object") {
      const id = listing._id || (listing as { id?: string }).id || "";
      const fromLookup = id ? lookup.get(id) : undefined;
      if (fromLookup) return fromLookup;
      return {
        _id: id,
        title: listing.title ?? "Unknown listing",
        location: listing.location,
        city: (listing as IPublishedListingOption).city,
      };
    }
    const fromLookup = lookup.get(listing);
    if (fromLookup) return fromLookup;
    return { _id: listing, title: `Listing (${listing.slice(-6)})` };
  });
}

function LocationListingsTableCell({
  items,
}: {
  items: IPublishedListingOption[];
}) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) {
    return <span className="text-xs text-gray-400">No listings attached</span>;
  }

  if (items.length <= 3) {
    return (
      <div className="space-y-2 min-w-[220px]">
        {items.map((listing) => (
          <div key={listing._id} className="text-xs leading-snug border-b border-slate-50 last:border-0 pb-1.5 last:pb-0">
            <p className="font-semibold text-gray-800">{listing.title}</p>
            <p className="text-gray-500">{listing.location?.address || "No address"}</p>
          </div>
        ))}
      </div>
    );
  }

  const preview = items.slice(0, 2);
  const hasMore = true;

  return (
    <div className="min-w-[240px] max-w-lg">
      <div className="space-y-1.5">
        {preview.map((listing) => (
          <div key={listing._id} className="text-xs leading-snug">
            <p className="font-semibold text-gray-800 truncate">{listing.title}</p>
            <p className="text-gray-500 truncate">{listing.location?.address || "No address"}</p>
          </div>
        ))}
      </div>

      {hasMore && (
        <>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mt-2 text-xs font-semibold text-[#0b3c6d] hover:underline"
          >
            View all {items.length} listings
          </button>

          <Dialog open={expanded} onOpenChange={setExpanded}>
            <DialogContent className="max-w-xl max-h-[80vh] overflow-hidden flex flex-col p-0 gap-0">
              <DialogHeader className="px-5 pt-5 pb-3 border-b border-slate-100">
                <DialogTitle className="text-lg font-bold text-[#0b3c6d]">
                  Attached Listings ({items.length})
                </DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto px-5 pb-5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Title</TableHead>
                      <TableHead className="text-xs">Address</TableHead>
                      <TableHead className="text-xs w-24">City</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((listing) => (
                      <TableRow key={listing._id}>
                        <TableCell className="text-xs font-medium text-gray-900 py-2">
                          {listing.title}
                        </TableCell>
                        <TableCell className="text-xs text-gray-600 py-2">
                          {listing.location?.address || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-gray-500 py-2">
                          {listing.city || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

function ListingMultiSelect({
  listings,
  isLoading,
  excludedIds,
  onAddMany,
}: {
  listings: IPublishedListingOption[];
  isLoading: boolean;
  excludedIds: Set<string>;
  onAddMany: (items: IPublishedListingOption[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const available = useMemo(
    () => listings.filter((l) => !excludedIds.has(l._id)),
    [listings, excludedIds]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return available;
    return available.filter(
      (l) =>
        l.title?.toLowerCase().includes(q) ||
        l.location?.address?.toLowerCase().includes(q) ||
        l.city?.toLowerCase().includes(q)
    );
  }, [available, search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) {
      setCheckedIds(new Set());
      setSearch("");
    }
  }, [open]);

  const toggleId = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllFiltered = () => {
    setCheckedIds(new Set(filtered.map((l) => l._id)));
  };

  const clearChecked = () => setCheckedIds(new Set());

  const handleAddSelected = () => {
    const toAdd = filtered.filter((l) => checkedIds.has(l._id));
    if (toAdd.length === 0) {
      toast.error("Select at least one listing");
      return;
    }
    onAddMany(toAdd);
    setCheckedIds(new Set());
    setOpen(false);
  };

  const triggerCls =
    "w-full min-h-11 px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-left text-sm focus:outline-none focus:border-[#0b3c6d] focus:ring-1 focus:ring-[#0b3c6d]/30 transition-colors flex items-center justify-between gap-2";

  return (
    <div ref={containerRef} className="relative flex-1">
      <button
        type="button"
        onClick={() => !isLoading && setOpen((v) => !v)}
        disabled={isLoading || available.length === 0}
        className={triggerCls + (isLoading || available.length === 0 ? " opacity-60 cursor-not-allowed" : "")}
      >
        <span className="text-slate-600">
          {isLoading
            ? "Loading available listings..."
            : available.length === 0
              ? "All available listings already added"
              : checkedIds.size > 0
                ? `${checkedIds.size} listing${checkedIds.size !== 1 ? "s" : ""} selected`
                : "Select multiple listings (checkboxes)"}
        </span>
        <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && available.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-100 space-y-2 bg-slate-50/80">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#0b3c6d] focus:ring-1 focus:ring-[#0b3c6d]/30"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAllFiltered}
                  className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c6d] hover:underline"
                >
                  Select all ({filtered.length})
                </button>
                <button
                  type="button"
                  onClick={clearChecked}
                  className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:underline"
                >
                  Clear
                </button>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                {checkedIds.size} selected
              </span>
            </div>
          </div>

          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-center text-xs text-slate-400">No listings match your search</li>
            ) : (
              filtered.map((listing) => {
                const isChecked = checkedIds.has(listing._id);
                return (
                  <li key={listing._id}>
                    <label className="flex items-start gap-3 px-3.5 py-2.5 cursor-pointer hover:bg-[#0b3c6d]/5 border-b border-slate-50 last:border-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleId(listing._id)}
                        className="mt-1 rounded border-slate-300 accent-[#0b3c6d] w-4 h-4 shrink-0"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-800">{listing.title}</span>
                        <span className="block text-xs text-slate-500 mt-0.5">
                          {listing.location?.address || "No address"}
                        </span>
                      </span>
                      {isChecked ? (
                        <CheckSquare size={16} className="text-[#0b3c6d] shrink-0 mt-0.5" />
                      ) : (
                        <Square size={16} className="text-slate-300 shrink-0 mt-0.5" />
                      )}
                    </label>
                  </li>
                );
              })
            )}
          </ul>

          <div className="p-3 border-t border-slate-100 bg-white">
            <Button
              type="button"
              onClick={handleAddSelected}
              disabled={checkedIds.size === 0}
              className="w-full h-10 rounded-lg bg-[#0b3c6d] hover:bg-[#0b3c6d]/90 text-white font-semibold text-sm gap-2"
            >
              <Plus size={16} />
              Add {checkedIds.size > 0 ? `${checkedIds.size} ` : ""}Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PopularListings() {
  const { data: locations = [], isLoading, refetch } = useGetPopularLocationsQuery({});
  const [createLocation, { isLoading: isCreating }] = useCreatePopularLocationMutation();
  const [updateLocation, { isLoading: isUpdating }] = useUpdatePopularLocationMutation();
  const [deleteLocation] = useDeletePopularLocationMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<IPopularLocation | null>(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | undefined>();
  const [selectedListings, setSelectedListings] = useState<IPublishedListingOption[]>([]);

  const editingLocationId = editingLocation?._id || editingLocation?.id;
  const { data: availableListings = [], isLoading: listingsLoading, refetch: refetchAvailable } =
    useGetAvailableListingsQuery(isModalOpen ? editingLocationId : undefined, {
      skip: !isModalOpen,
    });

  const listingsPool = useMemo(() => {
    const map = new Map<string, IPublishedListingOption>();
    [...availableListings, ...selectedListings].forEach((l) => {
      if (l._id) map.set(l._id, l);
    });
    return Array.from(map.values());
  }, [availableListings, selectedListings]);

  const listingLookup = useMemo(() => {
    const map = new Map<string, IPublishedListingOption>();
    listingsPool.forEach((l) => map.set(l._id, l));
    locations.forEach((loc) => {
      parseListingsFromLocation(loc).forEach((l) => map.set(l._id, l));
    });
    return map;
  }, [listingsPool, locations]);

  const excludedIds = useMemo(
    () => new Set(selectedListings.map((l) => l._id)),
    [selectedListings]
  );

  const inputCls =
    "w-full h-11 px-3.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#0b3c6d] focus:ring-1 focus:ring-[#0b3c6d]/30 transition-colors placeholder:text-slate-400";
  const labelCls = "text-xs font-bold uppercase tracking-wider text-slate-500 block";

  const resetForm = () => {
    setEditingLocation(null);
    setName("");
    setImageFile(null);
    setExistingImage(undefined);
    setSelectedListings([]);
  };

  const handleEditClick = (location: IPopularLocation) => {
    setEditingLocation(location);
    setName(location.name ?? "");
    setExistingImage(location.image ? imageUrl + location.image : undefined);
    setImageFile(null);
    setSelectedListings(parseListingsFromLocation(location));
    setIsModalOpen(true);
  };

  const handleAddManyListings = (listingsToAdd: IPublishedListingOption[]) => {
    const existing = new Set(selectedListings.map((l) => l._id));
    const newOnes = listingsToAdd.filter((l) => !existing.has(l._id));
    if (newOnes.length === 0) {
      toast.error("Selected listings are already added");
      return;
    }
    setSelectedListings((prev) => [...prev, ...newOnes]);
    toast.success(`${newOnes.length} listing${newOnes.length !== 1 ? "s" : ""} added`);
  };

  const handleRemoveListing = (id: string) => {
    setSelectedListings((prev) => prev.filter((l) => l._id !== id));
  };

  const getListingIds = () => selectedListings.map((l) => l._id);

  const buildCreateBody = () => {
    const fd = new FormData();
    if (imageFile) fd.append("image", imageFile);
    fd.append(
      "data",
      JSON.stringify({
        name: name.trim(),
        listings: getListingIds(),
      })
    );
    return fd;
  };

  /** PATCH: name + full listingIds replace (add, remove, and name update). */
  const buildUpdateBody = (): FormData | { name: string; listingIds: string[] } => {
    const payload = {
      name: name.trim(),
      listingIds: getListingIds(),
    };

    if (imageFile) {
      const fd = new FormData();
      fd.append("image", imageFile);
      fd.append("data", JSON.stringify(payload));
      return fd;
    }

    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Location name is required");
      return;
    }
    if (!editingLocation && !imageFile) {
      toast.error("Location image is required");
      return;
    }
    if (selectedListings.length === 0) {
      toast.error("Add at least one listing");
      return;
    }

    try {
      if (editingLocation) {
        const id = editingLocation._id || editingLocation.id || "";
        await updateLocation({ id, body: buildUpdateBody() }).unwrap();
        toast.success("Popular location updated successfully!");
      } else {
        await createLocation(buildCreateBody()).unwrap();
        toast.success("Popular location created successfully!");
      }
      await Promise.all([refetch(), refetchAvailable()]);
      setIsModalOpen(false);
      resetForm();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string; errorMessages?: { message?: string }[] } };
      const msg =
        err?.data?.message ||
        err?.data?.errorMessages?.[0]?.message ||
        "Failed to save popular location";
      toast.error(msg);
    }
  };

  const handleDeleteClick = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This popular location will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteLocation(id).unwrap();
        toast.success("Popular location deleted");
        refetch();
      } catch {
        toast.error("Failed to delete popular location");
      }
    }
  };

  const locationsList: IPopularLocation[] = Array.isArray(locations) ? locations : [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Popular Listings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create featured locations and attach published property listings
          </p>
        </div>
        <Button
          className="gap-2 bg-[#0b3c6d] hover:bg-[#0b3c6d]/90 text-white shadow-md font-semibold px-5 py-2.5 rounded-xl transition-all"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <Plus size={18} />
          Add Popular Location
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-[#0b3c6d] animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading popular locations...</p>
        </div>
      ) : locationsList.length === 0 ? (
        <Card className="border border-dashed border-slate-200 py-16 text-center shadow-xs">
          <CardContent className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-400">
              <MapPin size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No popular locations yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mt-1">
              Create your first popular location and add published listings from the dropdown.
            </p>
            <Button
              className="mt-5 gap-2 bg-[#0b3c6d] hover:bg-[#0b3c6d]/90 text-white"
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
            >
              <Plus size={16} />
              Create Location
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">All Popular Locations</h2>
            <p className="text-sm text-gray-500">
              {locationsList.length} location{locationsList.length !== 1 ? "s" : ""} configured
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead className="min-w-[180px]">Location Name</TableHead>
                  <TableHead className="min-w-[220px]">Listings</TableHead>
                  <TableHead className="w-[100px] text-center">Count</TableHead>
                  <TableHead className="text-right w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locationsList.map((location) => {
                  const id = location._id || location.id || "";
                  const listingCount = location.listings?.length ?? 0;
                  const imgSrc = location.image ? imageUrl + location.image : undefined;
                  const resolvedListings = resolveLocationListings(location, listingLookup);

                  return (
                    <TableRow key={id} className="hover:bg-gray-50/80">
                      <TableCell>
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-100 overflow-hidden shrink-0">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={location.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <MapPin size={20} />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-sm text-gray-900">{location.name}</div>
                      </TableCell>
                      <TableCell>
                        <LocationListingsTableCell items={resolvedListings} />
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                          <Home size={13} className="text-[#0b3c6d]" />
                          {listingCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() => handleEditClick(location)}
                            className="gap-1.5 h-8 px-3 rounded-lg bg-[#0b3c6d] hover:bg-[#0b3c6d]/90 text-white font-semibold text-xs"
                          >
                            <Edit3 size={13} />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(id)}
                            className="h-8 w-8 p-0 rounded-lg bg-[#0b3c6d] hover:bg-[#0b3c6d]/90 text-white"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-4xl w-[min(56rem,calc(100vw-2rem))] max-h-[90vh] overflow-hidden flex flex-col gap-0 bg-white text-slate-800 border border-slate-200 rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="mb-4 shrink-0">
            <DialogTitle className="text-2xl font-extrabold text-[#0b3c6d] flex items-center gap-2">
              <MapPin className="text-[#0b3c6d]" />
              {editingLocation ? "Edit Popular Location" : "Add Popular Location"}
            </DialogTitle>
            <p className="text-xs text-slate-400 font-medium">
              Set a location name, upload an image, and select multiple published listings using checkboxes.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pr-1 -mr-1">
            <div className="space-y-1">
              <label className={labelCls}>
                Location Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Central London, Manchester City Centre"
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <SingleImageUpload
              file={imageFile}
              onChange={setImageFile}
              onRemove={() => {
                setImageFile(null);
                setExistingImage(undefined);
              }}
              existingImage={existingImage}
              title="Location Image *"
              height={180}
              cover
            />

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className={labelCls}>Add Listings (multi-select)</span>
                {selectedListings.length > 0 && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b3c6d]">
                    {selectedListings.length} added
                  </span>
                )}
              </div>

              <ListingMultiSelect
                listings={listingsPool}
                isLoading={listingsLoading}
                excludedIds={excludedIds}
                onAddMany={handleAddManyListings}
              />

              {selectedListings.length > 0 && (
                <div className="rounded-lg border border-slate-100 overflow-hidden">
                  <div className="max-h-52 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                          <TableHead className="text-[10px] h-8">Title</TableHead>
                          <TableHead className="text-[10px] h-8">Address</TableHead>
                          <TableHead className="text-[10px] h-8 w-12 text-right"> </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedListings.map((listing) => (
                          <TableRow key={listing._id}>
                            <TableCell className="text-xs font-semibold text-slate-800 py-2">
                              {listing.title}
                            </TableCell>
                            <TableCell className="text-xs text-slate-500 py-2">
                              {listing.location?.address || "No address"}
                            </TableCell>
                            <TableCell className="text-right py-2">
                              <button
                                type="button"
                                onClick={() => handleRemoveListing(listing._id)}
                                className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50"
                                aria-label="Remove listing"
                              >
                                <X size={14} />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-slate-100 shrink-0 bg-white">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="h-11 px-6 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-sm font-semibold border border-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="h-11 px-8 rounded-lg bg-[#0b3c6d] hover:bg-[#0b3c6d]/90 text-white font-bold shadow-md text-sm flex items-center gap-2"
              >
                {(isCreating || isUpdating) && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {editingLocation ? "Save Changes" : "Create Location"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
