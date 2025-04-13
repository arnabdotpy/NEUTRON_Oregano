
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, Menu, ChevronDown, History, BarChart3, User, LogOut, MessageCircle, Instagram, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UsageLimitDisplay from "@/components/UsageLimitDisplay";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getInitials = (name: string = "User") => {
    return name.charAt(0).toUpperCase();
  };

  const navLinks = [
    {
      name: "Create Content",
      path: "/create",
      icon: <Sparkles className="h-4 w-4 mr-2" />,
      authRequired: true,
    },
    {
      name: "Saved",
      path: "/history",
      icon: <History className="h-4 w-4 mr-2" />,
      authRequired: true,
    },
    {
      name: "Usage",
      path: "/analytics",
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
      authRequired: true,
    },
    {
      name: "AI Chat Consultant",
      path: "/chat",
      icon: <MessageCircle className="h-4 w-4 mr-2" />,
      authRequired: true,
    },
    // {
    //   name: "Instagram Insights",
    //   path: "/instagram",
    //   icon: <Instagram className="h-4 w-4 mr-2" />,
    //   authRequired: true,
    // },
    {
      name: "About",
      path: "/about",
      icon: null,
      authRequired: true,
    },
  ];

  // Filter links based on auth status
  const filteredLinks = navLinks.filter(
    (link) => !link.authRequired || (link.authRequired && user)
  );

  return (
    <header className="border-b bg-background sticky top-0 z-30">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-1 rounded-md">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl hidden md:inline-block">
              TrendSpark
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {filteredLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons or User Menu */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                  aria-label="User menu"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {getInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/create")}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span>Create Content</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/history")}>
                  <History className="h-4 w-4 mr-2" />
                  <span>History</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/analytics")}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <span>Analytics</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/chat")}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <span>Chat Consultant</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/instagram")}>
                  <Instagram className="h-4 w-4 mr-2" />
                  <span>Instagram Insights</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/chat-generator")}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span>Chat Generator</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="m-1">
                  <UsageLimitDisplay />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign out</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/auth")}
                className="text-base hidden md:flex"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                className="hidden md:flex"
              >
                <User className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="mb-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4">
                {/* {user && (
                  <div className="mb-4">
                    <UsageLimitDisplay />
                  </div>
                )} */}
                
                {filteredLinks.map((link) => (
                  <Button
                    key={link.path}
                    variant={location.pathname === link.path ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => {
                      navigate(link.path);
                      setIsSheetOpen(false);
                    }}
                  >
                    {link.icon}
                    {link.name}
                  </Button>
                ))}
                
                {user ? (
                  <Button
                    variant="destructive"
                    className="mt-4"
                    onClick={() => {
                      handleSignOut();
                      setIsSheetOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </Button>
                ) : (
                  <div className="flex flex-col space-y-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate("/auth");
                        setIsSheetOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        navigate("/auth");
                        setIsSheetOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
