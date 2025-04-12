
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, Zap, Video, Music, Hash } from "lucide-react";

const FeatureBanner = () => {
  const features = [
    {
      icon: <TrendingUp className="h-5 w-5 text-trendspark-green" />,
      title: "Trending Ideas",
      description: "AI-powered viral content suggestions",
    },
    {
      icon: <Video className="h-5 w-5 text-trendspark-pink" />,
      title: "Video Scripts",
      description: "Ready-to-record short-form content",
    },
    {
      icon: <Music className="h-5 w-5 text-trendspark-blue" />,
      title: "Music Suggestions",
      description: "Trending tracks for your content",
    },
    {
      icon: <Hash className="h-5 w-5 text-trendspark-orange" />,
      title: "Hashtag Generator",
      description: "Maximize your reach with trending tags",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-trendspark-purple mr-2" />
          Spark Your Social Media Success
        </h2>
        <p className="text-muted-foreground">
          AI-powered tools to elevate your content creation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="overflow-hidden h-full gradient-border">
            <CardContent className="p-6 flex items-start space-x-4">
              <div className="bg-secondary rounded-full p-3">
                {feature.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeatureBanner;
