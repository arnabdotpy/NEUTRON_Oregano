import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

interface TrendingHashtag {
  name: string;
  tweet_volume: number;
}

interface TrendingHashtagsProps {
  onHashtagSelect: (hashtag: string) => void;
}

const TrendingHashtags = ({ onHashtagSelect }: TrendingHashtagsProps) => {
  const [hashtags, setHashtags] = useState<TrendingHashtag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingHashtags = async () => {
      try {
        // TODO: Replace with actual Twitter API integration
        // For now, using mock data
        const mockHashtags: TrendingHashtag[] = [
          { name: '#AI', tweet_volume: 52000 },
          { name: '#Technology', tweet_volume: 35000 },
          { name: '#Innovation', tweet_volume: 28000 },
          { name: '#DigitalTransformation', tweet_volume: 25000 },
          { name: '#FutureOfWork', tweet_volume: 20000 },
        ];
        setHashtags(mockHashtags);
      } catch (error) {
        console.error('Error fetching trending hashtags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingHashtags();
  }, []);

  const handleHashtagClick = (hashtag: string) => {
    onHashtagSelect(hashtag.replace('#', ''));
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto glassmorphism">
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            <span className="ml-2">Loading trending hashtags...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto glassmorphism">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-trendspark-purple" />
          <h3 className="text-lg font-semibold">Trending Topics</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {hashtags.map((hashtag) => (
            <Button
              key={hashtag.name}
              variant="outline"
              className="hover:bg-trendspark-purple hover:text-white transition-colors"
              onClick={() => handleHashtagClick(hashtag.name)}
            >
              {hashtag.name}
              <span className="ml-2 text-xs text-gray-500">{hashtag.tweet_volume.toLocaleString()}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingHashtags;