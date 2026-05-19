import { Calendar } from "lucide-react";
import type { Enquiry } from "../../../types/enquiry";
import { Button } from "../../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../ui/dialog";




interface Props {
    open: boolean;
    onClose: () => void;
    data?: Enquiry;
}

export const EnquiryModal = ({ open, onClose, data }: Props) => {
    if (!data) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Enquiry Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-5">
                    <div className="flex gap-4">
                        <img
                            src={data.property.image}
                            className="w-24 h-24 rounded object-cover"
                        />
                        <div>
                            <h3 className="font-semibold">{data.property.title}</h3>
                            <p className="text-muted-foreground text-sm">
                                {data.property.location}
                            </p>
                            <p className="font-bold mt-1">{data.property.price}</p>
                        </div>
                    </div>
                    <p className="font-medium mb-2">Message</p>
                    <div className="flex items-center gap-2">
                        <Calendar size={14}/>
                        <span className="text-gray-700 font-medium">28 Mar 2026, 10:30 am</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-medium">Property Seeker</p>
                            <p>{data.seeker.name}</p>
                            <p className="text-muted-foreground">{data.seeker.email}</p>
                            <p className="text-muted-foreground">{data.seeker.phone}</p>
                        </div>

                        <div>
                            <p className="font-medium">Agent</p>
                            <p>{data.agent.name}</p>
                            <p className="text-muted-foreground">{data.agent.company}</p>
                        </div>
                    </div>

                    <p className="font-medium mb-2">Message</p>
                    <div className="bg-muted p-3 rounded">
                        {data.message}
                    </div>

                    <Button className="w-full">View Property</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};