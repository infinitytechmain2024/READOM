import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Reader from "./pages/Reader.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import ScriptoriumLayout from "./scriptorium/ScriptoriumLayout.tsx";
import ScriptoriumDashboard from "./scriptorium/pages/Dashboard.tsx";
import ScriptoriumBooks from "./scriptorium/pages/Books.tsx";
import ScriptoriumBookDetail from "./scriptorium/pages/BookDetail.tsx";
import ScriptoriumAnalytics from "./scriptorium/pages/Analytics.tsx";
import ScriptoriumMoney from "./scriptorium/pages/Money.tsx";
import ScriptoriumComments from "./scriptorium/pages/Comments.tsx";
import ScriptoriumSettings from "./scriptorium/pages/Settings.tsx";
import ScriptoriumSupport from "./scriptorium/pages/Support.tsx";
import ScriptoriumWrite from "./scriptorium/pages/Write.tsx";
import ScriptoriumPlaceholder from "./scriptorium/pages/Placeholder.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/READOM">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/book/:id" element={<Reader />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/scriptorium/write/:bookId?" element={<ScriptoriumWrite />} />
          <Route path="/scriptorium" element={<ScriptoriumLayout />}>
            <Route index element={<ScriptoriumDashboard />} />
            <Route path="dashboard" element={<ScriptoriumDashboard />} />
            <Route path="books" element={<ScriptoriumBooks />} />
            <Route path="book/:id" element={<ScriptoriumBookDetail />} />
            <Route path="analytics" element={<ScriptoriumAnalytics />} />
            <Route path="money" element={<ScriptoriumMoney />} />
            <Route path="comments" element={<ScriptoriumComments />} />
            <Route path="settings" element={<ScriptoriumSettings />} />
            <Route path="support" element={<ScriptoriumSupport />} />
            <Route path="*" element={<ScriptoriumPlaceholder />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
