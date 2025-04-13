
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, User, Lock, Mail } from "lucide-react";

const Auth = () => {
  const { signIn, signUp, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authMode === "signin") {
        await signIn(email, password);
        navigate("/");
      } else {
        await signUp(email, password);
        // Stay on page after signup to allow user to sign in
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <div className="container max-w-md py-12">
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-trendspark-blue" />
          <span className="text-3xl font-bold bg-gradient-to-r from-trendspark-blue to-trendspark-blue bg-clip-text text-transparent">
            Fusion
          </span>
        </div>
      </div>

      <Card className="border-2 border-gray-100 shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Fusion</CardTitle>
          <CardDescription>
            Sign in to access your viral content ideas and analytics
          </CardDescription>
        </CardHeader>

        <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as "signin" | "signup")}>
          <TabsList className="grid grid-cols-2 mx-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <form onSubmit={handleAuth}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-gray-500" />
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-trendspark-blue hover:bg-trendspark-blue/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    <span>{authMode === "signin" ? "Signing In..." : "Signing Up..."}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{authMode === "signin" ? "Sign In" : "Sign Up"}</span>
                  </div>
                )}
              </Button>
            </CardFooter>
          </form>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
