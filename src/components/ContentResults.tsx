
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GeneratedContent, Genre } from "@/types";
import { saveToArchive } from "@/services/api";
import { generateVoiceover } from "@/services/tts";
import { toast } from "@/components/ui/use-toast";
import { Copy, Download, Save, BookmarkPlus, Share2, Play, Pause, Volume2 } from "lucide-react";

interface ContentResultsProps {
  content: GeneratedContent;
  genre: Genre;
  prompt: string;
}

const ContentResults = ({ content, genre, prompt }: ContentResultsProps) => {
  const [activeTab, setActiveTab] = useState("script");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audio] = useState(new Audio());

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const handleSave = () => {
    saveToArchive(content, genre, prompt);
  };

  const handleDownload = () => {
    const contentText = `
    # TrendSpark Content - ${new Date().toLocaleDateString()}
    
    ## Content Idea
    ${content.contentIdea?.title}
    ${content.contentIdea?.description}
    
    ## Hook
    ${content.hook}
    
    ## Script
    ${content.script}
    
    ## Hashtags
    ${content.hashtags?.join(" ")}
    
    ## Music Recommendation
    ${content.musicRecommendation?.title} by ${content.musicRecommendation?.artist}
    
    ## Posting Strategy
    Best time: ${content.postingStrategy?.bestTime}
    Platforms: ${content.postingStrategy?.platform.join(", ")}
    Caption: ${content.postingStrategy?.caption}
    
    ## Storyboard
    ${content.storyboard?.map(scene => `
    Scene ${scene.id}: ${scene.title}
    ${scene.description}
    Visual: ${scene.visualTip}
    `).join("\n")}
    
    Generated with TrendSpark
    `;

    const blob = new Blob([contentText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trendspark-content-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Content saved as text file",
    });
  };

  const toggleAudioPlayback = async () => {
    if (!audioUrl && !isGenerating) {
      try {
        setIsGenerating(true);
        const voiceoverBlob = await generateVoiceover(content.script || "");
        const url = URL.createObjectURL(voiceoverBlob);
        setAudioUrl(url);
        audio.src = url;
        audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
      } finally {
        setIsGenerating(false);
      }
    } else if (audioUrl) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const downloadVoiceover = async () => {
    if (!audioUrl && !isGenerating) {
      try {
        setIsGenerating(true);
        const voiceoverBlob = await generateVoiceover(content.script || "");
        const url = URL.createObjectURL(voiceoverBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `trendspark-voiceover-${Date.now()}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({
          title: "Success",
          description: "Voiceover downloaded successfully",
        });
      } catch (error) {
        console.error("Error downloading voiceover:", error);
      } finally {
        setIsGenerating(false);
      }
    } else if (audioUrl) {
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = `trendspark-voiceover-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast({
        title: "Success",
        description: "Voiceover downloaded successfully",
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="glassmorphism overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">{content.contentIdea?.title}</CardTitle>
          <CardDescription>{content.contentIdea?.description}</CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="script" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="grid grid-cols-3 md:grid-cols-5 gap-1">
              <TabsTrigger value="script">Script</TabsTrigger>
              <TabsTrigger value="storyboard">Storyboard</TabsTrigger>
              <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
              <TabsTrigger value="music">Music</TabsTrigger>
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="pt-6">
            <TabsContent value="script" className="mt-0 space-y-4">
              <div className="space-y-4">
                {/* <div className="p-4 bg-secondary/50 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Attention-Grabbing Hook</h3>
                  <p className="italic text-muted-foreground">{content.hook}</p>
                  </div> */}
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">AI Generated Script 🔥</h3>
                  <p className="whitespace-pre-line">{content.script}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex flex-1 gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 flex items-center justify-center gap-2 bg-trendspark-green text-white hover:text-white hover:bg-trendspark-green animate-pulse"
                      onClick={toggleAudioPlayback}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                          Generating...
                        </>
                      ) : isPlaying ? (
                        <>
                          <Pause className="h-4 w-4" />
                          Pause Voiceover
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          {audioUrl ? "Play Voiceover" : "Generate AI Voiceover"}
                        </>
                      )}
                    </Button>
                    {
                      audioUrl &&
                      <Button
                        variant="outline"
                        className="flex items-center justify-center gap-2"
                        onClick={downloadVoiceover}
                        disabled={isGenerating}
                      >
                        <Download className="h-4 w-4" />
                        {isGenerating ? "Generating..." : "Download Voiceover"}
                      </Button>
                    }
                  </div>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleCopy(content.script || "", "Script")}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Script
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="storyboard" className="mt-0">
              <div className="space-y-4">
                {content.storyboard?.map((scene) => (
                  <div key={scene.id} className="p-4 bg-secondary/50 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Scene {scene.id}: {scene.title}</h3>
                    </div>
                    <p className="text-sm">{scene.description}</p>
                    <div className="bg-background/50 p-2 rounded text-sm">
                      <span className="font-medium">Visual Tip:</span> {scene.visualTip}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleCopy(content.storyboard?.map(scene => 
                    `Scene ${scene.id}: ${scene.title}\n${scene.description}\nVisual Tip: ${scene.visualTip}`
                  ).join("\n\n") || "", "Storyboard")}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Storyboard
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="hashtags" className="mt-0">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {content.hashtags?.map((tag, index) => (
                    <div 
                      key={index} 
                      className="bg-trendspark-purple/10 text-trendspark-purple px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleCopy(content.hashtags?.map(tag => `${tag}`).join(" ") || "", "Hashtags")}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Hashtags
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="music" className="mt-0">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <h3 className="font-medium text-lg mb-2">Recommended Background Track</h3>
                <div className="space-y-2">
                  <p className="font-medium">{content.musicRecommendation?.title}</p>
                  <p className="text-sm text-muted-foreground">Artist: {content.musicRecommendation?.artist}</p>
                  <p className="text-sm text-muted-foreground">Mood: {content.musicRecommendation?.mood}</p>
                  <p className="text-sm text-muted-foreground">Platform: {content.musicRecommendation?.platform}</p>
                  {content.musicRecommendation?.trending && (
                    <div className="bg-trendspark-purple/10 text-trendspark-purple px-2 py-1 rounded text-xs inline-block">
                      Trending
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="strategy" className="mt-0 space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-medium">Best Time to Post</h3>
                    <p className="text-sm">{content.postingStrategy?.bestTime}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-medium">Recommended Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                      {content.postingStrategy?.platform.map((platform, i) => (
                        <div key={i} className="bg-trendspark-purple/10 text-trendspark-purple px-2 py-1 rounded text-sm">
                          {platform}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* <div className="space-y-1">
                    <h3 className="font-medium">Suggested Caption</h3>
                    <p className="text-sm">{content.postingStrategy?.caption}</p>
                  </div> */}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleCopy(content.postingStrategy?.caption || "", "Caption")}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Caption
                </Button>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <CardFooter className="flex flex-wrap gap-2 justify-between">
          <div className="flex gap-2">
            <Button variant="default" className="bg-trendspark-purple hover:bg-trendspark-purple/90" onClick={handleSave}>
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ContentResults;
