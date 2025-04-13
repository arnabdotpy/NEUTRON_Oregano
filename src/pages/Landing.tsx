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
  Layers,
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6 text-trendspark-green" />,
      title: "Trending Ideas",
      description:
        "AI-powered viral content suggestions that capture audience attention",
    },
    {
      icon: <Video className="h-6 w-6 text-trendspark-pink" />,
      title: "Video Scripts",
      description:
        "Ready-to-record short-form content scripts optimized for engagement",
    },
    {
      icon: <Music className="h-6 w-6 text-trendspark-blue" />,
      title: "Music Suggestions",
      description:
        "Trending tracks carefully selected to match your content's mood",
    },
    {
      icon: <Hash className="h-6 w-6 text-trendspark-orange" />,
      title: "Hashtag Generator",
      description:
        "Algorithm-driven hashtag recommendations to maximize your reach",
    },
    {
      icon: <LineChart className="h-6 w-6 text-trendspark-purple" />,
      title: "Performance Analytics",
      description:
        "Track your content generation patterns and optimize your strategy",
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
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/20 to-accent/30 py-20 md:py-32 relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container px-6 md:px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 glassmorphism rounded-full px-4 py-2 shadow-md">
              <Zap className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-trendspark-blue bg-clip-text text-transparent">
                Fuel Your Creativity with AI
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
              <span className="bg-gradient-to-r from-primary to-trendspark-blue bg-clip-text text-transparent">
                Craft Content That Catches Hearts
              </span>
            </h1>
            
            <p className="max-w-2xl text-muted-foreground text-lg md:text-xl font-light">
              Let AI help you brainstorm viral scripts, hooks, and ideas fast,
              fun, and ready to share with the world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 mt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-trendspark-blue hover:opacity-90 text-primary-foreground gap-2 px-8 py-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                onClick={() => navigate(user ? "/create" : "/auth")}
              >
                <Sparkles className="h-5 w-5" />
                {user ? "Create Content" : "Get Started Free"}
              </Button>
              
              {!user && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-muted hover:border-primary/50 px-8 py-6 rounded-xl transition-all duration-300"
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
      <section className="py-16 md:py-24 bg-card">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-card-foreground">
              Packed with Powerful Features
            </h2>
            <p className="text-muted-foreground mt-4 max-w-[700px] mx-auto">
              Everything you need to create engaging, viral-worthy content for
              your social media presence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-secondary/40 border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-background mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg text-card-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/20 to-accent/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Ready to Go Viral?
            </h2>
            <p className="text-muted-foreground max-w-[600px]">
              Join thousands of content creators using TrendSpark to generate
              engaging content ideas that capture audience attention.
            </p>
            <Button
              size="lg"
              className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground px-8"
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