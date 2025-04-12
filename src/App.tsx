
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import History from "./pages/Archive";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Analytics from "./pages/Analytics";
import ChatConsultant from "./pages/ChatConsultant";
import InstagramInsights from "./pages/InstagramInsights";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/create" element={
                  <RequireAuth>
                    <Index />
                  </RequireAuth>
                } />
                <Route path="/history" element={
                  <RequireAuth>
                    <History />
                  </RequireAuth>
                } />
                <Route path="/analytics" element={
                  <RequireAuth>
                    <Analytics />
                  </RequireAuth>
                } />
                <Route path="/chat" element={
                  <RequireAuth>
                    <ChatConsultant />
                  </RequireAuth>
                } />
                <Route path="/instagram" element={
                  <RequireAuth>
                    <InstagramInsights />
                  </RequireAuth>
                } />
                <Route path="/about" element={<About />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/archive" element={<Navigate to="/history" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
