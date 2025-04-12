
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ArchivedContent } from "@/types";
import { 
  History, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  Trash2, 
  X 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import ContentResults from "./ContentResults";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { clearHistory, deleteHistoryItem } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

interface ContentHistoryProps {
  history: ArchivedContent[];
  refreshHistory: () => void;
  isLoading: boolean;
}

const ContentHistory = ({ history, refreshHistory, isLoading }: ContentHistoryProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleClearHistory = async () => {
    try {
      await clearHistory();
      refreshHistory();
      toast({
        title: "History cleared",
        description: "All saved content has been removed from your history",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear history",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      setIsDeleting(id);
      await deleteHistoryItem(id);
      refreshHistory();
      toast({
        title: "Content removed",
        description: "The item has been removed from your history",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Content History</h2>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <Alert className="max-w-3xl mx-auto">
        <AlertDescription className="flex flex-col items-center py-8 text-center">
          <History className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Your history is empty</h3>
          <p className="text-muted-foreground mb-4">
            Generate and save content to see it here
          </p>
          <Button onClick={() => window.location.href = "/create"}>
            Create New Content
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Content History</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshHistory}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear history</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all content from your history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearHistory}>
                  Clear
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="pb-3 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => handleDeleteItem(item.id)}
                disabled={isDeleting === item.id}
              >
                {isDeleting === item.id ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                <span className="sr-only">Delete</span>
              </Button>
              
              <div 
                className="flex justify-between items-center cursor-pointer pr-10" 
                onClick={() => toggleExpand(item.id)}
              >
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

export default ContentHistory;
