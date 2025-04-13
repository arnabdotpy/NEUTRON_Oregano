import { Genre, Platform, GeneratedContent, ArchivedContent, MusicRecommendation, WordCount } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

const DAILY_USAGE_LIMIT = 200;

const mockMusicRecommendations: Record<Genre, MusicRecommendation[]> = {
  "Tech": [
    { title: "Digital Dreams", artist: "Synthwave Collective", mood: "Futuristic", trending: true, platform: "TikTok" },
    { title: "AI Revolution", artist: "Byte Masters", mood: "Energetic", trending: true, platform: "Instagram Reels" },
    { title: "Code & Chill", artist: "Dev Lofi", mood: "Relaxed", trending: false, platform: "YouTube Shorts" }
  ],
  "Fashion": [
    { title: "Runway Beats", artist: "Style Sonics", mood: "Elegant", trending: true, platform: "Instagram Reels" },
    { title: "Fabric Feel", artist: "Textile Tones", mood: "Smooth", trending: true, platform: "TikTok" },
    { title: "Vogue Vision", artist: "Haute Harmony", mood: "Sophisticated", trending: false, platform: "YouTube Shorts" }
  ],
  "Comedy": [
    { title: "Laugh Track", artist: "Funny Phonics", mood: "Playful", trending: true, platform: "TikTok" },
    { title: "Punchline Pop", artist: "Comedy Club", mood: "Upbeat", trending: true, platform: "Instagram Reels" },
    { title: "Silly Symphony", artist: "Jest Jammers", mood: "Light", trending: false, platform: "YouTube Shorts" }
  ],
  "Motivation": [
    { title: "Rise Up", artist: "Inspire Instrumentals", mood: "Uplifting", trending: true, platform: "Instagram Reels" },
    { title: "Dream Chaser", artist: "Goal Getters", mood: "Determined", trending: true, platform: "TikTok" },
    { title: "Victory March", artist: "Success Sounds", mood: "Triumphant", trending: false, platform: "YouTube Shorts" }
  ],
  "Food": [
    { title: "Kitchen Groove", artist: "Culinary Beats", mood: "Appetizing", trending: true, platform: "TikTok" },
    { title: "Tasty Tunes", artist: "Flavor Notes", mood: "Savory", trending: true, platform: "Instagram Reels" },
    { title: "Dessert Delights", artist: "Sweet Sounds", mood: "Indulgent", trending: false, platform: "YouTube Shorts" }
  ],
  "Travel": [
    { title: "Wanderlust Waves", artist: "Journey Jams", mood: "Adventurous", trending: true, platform: "Instagram Reels" },
    { title: "Passport Pulse", artist: "Global Grooves", mood: "Exotic", trending: true, platform: "TikTok" },
    { title: "Horizon Harmony", artist: "Voyage Vibes", mood: "Expansive", trending: false, platform: "YouTube Shorts" }
  ],
  "Fitness": [
    { title: "Pump Up Power", artist: "Workout Warriors", mood: "Energizing", trending: true, platform: "TikTok" },
    { title: "Endorphin Rush", artist: "Fit Beats", mood: "Dynamic", trending: true, platform: "Instagram Reels" },
    { title: "Strong & Steady", artist: "Muscle Music", mood: "Powerful", trending: false, platform: "YouTube Shorts" }
  ],
  "Music": [
    { title: "Beat Breaker", artist: "Rhythm Republic", mood: "Catchy", trending: true, platform: "TikTok" },
    { title: "Melody Maker", artist: "Tune Tribe", mood: "Harmonious", trending: true, platform: "Instagram Reels" },
    { title: "Chord Cascade", artist: "Note Nomads", mood: "Flowing", trending: false, platform: "YouTube Shorts" }
  ],
  "Beauty": [
    { title: "Glow Up Groove", artist: "Glamour Gang", mood: "Shimmering", trending: true, platform: "Instagram Reels" },
    { title: "Pretty Pulse", artist: "Beauty Beats", mood: "Elegant", trending: true, platform: "TikTok" },
    { title: "Style Serenade", artist: "Makeup Melodies", mood: "Refined", trending: false, platform: "YouTube Shorts" }
  ],
  "Finance": [
    { title: "Money Moves", artist: "Wealth Waves", mood: "Confident", trending: true, platform: "TikTok" },
    { title: "Investment Inflection", artist: "Capital Crew", mood: "Strategic", trending: true, platform: "Instagram Reels" },
    { title: "Budget Beats", artist: "Finance Flows", mood: "Thoughtful", trending: false, platform: "YouTube Shorts" }
  ]
};

export const trackAnalytics = async (
  action: string,
  genre?: Genre,
  platform?: Platform,
  metadata?: any
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return; // Only track for authenticated users
    
    await supabase.from('user_analytics').insert({
      user_id: user.id,
      action,
      genre,
      platform,
      metadata
    });
  } catch (error) {
    console.error("Error tracking analytics:", error);
  }
};

