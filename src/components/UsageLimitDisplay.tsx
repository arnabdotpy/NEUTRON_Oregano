
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Zap } from "lucide-react";
import { getUsageStats } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface UsageLimitDisplayProps {
  onRefresh?: () => void;
}

const UsageLimitDisplay = ({ onRefresh }: UsageLimitDisplayProps) => {
  const [stats, setStats] = useState({ used: 0, limit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const usageStats = await getUsageStats();
      setStats(usageStats);
    } catch (error) {
      console.error("Error fetching usage stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const usagePercentage = (stats.used / stats.limit) * 100;
  const remaining = stats.limit - stats.used;

  if (!user) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Daily Usage Limit
        </CardTitle>
        <CardDescription>
          {remaining > 0 
            ? `You have ${remaining} generations remaining today` 
            : "You've reached your daily limit"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{stats.used} used</span>
            <span>{stats.limit} limit</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>
      </CardContent>
      {onRefresh && (
        <CardFooter className="pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs" 
            onClick={() => {
              fetchStats();
              if (onRefresh) onRefresh();
            }}
          >
            <Zap className="h-3 w-3 mr-1" />
            Refresh Limit
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default UsageLimitDisplay;
