
import { useEffect } from "react";
import SocialMediaChatbot from "@/components/SocialMediaChatbot";
import { useToast } from "@/components/ui/use-toast";
import { trackAnalytics } from "@/services/api";

const ChatConsultant = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Track page visit
    trackAnalytics('visit_chat_consultant');
    
    // Welcome toast
    toast({
      title: "Welcome to TrendSpark Chat",
      description: "Ask anything about social media content creation and strategy.",
    });
  }, [toast]);

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Social Media Consultant</h1>
        <p className="text-muted-foreground">
          Chat with our AI assistant to get advice on content creation, strategy, and engagement
        </p>
      </div>
      
      <SocialMediaChatbot />
    </div>
  );
};

export default ChatConsultant;
