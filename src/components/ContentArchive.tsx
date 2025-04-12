
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArchivedContent } from "@/types";
import { BookmarkX, Calendar, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import ContentResults from "./ContentResults";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ContentArchiveProps {
  archive: ArchivedContent[];
  refreshArchive: () => void;
}

const ContentArchive = ({ archive, refreshArchive }: ContentArchiveProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleClearArchive = () => {
    localStorage.removeItem("trendspark-archive");
    refreshArchive();
    toast({
      title: "Archive cleared",
      description: "All saved content has been removed from your archive",
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (archive.length === 0) {
    return (
      <Alert className="max-w-3xl mx-auto">
        <AlertDescription className="flex flex-col items-center py-8 text-center">
          <BookmarkX className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Your archive is empty</h3>
          <p className="text-muted-foreground mb-4">
            Generate and save content to see it here
          </p>
          <Button onClick={() => window.location.href = "/"}>
            Create New Content
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Content Archive</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshArchive}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button variant="destructive" size="sm" onClick={handleClearArchive}>
            <BookmarkX className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {archive.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="pb-3 cursor-pointer" onClick={() => toggleExpand(item.id)}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">{item.contentIdea?.title}</CardTitle>
                {expandedId === item.id ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
              <CardDescription className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(item.date)}</span>
                <span className="mx-1">•</span>
                <span className="bg-secondary px-2 py-0.5 rounded text-xs">{item.genre}</span>
              </CardDescription>
            </CardHeader>
            
            {expandedId === item.id && (
              <CardContent className="pt-0">
                <ContentResults 
                  content={item} 
                  genre={item.genre} 
                  prompt={item.prompt} 
                />
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentArchive;
