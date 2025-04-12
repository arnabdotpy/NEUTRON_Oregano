
import { useEffect } from "react";
import InstagramAnalytics from "@/components/InstagramAnalytics";
import { useToast } from "@/components/ui/use-toast";
import { trackAnalytics } from "@/services/api";

const InstagramInsights = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Track page visit
    trackAnalytics('visit_instagram_insights');
  }, [toast]);

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Instagram Insights</h1>
        <p className="text-muted-foreground">
          Analyze your Instagram profile performance and get AI-powered recommendations
        </p>
      </div>
      
      <InstagramAnalytics />
    </div>
  );
};

export default InstagramInsights;