export const checkUsageLimit = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return true; // No limit for unauthenticated users (they'll be redirected to login)
    
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    
    const { data, error, count } = await supabase
      .from('user_analytics')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('action', 'generate_content')
      .gte('created_at', startOfDay);
      
    if (error) throw error;
    
    return (count || 0) < DAILY_USAGE_LIMIT;
  } catch (error) {
    console.error("Error checking usage limit:", error);
    return true; // Default to allowing if check fails
  }
};

export const getUsageStats = async (): Promise<{ used: number, limit: number }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { used: 0, limit: DAILY_USAGE_LIMIT };
    
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    
    const { data, error, count } = await supabase
      .from('user_analytics')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('action', 'generate_content')
      .gte('created_at', startOfDay);
      
    if (error) throw error;
    
    return { 
      used: count || 0, 
      limit: DAILY_USAGE_LIMIT 
    };
  } catch (error) {
    console.error("Error getting usage stats:", error);
    return { used: 0, limit: DAILY_USAGE_LIMIT };
  }
};

export const generateContent = async (
  genre: Genre,
  prompt: string,
  platform: Platform,
  wordCount: WordCount
): Promise<GeneratedContent> => {
  try {
    // Check usage limit first
    const withinLimit = await checkUsageLimit();
    if (!withinLimit) {
      throw new Error("You've reached your daily limit of 10 generations");
    }

    const userPrompt = `
    You are TrendSpark, an AI content generator for social media creators.
    
    Generate trending social media content for the genre: ${genre} and platform: ${platform}.
    
    User idea: "${prompt}"
    
    Return a JSON object only with these fields (no explanations, ONLY valid JSON):
    {
      "contentIdea": {
        "title": "Catchy title for the content idea",
        "description": "Brief description of the viral content idea"
      },
      "hook": "An attention-grabbing first line for the video",
      "script": "A script with approximately ${parseInt(wordCount) >= 300 ? `${Math.round(parseInt(wordCount) * 2.5)} words` : `${Math.round(parseInt(wordCount) * 2.5)} words`} for ${platform} in a conversational creator tone",
      "hashtags": ["5-8 trending hashtags as an array of strings"],
      "storyboard": [
        {"id": 1, "title": "Hook", "description": "What to say in this scene", "visualTip": "How to film or what to show"},
        {"id": 2, "title": "Main Point", "description": "What to say in this scene", "visualTip": "How to film or what to show"},
        {"id": 3, "title": "Call to Action", "description": "What to say in this scene", "visualTip": "How to film or what to show"},
        add more needed scenes
      ],
      "postingStrategy": {
        "bestTime": "Best time of day to post",
        "platform": ["Primary platform", "Secondary platform"],
        "caption": "Suggested caption with emojis"
      }
    }

    The JSON must be valid and complete.
    `;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: userPrompt }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate content");
    }

    const data = await response.json();
    
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    let jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from API");
    }
    
    const jsonResponse = JSON.parse(jsonMatch[0]);
    
    // Select a random music recommendation based on genre
    const musicRecs = mockMusicRecommendations[genre as keyof typeof mockMusicRecommendations] || mockMusicRecommendations.Tech;
    const randomMusic = musicRecs[Math.floor(Math.random() * musicRecs.length)];

    const generatedContent = {
      contentIdea: jsonResponse.contentIdea,
      hook: jsonResponse.hook,
      script: jsonResponse.script,
      voiceoverUrl: null, // This would be implemented with ElevenLabs or another TTS API
      hashtags: jsonResponse.hashtags,
      musicRecommendation: randomMusic,
      storyboard: jsonResponse.storyboard,
      postingStrategy: jsonResponse.postingStrategy
    };

    // Track content generation analytics for authenticated users
    trackAnalytics('generate_content', genre, platform, { promptLength: prompt.length });

    return generatedContent;
  } catch (error) {
    console.error("Error generating content:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate content. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

export const saveToArchive = async (content: GeneratedContent, genre: Genre, prompt: string): Promise<void> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Save to Supabase
      const platformList = content.postingStrategy?.platform || [content.musicRecommendation?.platform || ''];
      
      // Convert the content to a proper JSON type that Supabase accepts
      const contentJson: Json = content as unknown as Json;
      
      await supabase.from('saved_content').insert({
        user_id: user.id,
        content_data: contentJson,
        genre,
        prompt,
        platform_list: platformList
      });
      
      // Track analytics
      trackAnalytics('save_content', genre, platformList[0] as Platform);
    } else {
      // Fallback to localStorage for anonymous users
      const archive = localStorage.getItem("trendspark-archive");
      const archiveData: ArchivedContent[] = archive ? JSON.parse(archive) : [];
      
      const newItem: ArchivedContent = {
        ...content,
        id: Math.random().toString(36).substring(2, 9),
        date: new Date().toISOString(),
        genre,
        prompt
      };
      
      archiveData.unshift(newItem);
      localStorage.setItem("trendspark-archive", JSON.stringify(archiveData.slice(0, 10))); // Keep last 10 items
    }
    
    toast({
      title: "Saved",
      description: "Content saved to your archive",
    });
  } catch (error) {
    console.error("Error saving to archive:", error);
    toast({
      title: "Error",
      description: "Failed to save content to archive",
      variant: "destructive",
    });
  }
};

