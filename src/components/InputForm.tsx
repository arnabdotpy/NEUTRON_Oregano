
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Genre, Platform } from "@/types";
import { Sparkles } from "lucide-react";

interface InputFormProps {
  onSubmit: (genre: Genre, prompt: string, platform: Platform) => void;
  isLoading: boolean;
}

const genreOptions: Genre[] = [
  "Tech",
  "Fashion",
  "Comedy",
  "Motivation",
  "Food",
  "Travel",
  "Fitness",
  "Music",
  "Beauty",
  "Finance",
];

const platformOptions: Platform[] = [
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
];

const InputForm = ({ onSubmit, isLoading }: InputFormProps) => {
  const [genre, setGenre] = useState<Genre>("Tech");
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState<Platform>("TikTok");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(genre, prompt, platform);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto glassmorphism">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-trendspark-purple" />
            Create Viral Content
          </CardTitle>
          <CardDescription>
            Generate trending content ideas, scripts, and posting strategies for your social media
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="genre" className="text-sm font-medium">
              Select Content Genre
            </label>
            <Select
              value={genre}
              onValueChange={(value) => setGenre(value as Genre)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                {genreOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="platform" className="text-sm font-medium">
              Target Platform
            </label>
            <Select
              value={platform}
              onValueChange={(value) => setPlatform(value as Platform)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platformOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Your Content Idea (optional)
            </label>
            <Textarea
              id="prompt"
              placeholder="Enter your content idea or leave blank for inspiration"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="resize-none min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-trendspark-purple hover:bg-trendspark-purple/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default InputForm;
