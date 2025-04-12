
export type Genre = "Tech" | "Fashion" | "Comedy" | "Motivation" | "Food" | "Travel" | "Fitness" | "Music" | "Beauty" | "Finance";

export type Platform = "TikTok" | "Instagram Reels" | "YouTube Shorts";

export interface ContentIdea {
  title: string;
  description: string;
}

export interface StoryboardScene {
  id: number;
  title: string;
  description: string;
  visualTip: string;
}

export interface MusicRecommendation {
  title: string;
  artist: string;
  mood: string;
  trending: boolean;
  platform: Platform;
}

export type WordCount = "30" | "60" | "90" | "300" | "600";

export interface GeneratedContent {
  contentIdea: ContentIdea | null;
  hook: string | null;
  script: string | null;
  voiceoverUrl: string | null;
  hashtags: string[] | null;
  musicRecommendation: MusicRecommendation | null;
  storyboard: StoryboardScene[] | null;
  postingStrategy: {
    bestTime: string;
    platform: Platform[];
    caption: string;
  } | null;
}

export interface ArchivedContent extends GeneratedContent {
  id: string;
  date: string;
  genre: Genre;
  prompt: string;
}
