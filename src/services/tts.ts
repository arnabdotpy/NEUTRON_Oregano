import { toast } from "@/components/ui/use-toast";

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

export const generateVoiceover = async (text: string): Promise<Blob> => {
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to generate voiceover: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("Error generating voiceover:", error);
    toast({
      title: "Error",
      description: "Failed to generate voiceover. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};