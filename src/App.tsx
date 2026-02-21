import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";

// User Dashboard
import Dashboard from "./pages/Dashboard";
import BrowseListings from "./pages/user/BrowseListings";
import RoomRequests from "./pages/user/RoomRequests";
import PostListing from "./pages/user/PostListing";
import PostRoomRequest from "./pages/user/PostRoomRequest";
import Messages from "./pages/user/Messages";
import MyRatings from "./pages/user/MyRatings";
import ProfileVerification from "./pages/user/ProfileVerification";
import UserSettings from "./pages/user/UserSettings";

// Admin Dashboard
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminListings from "./pages/admin/AdminListings";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminVerifications from "./pages/admin/AdminVerifications";
import AdminReportedChats from "./pages/admin/AdminReportedChats";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/browse" element={<BrowseListings />} />
          <Route path="/dashboard/requests" element={<RoomRequests />} />
          <Route path="/dashboard/post" element={<PostListing />} />
          <Route path="/dashboard/post-request" element={<PostRoomRequest />} />
          <Route path="/dashboard/messages" element={<Messages />} />
          <Route path="/dashboard/ratings" element={<MyRatings />} />
          <Route path="/dashboard/profile" element={<ProfileVerification />} />
          <Route path="/dashboard/settings" element={<UserSettings />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/listings" element={<AdminListings />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
          <Route path="/admin/verifications" element={<AdminVerifications />} />
          <Route path="/admin/reported-chats" element={<AdminReportedChats />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