export const getArchive = async (): Promise<ArchivedContent[]> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Get from Supabase
      const { data, error } = await supabase
        .from('saved_content')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Track analytics
      trackAnalytics('view_archive');
      
      // Convert Supabase data to ArchivedContent format
      return data.map(item => ({
        ...item.content_data as unknown as GeneratedContent,
        id: item.id,
        date: item.created_at,
        genre: item.genre as Genre,
        prompt: item.prompt || ""
      }));
    } else {
      // Fallback to localStorage for anonymous users
      const archive = localStorage.getItem("trendspark-archive");
      return archive ? JSON.parse(archive) : [];
    }
  } catch (error) {
    console.error("Error getting archive:", error);
    return [];
  }
};

export const clearHistory = async (): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Delete from Supabase
      const { error } = await supabase
        .from('saved_content')
        .delete()
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Track analytics
      trackAnalytics('clear_history');
    } else {
      // Clear localStorage for anonymous users
      localStorage.removeItem("trendspark-archive");
    }
  } catch (error) {
    console.error("Error clearing history:", error);
    throw error;
  }
};

export const deleteHistoryItem = async (id: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Delete from Supabase
      const { error } = await supabase
        .from('saved_content')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Track analytics
      trackAnalytics('delete_history_item');
    } else {
      // Delete from localStorage for anonymous users
      const archive = localStorage.getItem("trendspark-archive");
      if (archive) {
        const items: ArchivedContent[] = JSON.parse(archive);
        const updatedItems = items.filter(item => item.id !== id);
        localStorage.setItem("trendspark-archive", JSON.stringify(updatedItems));
      }
    }
  } catch (error) {
    console.error("Error deleting history item:", error);
    throw error;
  }
};

export const getContentGenerationStats = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('user_analytics')
      .select('created_at, genre, platform')
      .eq('action', 'generate_content')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return null;
  }
};

export const sendChatMessage = async (message: string): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const userPrompt = `
    You are TrendSpark Assistant, an AI social media consultant.
    
    User message: "${message}"
    
    Provide helpful advice about social media strategy, content creation, or platform-specific tips.
    Keep your response concise and actionable.
    If you're unsure about something, be honest about limitations.
    `;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: userPrompt }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get chatbot response");
    }

    const data = await response.json();
    
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Track analytics if user is authenticated
    if (user) {
      trackAnalytics('use_chatbot', undefined, undefined, { 
        message_length: message.length,
        response_length: textResponse.length 
      });
    }
    
    return textResponse;
  } catch (error) {
    console.error("Error in chatbot:", error);
    throw error;
  }
};

export const getInstagramAnalytics = async (username: string): Promise<any> => {
  try {
    // This is a mock implementation as actual Instagram API would require OAuth
    // In a real implementation, this would connect to Instagram Graph API
    
    // Mock delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock analytics data
    return {
      username,
      followers: Math.floor(Math.random() * 5000) + 500,
      engagement_rate: (Math.random() * 5 + 1).toFixed(2) + "%",
      post_frequency: Math.floor(Math.random() * 5) + 1 + " posts per week",
      best_performing_content: [
        {
          type: "Reel",
          engagement: (Math.random() * 10 + 5).toFixed(2) + "%",
          topic: ["Entertainment", "Tutorial", "Behind the Scenes"][Math.floor(Math.random() * 3)]
        },
        {
          type: "Photo",
          engagement: (Math.random() * 8 + 3).toFixed(2) + "%",
          topic: ["Product", "Lifestyle", "Educational"][Math.floor(Math.random() * 3)]
        }
      ],
      audience_demographics: {
        age_groups: {
          "18-24": Math.floor(Math.random() * 30) + 10 + "%",
          "25-34": Math.floor(Math.random() * 30) + 20 + "%",
          "35-44": Math.floor(Math.random() * 20) + 10 + "%",
          "45+": Math.floor(Math.random() * 20) + 5 + "%"
        },
        top_locations: [
          "United States",
          "United Kingdom",
          "Canada",
          "Australia"
        ].sort(() => Math.random() - 0.5).slice(0, 3)
      }
    };
  } catch (error) {
    console.error("Error fetching Instagram analytics:", error);
    throw error;
  }
};

export const analyzeInstagramProfile = async (username: string): Promise<string> => {
  try {
    const analytics = await getInstagramAnalytics(username);
    
    const promptForAI = `
    You are TrendSpark's Instagram Analyst, an AI that provides actionable insights for Instagram creators.
    
    Analyze this Instagram profile data and provide strategic recommendations:
    
    Username: ${username}
    Followers: ${analytics.followers}
    Engagement Rate: ${analytics.engagement_rate}
    Post Frequency: ${analytics.post_frequency}
    Best Performing Content: ${JSON.stringify(analytics.best_performing_content)}
    Audience Demographics: ${JSON.stringify(analytics.audience_demographics)}
    
    Provide a brief analysis with 3-5 specific, actionable recommendations to improve the account's performance.
    Keep your response concise (no more than 300 words).
    `;
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: promptForAI }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze Instagram profile");
    }

    const data = await response.json();
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error analyzing Instagram profile:", error);
    throw error;
  }
};
