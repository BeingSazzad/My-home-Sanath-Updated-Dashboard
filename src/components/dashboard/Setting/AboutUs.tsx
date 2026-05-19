import { useEffect, useState } from "react";
import { FileText, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useAddDisclaimerMutation, useGetAboutQuery } from "../../../redux/features/setting/settingApi";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import JoditEditorComponent from "../../Shared/JoditEditorComponent";

const AboutUs = () => {
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { data: aboutData } = useGetAboutQuery({});
  const [addDisclaimer, { isLoading }] = useAddDisclaimerMutation();

  useEffect(() => {
    if (aboutData?.content) {
      setContent(aboutData.content);
    }
  }, [aboutData]);

  const handleSave = async () => {
    try {
      const response = await addDisclaimer({ type: "ABOUT", content }).unwrap();

      if (response?.success) {
        toast.success(response?.message || "About page updated");
        setIsEditing(false);
      } else if (response?.error && Array.isArray(response.error)) {
        response.error.forEach((err: { message: string }) => {
          toast.error(err.message, { id: "about-us" });
        });
      } else {
        toast.error(response?.message || "Something went wrong!", { id: "about-us" });
      }
    } catch {
      toast.error("Failed to update about page", { id: "about-us" });
    }
  };

  const handleCancel = () => {
    if (aboutData?.content) setContent(aboutData.content);
    setIsEditing(false);
  };

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="px-8 pb-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">About Us</h2>
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
                placeholder="Write your about us content here..."
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

export default AboutUs;
