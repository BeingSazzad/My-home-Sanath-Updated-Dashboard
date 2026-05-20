import { Calendar } from "lucide-react";
import { Button } from "../../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../ui/dialog";


import { useGetEnquiryByIdQuery } from "../../../redux/features/enquiries/enquiriesApi";
import { imageUrl } from "../../../redux/base/baseAPI";

interface Props {
    open: boolean;
    onClose: () => void;
    data?: any;
}

export const EnquiryModal = ({ open, onClose, data }: Props) => {
    const { data: enquiry, isLoading } = useGetEnquiryByIdQuery(data?._id, {
        skip: !open || !data?._id
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Enquiry Details</DialogTitle>
                </DialogHeader>

                {!data?._id ? (
                    <div className="py-10 text-center text-gray-500">No enquiry selected</div>
                ) : isLoading ? (
                    <div className="py-10 text-center text-gray-500">Loading details...</div>
                ) : enquiry ? (
                    <div className="space-y-5">
                        <div className="flex gap-4">
                            {enquiry.listingId?.photos?.[0] ? (
                                <img
                                    src={`${imageUrl}${enquiry.listingId.photos[0]}`}
                                    className="w-24 h-24 rounded object-cover"
                                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100?text=No+Image'; }}
                                />
                            ) : (
                                <div className="w-24 h-24 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-sm border">No img</div>
                            )}
                            <div>
                                <h3 className="font-semibold">{enquiry.listingId?.title || 'Unknown Property'}</h3>
                                <p className="text-muted-foreground text-sm">
                                    {enquiry.listingId?.location?.address || enquiry.listingId?.city || 'Unknown Location'}
                                </p>
                                <p className="font-bold mt-1">£{enquiry.listingId?.askingPrice?.toLocaleString() || 0}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Calendar size={14}/>
                            <span className="text-gray-700 font-medium">
                                {new Date(enquiry.createdAt).toLocaleString()}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-medium mb-1">Property Seeker</p>
                                <p>Name: {enquiry.name}</p>
                                <p className="text-muted-foreground">Email: {enquiry.email}</p>
                                <p className="text-muted-foreground">Phone: {enquiry?.phone || 'N/A'}</p>
                            </div>

                            {enquiry.listingId?.agentId && (
                                <div>
                                    {enquiry.listingId?.agentId.name&& <p className="font-medium mb-1">Agent</p>}
                                    {enquiry.listingId?.agentId.name&& <p>Name: {enquiry.listingId.agentId.name || 'Unknown'}</p>}
                                    {enquiry.listingId?.agentId.agencyName&& <p className="text-muted-foreground">Agency Name: {enquiry.listingId.agentId.agencyName || 'N/A'}</p>}
                                    {enquiry.listingId?.agentId.email&& <p className="text-muted-foreground">Email: {enquiry.listingId.agentId.email || 'N/A'}</p>}
                                    {enquiry.listingId?.agentId.phone&& <p className="text-muted-foreground">Phone: {enquiry.listingId.agentId.phone || 'N/A'}</p>}
                                </div>
                            )}
                        </div>

                        <p className="font-medium mb-2">Message</p>
                        <div className="bg-muted p-3 rounded whitespace-pre-wrap">
                            {enquiry.message}
                        </div>

                        <Button className="w-full">View Property</Button>
                    </div>
                ) : (
                    <div className="py-10 text-center text-red-500">Failed to load enquiry details</div>
                )}
            </DialogContent>
        </Dialog>
    );
};