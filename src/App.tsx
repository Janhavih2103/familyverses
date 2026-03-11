import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import PoemsByAuthor from "./pages/PoemsByAuthor";
import PoemView from "./pages/PoemView";
import ManagePoems from "./pages/ManagePoems";
import NotFound from "./pages/NotFound";
import { supabase } from "./lib/supabase"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/poems/:author" element={<PoemsByAuthor />} />
          <Route path="/poem/:id" element={<PoemView />} />
          <Route path="/manage" element={<ManagePoems />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
