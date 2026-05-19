import { Save, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { cn } from '../../../lib/utils';
import { imageUrl } from '../../../redux/base/baseAPI';
import { useEditProfileMutation, useGetProfileQuery } from '../../../redux/features/user/userApi';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

const PersonalInformation = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingProfileUrl, setExistingProfileUrl] = useState<string | null>(null);

  const { data: profileData } = useGetProfileQuery({});
  const [editProfile] = useEditProfileMutation();

  useEffect(() => {
    setFormData({ name: profileData?.name || "", email: profileData?.email || "" });
    if (profileData?.profileImage) {
      setExistingProfileUrl(imageUrl + profileData?.profileImage);
    }
  }, [profileData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
  });

  const displayImage = profilePreview || existingProfileUrl;

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfilePreview(null);
    setExistingProfileUrl(null);
    setSelectedFile(null);
  };

  const handleSave = async () => {
    try {
      const payload = new FormData();
      if (selectedFile) {
        payload.append("profileImage", selectedFile);
      }
      payload.append("data", JSON.stringify(formData));

      const response = await editProfile(payload)?.unwrap();
      if (response?.success) {
        toast.success(response?.message);
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  return (
    <Card className="border-none shadow-none w-full max-w-4xl mx-auto bg-transparent">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-14 items-center md:items-start">
          <div className="flex flex-col items-center gap-4 shrink-0">
            <Label className="text-sm font-semibold text-slate-700">Profile Picture</Label>
            <div className="relative group">
              <div
                {...getRootProps()}
                className={cn(
                  "relative w-44 h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all duration-200",
                  isDragActive
                    ? "border-[#0B3C6D] bg-[#0B3C6D]/5 scale-[1.02]"
                    : "border-slate-200 hover:border-[#0B3C6D]/50 hover:bg-slate-50/50"
                )}
              >
                <input {...getInputProps()} />

                {displayImage ? (
                  <div className="w-full h-full relative">
                    <img
                      src={displayImage}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-2xl "
                    />
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white text-xs font-semibold gap-1 rounded-2xl">
                      <User className="h-5 w-5" />
                      <span>Change Photo</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <div className="p-3 rounded-full bg-slate-50 text-slate-400 group-hover:bg-[#0B3C6D]/8 group-hover:text-[#0B3C6D] transition-colors duration-200 mb-2 border">
                      <User className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 group-hover:text-[#0B3C6D]">
                      Upload Photo
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 max-w-[120px]">
                      JPG, PNG or WebP up to 5MB
                    </span>
                  </div>
                )}
              </div>

              {/* {displayImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1.5 shadow-md border border-white hover:scale-105 transition-all z-20"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )} */}
            </div>
          </div>

          <div className="space-y-6 flex-1 w-full">
            <h2 className="text-xl font-bold text-slate-800">General Information</h2>

            <div className="grid gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-slate-600 text-sm">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="h-11 border-slate-200 focus:border-[#0B3C6D] focus:ring-1 focus:ring-[#0B3C6D] rounded-xl transition-all"
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-600 text-sm">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  value={formData.email || "superadmin@myhome.com"}
                  className="h-11 bg-slate-50 border-slate-200 text-slate-400 rounded-xl select-none cursor-not-allowed opacity-85"
                />
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0B3C6D" strokeWidth="2.5" className="shrink-0">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  This email address is fixed and cannot be changed for Superadmin.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleSave}
                className="bg-[#0B3C6D] hover:bg-[#0B3C6D]/95 text-white px-8 h-11 rounded-xl shadow-sm text-sm font-medium"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformation;
