
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Instagram, RefreshCw } from "lucide-react";
import { analyzeInstagramProfile, getInstagramAnalytics } from "@/services/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

const InstagramAnalytics = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || isLoading) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      // Get analytics data
      const analyticsData = await getInstagramAnalytics(username);
      setAnalytics(analyticsData);
      
      // Get AI analysis
      const analysisText = await analyzeInstagramProfile(username);
      setAnalysis(analysisText);
    } catch (error) {
      console.error("Error analyzing Instagram profile:", error);
      setError("Failed to analyze Instagram profile. Please check the username and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5 text-pink-500" />
            Instagram Analytics
          </CardTitle>
          <CardDescription>
            Enter your Instagram username to get analytics and AI-powered recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="flex gap-2">
            <Input
              placeholder="Instagram username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !username.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Analyze
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analytics && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
              <CardDescription>@{analytics.username}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Followers</p>
                <p className="text-2xl font-bold">{analytics.followers}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-bold">{analytics.engagement_rate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Post Frequency</p>
                <p className="text-2xl font-bold">{analytics.post_frequency}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Best Performing Content</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.best_performing_content.map((content: any, index: number) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{content.type}</p>
                        <p className="text-green-500">{content.engagement}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Topic: {content.topic}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Age Groups</h4>
                <div className="space-y-2">
                  {Object.entries(analytics.audience_demographics.age_groups).map(([age, percentage]) => {
                    return (
                      <div key={age} className="flex justify-between items-center">
                        <span>{age}</span>
                        <div className="w-2/3 bg-secondary rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: percentage }}
                          ></div>
                        </div>
                        <span className="text-sm">{percentage}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Top Locations</h4>
                <ul className="space-y-1">
                  {analytics.audience_demographics.top_locations.map((location: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      {location}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Based on your profile analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="space-y-4">
                  {analysis ? (
                    <div style={{ whiteSpace: "pre-wrap" }}>{analysis}</div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InstagramAnalytics;
