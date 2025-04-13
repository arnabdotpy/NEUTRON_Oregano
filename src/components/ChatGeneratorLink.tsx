import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const ChatGeneratorLink = () => {
  return (
    <Link
      to="/chat-generator"
      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      <MessageSquare className="w-4 h-4" />
      <span>Chat Generator</span>
    </Link>
  );
};

export default ChatGeneratorLink;