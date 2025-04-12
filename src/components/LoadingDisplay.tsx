
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const LoadingDisplay = () => {
  return (
    <Card className="w-full max-w-3xl mx-auto glassmorphism">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-trendspark-purple animate-pulse-light" />
          <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
        </CardTitle>
        <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="h-20 w-full bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
        </div>
        
        <div className="space-y-2">
          <div className="h-4 w-1/4 bg-muted rounded animate-pulse"></div>
          <div className="h-20 w-full bg-muted rounded animate-pulse"></div>
        </div>
        
        <div className="space-y-2">
          <div className="h-4 w-2/5 bg-muted rounded animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-muted rounded-full animate-pulse"></div>
            <div className="h-8 w-24 bg-muted rounded-full animate-pulse"></div>
            <div className="h-8 w-16 bg-muted rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingDisplay;
