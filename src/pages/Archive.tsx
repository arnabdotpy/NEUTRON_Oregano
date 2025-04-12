
import { useState, useEffect } from "react";
import { ArchivedContent } from "@/types";
import { getArchive } from "@/services/api";
import ContentHistory from "@/components/ContentHistory";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

const History = () => {
  const { toast } = useToast();
  
  const { data: history = [], isLoading, error, refetch } = useQuery({
    queryKey: ['content-history'],
    queryFn: getArchive,
    retry: 1,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading history",
        description: "Could not fetch your content history.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="container py-8">
      <ContentHistory 
        history={history} 
        refreshHistory={refetch} 
        isLoading={isLoading}
      />
    </div>
  );
};

export default History;
