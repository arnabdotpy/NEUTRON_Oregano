
import { useState, useEffect } from "react";
import { Genre, Platform, GeneratedContent, WordCount } from "@/types";
import InputForm from "@/components/InputForm";
import ContentResults from "@/components/ContentResults";
import LoadingDisplay from "@/components/LoadingDisplay";
import FeatureBanner from "@/components/FeatureBanner";
import { generateContent, checkUsageLimit } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [lastGenre, setLastGenre] = useState<Genre>("Tech");
  const [lastPrompt, setLastPrompt] = useState("");
  const [selectedHashtag, setSelectedHashtag] = useState("");
  const [withinLimit, setWithinLimit] = useState(true);
  const [showForm, setShowForm] = useState(true);
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
    setShowForm(false);
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
    <div className="container py-4 space-y-8">
      <div className="grid grid-cols-1 gap-8">
        {/* <TrendingHashtags onHashtagSelect={(hashtag) => {
          setSelectedHashtag(hashtag);
          handleGenerateContent("Tech", hashtag, "Instagram Reels", "30");
        }} /> */}
        <div>
          {showForm && (
            <InputForm 
              onSubmit={handleGenerateContent} 
              isLoading={isLoading} 
            />
          )}
        </div>
      </div>
      
      {isLoading && <LoadingDisplay />}
      
      {!isLoading && content && !showForm && (
        <ContentResults 
          content={content} 
          genre={lastGenre} 
          prompt={lastPrompt} 
        />
      )}
      
      {!isLoading && showForm && <FeatureBanner />}

      {
        !showForm && (
        <div className="flex justify-center items-center">
          <button
            onClick={() => setShowForm(true)}
            className="text-sm font-semibold text-gray-500 flex items-center"
          >
            Start New <Sparkles className="ml-2 h-4 w-4" />
          </button>
        </div>
      )
      }
    </div>
  );
};

export default Index;
