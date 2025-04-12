
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Zap, Lightbulb, TrendingUp } from "lucide-react";

const AboutSection = () => {
  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
          <Sparkles className="h-7 w-7 text-trendspark-purple mr-2" />
          About TrendSpark
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          AI-powered content creation studio for social media creators
        </p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 text-trendspark-orange mr-2" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              TrendSpark was created to empower content creators with AI-driven insights and tools. 
              We believe that everyone has the potential to create viral, engaging content—sometimes 
              you just need that creative spark to get started. Our platform combines cutting-edge AI 
              with content strategy to help creators of all sizes stand out in today's crowded social media landscape.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 text-trendspark-yellow mr-2" />
              How TrendSpark Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              TrendSpark uses advanced AI from Gemini to analyze current trends across social media platforms
              and generate content ideas tailored to your genre. Simply select your content niche, add an optional
              prompt for more specific ideas, and our AI engine will create a complete content package for you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 text-trendspark-green mr-1" />
                  What You Get
                </h3>
                <ul className="space-y-1 list-disc list-inside text-sm">
                  <li>Viral content ideas tailored to your niche</li>
                  <li>Ready-to-use short-form video scripts</li>
                  <li>Attention-grabbing hooks and intros</li>
                  <li>Trending hashtag recommendations</li>
                  <li>Music suggestions from top trending tracks</li>
                  <li>Visual storyboard suggestions</li>
                  <li>Platform-specific posting strategies</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                  <Sparkles className="h-4 w-4 text-trendspark-purple mr-1" />
                  Perfect For
                </h3>
                <ul className="space-y-1 list-disc list-inside text-sm">
                  <li>Content creators facing creative blocks</li>
                  <li>Social media managers handling multiple accounts</li>
                  <li>Brands looking to stay on trend</li>
                  <li>Entrepreneurs building their personal brand</li>
                  <li>Anyone who wants to grow on social media</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 text-trendspark-pink mr-2" />
              The Technology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              TrendSpark is built using a modern stack including React, Tailwind CSS, and Google's 
              Gemini API. We've designed it to be fast, responsive, and user-friendly, with a focus 
              on providing immediate value to creators. Our content generation algorithms are 
              continuously learning from the latest trends to ensure you always receive fresh, 
              relevant suggestions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutSection;
