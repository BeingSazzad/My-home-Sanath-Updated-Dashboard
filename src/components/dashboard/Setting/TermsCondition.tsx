import { useEffect, useState } from "react";
import { FileText, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useAddDisclaimerMutation, useGetTermsConditionQuery } from "../../../redux/features/setting/settingApi";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import JoditEditorComponent from "../../Shared/JoditEditorComponent";

const TermsCondition = () => {
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { data: termsData } = useGetTermsConditionQuery({});
  const [addDisclaimer, { isLoading }] = useAddDisclaimerMutation();

  useEffect(() => {
    if (termsData?.content) {
      setContent(termsData.content);
    }
  }, [termsData]);

  const handleSave = async () => {
    try {
      const response = await addDisclaimer({ type: "TERMS", content }).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Terms & conditions updated");
        setIsEditing(false);
      } else if (response?.error && Array.isArray(response.error)) {
        response.error.forEach((err: { message: string }) => {
          toast.error(err.message, { id: "terms-condition" });
        });
      } else {
        toast.error(response?.message || "Something went wrong!", { id: "terms-condition" });
      }
    } catch {
      toast.error("Failed to update terms & conditions", { id: "terms-condition" });
    }
  };

  const handleCancel = () => {
    if (termsData?.content) setContent(termsData.content);
    setIsEditing(false);
  };

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="px-8 pb-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Terms & Conditions</h2>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="bg-red-600 hover:bg-red-700 text-white">
                <FileText className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>

          {isEditing ? (
            <>
              <JoditEditorComponent
                value={content}
                onChange={setContent}
                placeholder="Write your terms & conditions here..."
                height={400}
              />
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white">
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                  ) : (
                    <><Save className="h-4 w-4 mr-2" />Save Changes</>
                  )}
                </Button>
                <Button onClick={handleCancel} variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content || "<p>No content yet.</p>" }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TermsCondition;
