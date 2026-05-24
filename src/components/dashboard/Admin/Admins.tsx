import { Mail, Shield, ShieldCheck, Trash2, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { useCreateAdminMutation, useDeleteAdminMutation, useGetAdminQuery, useUpdateUserMutation } from '../../../redux/features/user/userApi';
import { confirmDelete } from '../../Shared/confirmDelete';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader } from '../../ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../ui/table';
import AddAdminForm from './AddAdminForm';

interface Admin {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    role: string;
    status?: string;
    createdAt?: string;
    lastLoginAt?: string;
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    color: "purple" | "green" | "blue";
}

const themeStyles: Record<string, { cardBg: string; border: string; iconBg: string; iconColor: string }> = {
    purple: { cardBg: "bg-white", border: "border-gray-150/70", iconBg: "bg-purple-50", iconColor: "text-purple-600" },
    green:  { cardBg: "bg-white", border: "border-gray-150/70", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    blue:   { cardBg: "bg-white", border: "border-gray-150/70", iconBg: "bg-blue-50", iconColor: "text-blue-600" },
};

function StatCard({ icon, label, value, color }: StatCardProps) {
    const theme = themeStyles[color] || themeStyles.blue;
    return (
        <div className={`rounded-xl border ${theme.border} p-4 ${theme.cardBg} shadow-sm hover:shadow-md transition-all duration-300`}>
            <div className="flex items-center gap-3">
                <div className={`w-9.5 h-9.5 rounded-xl ${theme.iconBg} ${theme.iconColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                    <span className="text-xl font-extrabold text-slate-800">{value}</span>
                </div>
            </div>
        </div>
    );
}

function AdminAvatar({ name, color }: { name: string; color: string }) {
    const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0 ${color}`}>
            {initials}
        </div>
    );
}

const ROLE_STYLES: Record<string, string> = {
    'ADMIN':'bg-blue-100 text-blue-700 border-blue-200',
};

function RoleBadge({ role }: { role: string }) {
    const cls = ROLE_STYLES[role] ?? 'bg-gray-100 text-gray-700 border-gray-200';
    return <Badge variant="outline" className={`text-xs font-semibold ${cls}`}>{role}</Badge>;
}

// function StatusBadge({ status }: { status: string }) {
//     const active = status?.toLowerCase() === 'active';
//     return (
//         <Badge
//             variant="outline"
//             className={`text-xs font-medium capitalize ${
//                 active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'
//             }`}
//         >
//             {status}
//         </Badge>
//     );
// }

function StatusSelect({
    status,
    onChange,
    disabled
}: {
    status: string;
    onChange: (newStatus: string) => void;
    disabled?: boolean;
}) {
    const isActive = status?.toUpperCase() === 'ACTIVE';
    return (
        <select
            value={status?.toUpperCase() || 'ACTIVE'}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={`text-xs font-semibold rounded-full px-2.5 py-1.5 border outline-none cursor-pointer transition-all ${
                isActive
                    ? 'bg-green-50 text-green-700 border-green-200 focus:ring-green-100'
                    : 'bg-gray-100 text-gray-600 border-gray-200 focus:ring-gray-100'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-95'}`}
        >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
        </select>
    );
}



const AVATAR_COLORS = [
    'bg-blue-600', 'bg-teal-600', 'bg-indigo-600',
    'bg-rose-500', 'bg-amber-500', 'bg-purple-600',
];

export default function AdminManage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: adminsData, refetch } = useGetAdminQuery({});
    // const { data: adminStats } = useGetAdminStatsQuery({});
    const [addAdmin] = useCreateAdminMutation();
    const [deleteAdmin] = useDeleteAdminMutation();
    const [updateUser] = useUpdateUserMutation();

    const admins: Admin[] = adminsData?? [];
    const totalAdmins = admins.length;
    const totalSuperAdmins = admins.filter(a => a.role === 'SUPER_ADMIN').length;
    const totalActiveAdmins = admins.filter(a => a.status?.toUpperCase() === 'ACTIVE').length;
    const totalInactiveAdmins = admins.filter(a => a.status?.toUpperCase() === 'INACTIVE').length;

    const handleFormSubmit = async (formData: FormData) => {
        const data = Object.fromEntries(formData);
        

        const payload = {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role || 'ADMIN',
        
        };

        try {
            const response = await addAdmin(payload)?.unwrap();
            if (response?.success) {
                toast.success(response?.message);
                refetch();
                setIsModalOpen(false);
            }
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message ?? 'Something went wrong!');
            setIsModalOpen(false);
        }
    };

    const handleAdminDelete = async (adminId: string) => {
        const isConfirmed = await confirmDelete({
            title: 'Delete Admin?',
            text: 'This admin account will be permanently removed.',
        });
        if (!isConfirmed) return;

        try {
            await deleteAdmin(adminId);
            Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Admin deleted successfully.', timer: 1500, showConfirmButton: false });
            refetch();
        } catch {
            Swal.fire({ icon: 'error', title: 'Failed!', text: 'Something went wrong while deleting.' });
        }
    };

    const handleStatusChange = async (adminId: string, newStatus: string) => {
        try {
            await updateUser({ id: adminId, status: newStatus }).unwrap();
            toast.success('Admin status updated successfully!');
            refetch();
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message ?? 'Failed to update admin status.');
        }
    };

    return (
        <div>
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Admin Management</h2>
                    <p className="text-sm text-slate-500 mt-1">Add and manage administrator accounts</p>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-[#0B3C6D] hover:bg-[#0B3C6D]/95 text-white">
                            <UserPlus size={16} />
                            Add New Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Add New Administrator</DialogTitle>
                            <p className="text-sm text-gray-500">Create a new admin account to manage the application.</p>
                        </DialogHeader>
                        <AddAdminForm
                            onSubmit={handleFormSubmit}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard icon={<Shield size={18} />} label="Total Admins" value={totalAdmins} color="purple" />
                <StatCard icon={<ShieldCheck size={18} />} label="Active Admins" value={totalActiveAdmins} color="green" />
                <StatCard icon={<Users size={18} />} label="Inactive Admins" value={totalInactiveAdmins} color="blue" />
                <StatCard icon={<Users size={18} />} label="Super Admins" value={totalSuperAdmins} color="blue" />
            </div>

            <Card className="border-none shadow-sm rounded-xl">
                <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">All Administrators</h3>
                    <p className="text-sm text-gray-500">Manage admin accounts</p>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                                <TableHead className="pl-6">Admin</TableHead>
                                <TableHead>Role</TableHead>
                         
                                <TableHead>Date Added</TableHead>
                                <TableHead>Last Login</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {admins.length ? admins.map((admin, index) => (
                                <TableRow key={admin.id ?? admin._id} className="hover:bg-gray-50" data-aos="fade-up" data-aos-delay={index * 80}>
                                    <TableCell className="pl-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <AdminAvatar name={admin.name} color={AVATAR_COLORS[index % AVATAR_COLORS.length]} />
                                            <div>
                                                <p className="font-medium text-sm text-gray-900">{admin.name}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Mail size={11} /> {admin.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><RoleBadge role={admin.role} /></TableCell>
                                    
                                    <TableCell className="text-sm text-gray-600">
                                        {admin.createdAt ? new Date(admin.createdAt).toISOString().slice(0, 10) : '—'}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {admin.lastLoginAt ? new Date(admin.lastLoginAt).toISOString().slice(0, 10) : '—'}
                                    </TableCell>
                                    <TableCell>
                                        <StatusSelect
                                            status={admin.status ?? 'ACTIVE'}
                                            onChange={(newStatus) => handleStatusChange(admin._id ?? admin.id ?? '', newStatus)}
                                            disabled={admin.role === 'SUPER_ADMIN'}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={() => handleAdminDelete(admin?._id ?? admin?.id ?? '')}
                                                disabled={admin.role === 'SUPER_ADMIN'}
                                            >
                                                <Trash2 size={15} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                                        No administrators found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
