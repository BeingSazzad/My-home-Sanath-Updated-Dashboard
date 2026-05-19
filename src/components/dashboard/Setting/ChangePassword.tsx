import { useState } from 'react';
import { toast } from 'sonner';
import { useChangePasswordMutation } from '../../../redux/features/auth/authApi';
import { Card, CardContent } from '../../ui/card';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Eye, EyeOff, Loader2, Save } from 'lucide-react';
import { Button } from '../../ui/button';
import Cookies from 'js-cookie';

const ChangePassword = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const [isSaving, setIsSaving] = useState(false);
    const [securitySettings, setSecuritySettings] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [changePassword] = useChangePasswordMutation();
    const handleUpdatePassword = async () => {
        try {
            setIsSaving(true);
            const response = await changePassword({
                currentPassword: securitySettings.currentPassword,
                newPassword: securitySettings.newPassword,
                confirmPassword: securitySettings.confirmPassword,
            }).unwrap();
            if (response?.success) {
                toast.success(response?.message);
                setSecuritySettings({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                setIsSaving(false);
                Cookies.remove("accessToken");
            }
        } catch (error: any) {
            toast.error(error?.data?.message);
            setIsSaving(false);
        }
    };
    return (
        <Card className="border-none shadow-sm w-full max-w-6xl mx-auto">
            <CardContent className="px-8 pb-8">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Security Settings</h2>

                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                            <Input
                                id="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                value={securitySettings.currentPassword}
                                onChange={(e) =>
                                    setSecuritySettings({
                                        ...securitySettings,
                                        currentPassword: e.target.value,
                                    })
                                }
                                className="h-12 pr-12"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={securitySettings.newPassword}
                                onChange={(e) =>
                                    setSecuritySettings({
                                        ...securitySettings,
                                        newPassword: e.target.value,
                                    })
                                }
                                className="h-12 pr-12"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={securitySettings.confirmPassword}
                                onChange={(e) =>
                                    setSecuritySettings({
                                        ...securitySettings,
                                        confirmPassword: e.target.value,
                                    })
                                }
                                className="h-12 pr-12"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <Button
                        onClick={handleUpdatePassword}
                        disabled={isSaving}
                        className="bg-[#0B192C] hover:bg-[#0B192C]/95 text-white"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Update
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default ChangePassword