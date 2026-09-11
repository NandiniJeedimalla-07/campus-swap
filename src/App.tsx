import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SelectRole from "./pages/SelectRole";
import NotFound from "./pages/NotFound";

// Buyer Pages
import BuyerHome from "./pages/buyer/BuyerHome";
import BuyerItems from "./pages/buyer/BuyerItems";
import BuyerRentals from "./pages/buyer/BuyerRentals";
import BuyerActivity from "./pages/buyer/BuyerActivity";
import BuyerNotifications from "./pages/buyer/BuyerNotifications";
import BuyerSettings from "./pages/buyer/BuyerSettings";
import BuyerHelp from "./pages/buyer/BuyerHelp";

// Seller Pages
import SellerHome from "./pages/seller/SellerHome";
import SellerAddItem from "./pages/seller/SellerAddItem";
import SellerListings from "./pages/seller/SellerListings";
import SellerRequests from "./pages/seller/SellerRequests";
import SellerNotifications from "./pages/seller/SellerNotifications";
import SellerSettings from "./pages/seller/SellerSettings";
import SellerHelp from "./pages/seller/SellerHelp";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'buyer' | 'seller' }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!user?.role) {
    return <Navigate to="/select-role" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'seller' ? '/seller' : '/buyer'} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/select-role" element={<SelectRole />} />
      
      {/* Buyer Routes */}
      <Route path="/buyer" element={<ProtectedRoute requiredRole="buyer"><BuyerHome /></ProtectedRoute>} />
      <Route path="/buyer/items" element={<ProtectedRoute requiredRole="buyer"><BuyerItems /></ProtectedRoute>} />
      <Route path="/buyer/rentals" element={<ProtectedRoute requiredRole="buyer"><BuyerRentals /></ProtectedRoute>} />
      <Route path="/buyer/activity" element={<ProtectedRoute requiredRole="buyer"><BuyerActivity /></ProtectedRoute>} />
      <Route path="/buyer/notifications" element={<ProtectedRoute requiredRole="buyer"><BuyerNotifications /></ProtectedRoute>} />
      <Route path="/buyer/settings" element={<ProtectedRoute requiredRole="buyer"><BuyerSettings /></ProtectedRoute>} />
      <Route path="/buyer/help" element={<ProtectedRoute requiredRole="buyer"><BuyerHelp /></ProtectedRoute>} />
      
      {/* Profile Route */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      
      {/* Seller Routes */}
      <Route path="/seller" element={<ProtectedRoute requiredRole="seller"><SellerHome /></ProtectedRoute>} />
      <Route path="/seller/add-item" element={<ProtectedRoute requiredRole="seller"><SellerAddItem /></ProtectedRoute>} />
      <Route path="/seller/listings" element={<ProtectedRoute requiredRole="seller"><SellerListings /></ProtectedRoute>} />
      <Route path="/seller/requests" element={<ProtectedRoute requiredRole="seller"><SellerRequests /></ProtectedRoute>} />
      <Route path="/seller/notifications" element={<ProtectedRoute requiredRole="seller"><SellerNotifications /></ProtectedRoute>} />
      <Route path="/seller/settings" element={<ProtectedRoute requiredRole="seller"><SellerSettings /></ProtectedRoute>} />
      <Route path="/seller/help" element={<ProtectedRoute requiredRole="seller"><SellerHelp /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
