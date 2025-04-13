
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageCircle, User, Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sendChatMessage } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  isStreaming?: boolean;
  fullContent?: string;
}

const SocialMediaChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! I'm your TrendSpark social media assistant. Ask me anything about content creation, social media strategy, or how to optimize your online presence!",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const streamText = async (text: string, messageId: string) => {
    let currentText = "";
    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, content: currentText }
            : msg
        )
      );
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    return currentText;
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Get response from API
      const response = await sendChatMessage(inputMessage);
      
      // Add assistant message to chat with streaming
      const messageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: messageId,
        content: "",
        fullContent: response,
        sender: "assistant",
        timestamp: new Date(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Stream the response
      await streamText(response, messageId);
      
      // Update message to mark streaming as complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I couldn't process your request. Please try again later.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-primary/10">
            <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">TrendSpark Assistant</CardTitle>
            <CardDescription>Your social media consultant</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-4 py-2">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex gap-2 max-w-[80%]">
                  {message.sender === "assistant" && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`rounded-lg px-4 py-2 prose prose-sm dark:prose-invert ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <p style={{ whiteSpace: "pre-wrap" }}>{message.content}</p>
                      ) : (
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-0">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputMessage.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default SocialMediaChatbot;
