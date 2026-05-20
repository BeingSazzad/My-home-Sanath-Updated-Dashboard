import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

interface AddAdminFormProps {
    onSubmit?: (formData: FormData) => void;
    onCancel?: () => void;
}

export default function AddAdminForm({ onSubmit, onCancel }: AddAdminFormProps) {
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set('role', 'ADMIN');
        onSubmit?.(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 mt-1">
            {/* Full Name + Email */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Enter full name"
                        className="h-11"
                        required
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="admin@myhome.com"
                        className="h-11"
                        required
                    />
                </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter secure password"
                        className="h-11 pr-10"
                        required
                        minLength={6}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>

            {/* Role */}
            <div className="space-y-1.5">
                <Label>Role</Label>
                <Input
                    value="Admin"
                    className="h-11 bg-gray-50 text-gray-500 cursor-not-allowed"
                    readOnly
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" className="gap-2 bg-[#0B3C6D] hover:bg-[#0B3C6D]/90 text-white">
                    <UserPlus size={15} />
                    Add Administrator
                </Button>
            </div>
        </form>
    );
}