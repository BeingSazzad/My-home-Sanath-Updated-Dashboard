import React from "react";
import type { ListingDetail } from "../../../../types/listing.types";

import { Pencil } from "lucide-react";
import ModalImageGallery from "./ModalImageGallery";
import ModalPropertySpecs from "./ModalPropertySpecs";
import ModalPropertyFeatures from "./ModalPropertyFeatures";
import ModalAgentInfo from "./ModalAgentInfo";
import ModalPerformance from "./ModalPerformance";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "../../../ui/dialog";
import { Button } from "../../../ui/button";

interface Props {
  listing: ListingDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: number) => void;
}

const ListingDetailsModal: React.FC<Props> = ({ listing, isOpen, onClose, onEdit }) => {
  if (!listing) return null;
  const l = listing;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="min-w-250 w-full max-h-[92vh] overflow-y-auto p-0 gap-0 rounded-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100 text-left">
          <DialogTitle className="text-[15px] font-semibold text-gray-900 leading-tight">
            Listing Details – Full Review
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-400 mt-0.5">
            Review all information before approving
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="px-5 pt-4 pb-2">
          <ModalImageGallery count={l.images} />

          {/* Title + Featured badge */}
          <div className="flex justify-between items-start mb-1.5">
            <h1 className="text-xl font-bold text-gray-900">{l.title}</h1>
            {/* {l.featured && (
              <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ml-2">
                ⭐ Featured
              </span>
            )} */}
          </div>

          {/* Address */}
          <p className="flex items-center gap-1.5 text-[12.5px] text-gray-400 mb-4">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {l.address}
          </p>

          {/* Price & Type cards */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-white border border-slate-100 shadow-sm rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 mb-1">Price</p>
              <p className="text-2xl font-bold text-slate-800">
                {l.price}{" "}
                <span className="text-sm font-normal text-slate-400">{l.period}</span>
              </p>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 mb-1">Property Type</p>
              <p className="text-xl font-bold text-slate-800">Apartment</p>
              <p className="text-xs text-slate-400 mt-0.5">For sale</p>
            </div>
          </div>

          <ModalPropertySpecs listing={l} />

          {/* Full Description */}
          <div className="mb-5">
            <h3 className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-900 mb-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              Full Description
            </h3>
            <p className="text-md text-justify font-medium text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3.5">
              Beautiful modern apartment in the heart of Manchester city centre. This stunning property features contemporary design throughout with high-quality finishes. The open-plan living area is perfect for entertaining, and floor-to-ceiling windows flood the space with natural light. Located within walking distance of shops, restaurants, and transport links.
            </p>
          </div>

          <ModalPropertyFeatures features={l.features} />
          <ModalAgentInfo agent={l.agent} />
          <ModalPerformance stats={l.stats} />

          {/* Listing Status */}
          <div className="mb-5">
            <h3 className="flex items-center gap-1.5 text-lg font-semibold text-gray-900 mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Listing Status
            </h3>
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-md font-medium px-3 py-1.5 rounded-full">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Active
              </span>
              <div className="text-right">
                <p className="text-[13px] text-gray-400">Published</p>
                <p className="text-md font-semibold text-gray-700">12/05/2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <Button
            onClick={() => onEdit(l.id)}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3.5 rounded-xl h-auto text-[14px]"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Listing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ListingDetailsModal;