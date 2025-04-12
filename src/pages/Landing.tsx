import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Video, 
  Music, 
  Hash, 
  LineChart, 
  Award,
  BrainCircuit,
  Layers
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6 text-trendspark-green" />,
      title: "Trending Ideas",
      description: "AI-powered viral content suggestions that capture audience attention",
    },
    {
      icon: <Video className="h-6 w-6 text-trendspark-pink" />,
      title: "Video Scripts",
      description: "Ready-to-record short-form content scripts optimized for engagement",
    },
    {
      icon: <Music className="h-6 w-6 text-trendspark-blue" />,
      title: "Music Suggestions",
      description: "Trending tracks carefully selected to match your content's mood",
    },
    {
      icon: <Hash className="h-6 w-6 text-trendspark-orange" />,
      title: "Hashtag Generator",
      description: "Algorithm-driven hashtag recommendations to maximize your reach",
    },
    {
      icon: <LineChart className="h-6 w-6 text-trendspark-purple" />,
      title: "Performance Analytics",
      description: "Track your content generation patterns and optimize your strategy",
    },
    {
      icon: <BrainCircuit className="h-6 w-6 text-trendspark-teal" />,
      title: "AI-Powered",
      description: "Cutting-edge AI models trained on viral content patterns",
    },
    {
      icon: <Layers className="h-6 w-6 text-trendspark-red" />,
      title: "Multi-Platform",
      description: "Optimized for TikTok, Instagram Reels, and YouTube Shorts",
    },
    {
      icon: <Award className="h-6 w-6 text-trendspark-gold" />,
      title: "Premium Quality",
      description: "Professionally crafted templates and suggestions",
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-trendspark-purple/10 to-trendspark-blue/10 py-16 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-3 py-1 shadow-sm border">
              <Zap className="h-4 w-4 text-trendspark-purple" />
              <span className="text-sm font-medium">AI-Powered Content Creation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              <span className="bg-gradient-to-r from-trendspark-purple to-trendspark-blue bg-clip-text text-transparent">
                Spark Viral Content
              </span>
            </h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Create trending social media content with AI. Get viral script ideas, hooks, and strategies in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-2">
              <Button 
                size="lg"
                className="bg-trendspark-purple hover:bg-trendspark-purple/90 text-white gap-2"
                onClick={() => navigate(user ? "/create" : "/auth")}
              >
                <Sparkles className="h-5 w-5" />
                {user ? "Create Content" : "Get Started Free"}
              </Button>
              {!user && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Packed with Powerful Features
            </h2>
            <p className="text-gray-500 mt-4 max-w-[700px] mx-auto">
              Everything you need to create engaging, viral-worthy content for your social media presence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-gray-50 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-trendspark-purple/10 to-trendspark-blue/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to Go Viral?
            </h2>
            <p className="text-gray-500 max-w-[600px]">
              Join thousands of content creators using TrendSpark to generate engaging content ideas that capture audience attention.
            </p>
            <Button 
              size="lg" 
              className="mt-6 bg-trendspark-purple hover:bg-trendspark-purple/90 text-white px-8"
              onClick={() => navigate(user ? "/create" : "/auth")}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {user ? "Create Now" : "Start Creating for Free"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
