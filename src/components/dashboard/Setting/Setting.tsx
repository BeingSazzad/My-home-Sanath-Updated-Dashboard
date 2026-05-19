import { FileText, Globe, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import AboutUs from "./AboutUs";
import ChangePassword from "./ChangePassword";
import FAQ from "./FAQ";
import PersonnalInformation from "./PersonnalInformation";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsCondition from "./TermsCondition";

const TABS = [
    { value: "general",  label: "Information",   icon: Globe,     delay: 100 },
    { value: "security", label: "Security",       icon: Shield,    delay: 300 },
    { value: "faq",      label: "FAQ",            icon: FileText,  delay: 400 },
    { value: "about",    label: "About Us",       icon: FileText,  delay: 400 },
    { value: "terms",    label: "Terms",          icon: FileText,  delay: 500 },
    { value: "privacy",  label: "Privacy Policy", icon: FileText,  delay: 600 },
];

export default function Setting() {
    return (
        <div className="p-5">
            <Tabs defaultValue="general" className="w-full">
                <div className="bg-white rounded-2xl p-7 mb-6 shadow-sm border border-slate-100">
                    <div>
                        <h2 className="title">Setting</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage application settings and administrative preferences.
                        </p>
                    </div>
                    <TabsList className="flex flex-wrap items-center gap-6 bg-transparent p-0 rounded-none w-fit border-0 mt-6">
                        {TABS.map(({ value, label, icon: Icon }) => (
                            <TabsTrigger
                                key={value}
                                value={value}
                                className="flex items-center gap-2 px-1 py-2 text-sm font-semibold rounded-none text-slate-400 hover:text-slate-800 border-0! outline-none! focus:outline-none! focus-visible:outline-none! focus:ring-0! focus-visible:ring-0! focus-visible:ring-offset-0! data-[state=active]:bg-transparent! data-[state=active]:text-[#0B3C6D]! data-[state=active]:shadow-none! transition-all cursor-pointer"
                            >
                                <Icon className="h-4.5 w-4.5" />
                                {label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <TabsContent value="general"><PersonnalInformation /></TabsContent>
                <TabsContent value="security"><ChangePassword /></TabsContent>
                <TabsContent value="faq"><FAQ /></TabsContent>
                <TabsContent value="about"><AboutUs /></TabsContent>
                <TabsContent value="terms"><TermsCondition /></TabsContent>
                <TabsContent value="privacy"><PrivacyPolicy /></TabsContent>
            </Tabs>
        </div>
    );
}
