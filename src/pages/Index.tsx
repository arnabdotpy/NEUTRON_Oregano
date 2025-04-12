
import { useState, useEffect } from "react";
import { Genre, Platform, GeneratedContent } from "@/types";
import InputForm from "@/components/InputForm";
import ContentResults from "@/components/ContentResults";
import LoadingDisplay from "@/components/LoadingDisplay";
import FeatureBanner from "@/components/FeatureBanner";
import UsageLimitDisplay from "@/components/UsageLimitDisplay";
import { generateContent, checkUsageLimit } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [lastGenre, setLastGenre] = useState<Genre>("Tech");
  const [lastPrompt, setLastPrompt] = useState("");
  const [withinLimit, setWithinLimit] = useState(true);
  const { user } = useAuth();

  const checkLimit = async () => {
    if (user) {
      const isWithinLimit = await checkUsageLimit();
      setWithinLimit(isWithinLimit);
      
      if (!isWithinLimit) {
        toast({
          title: "Daily limit reached",
          description: "You've reached your daily limit of 10 generations. Try again tomorrow.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    if (user) {
      checkLimit();
    }
  }, [user]);

  const handleGenerateContent = async (genre: Genre, prompt: string, platform: Platform, wordCount: WordCount) => {
    // Check limit again before generating
    if (user) {
      const isWithinLimit = await checkUsageLimit();
      if (!isWithinLimit) {
        toast({
          title: "Daily limit reached",
          description: "You've reached your daily limit of 10 generations. Try again tomorrow.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsLoading(true);
    setContent(null);
    setLastGenre(genre);
    setLastPrompt(prompt);

    try {
      const generatedContent = await generateContent(genre, prompt, platform, wordCount);
      setContent(generatedContent);
      // Refresh limit after successful generation
      checkLimit();
      
      toast({
        title: "Success!",
        description: "Your content has been generated",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      
      // General error message
      const errorMessage = error instanceof Error ? error.message : "Failed to generate content. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-1 md:col-span-3">
          <InputForm 
            onSubmit={handleGenerateContent} 
            isLoading={isLoading} 
            disabled={!withinLimit}
          />
        </div>
        {/* {user && (
          <div className="col-span-1">
            <UsageLimitDisplay onRefresh={checkLimit} />
          </div>
        )} */}
      </div>
      
      {isLoading && <LoadingDisplay />}
      
      {!isLoading && content && (
        <ContentResults 
          content={content} 
          genre={lastGenre} 
          prompt={lastPrompt} 
        />
      )}
      
      {!isLoading && !content && <FeatureBanner />}
    </div>
  );
};

export default Index;
