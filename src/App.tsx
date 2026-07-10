import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { CustomerAuthProvider } from "./contexts/CustomerAuthContext";
import RequireAdminAuth from "./components/auth/RequireAdminAuth";
import RequireCustomerAuth from "./components/auth/RequireCustomerAuth";

const CampaignLanding = lazy(() => import("./pages/CampaignLanding"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminAppointments = lazy(() => import("./pages/admin/AdminAppointments"));
const AdminSlots = lazy(() => import("./pages/admin/AdminSlots"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminShopOrders = lazy(() => import("./pages/admin/AdminShopOrders"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminShopSettings = lazy(() => import("./pages/admin/AdminShopSettings"));
const AdminShopDashboard = lazy(() => import("./pages/admin/AdminShopDashboard"));

const Shop = lazy(() => import("./pages/shop/Shop"));
const ProductDetail = lazy(() => import("./pages/shop/ProductDetail"));
const Cart = lazy(() => import("./pages/shop/Cart"));
const Checkout = lazy(() => import("./pages/shop/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/shop/OrderConfirmation"));

const CustomerLogin = lazy(() => import("./pages/account/CustomerLogin"));
const CustomerRegister = lazy(() => import("./pages/account/CustomerRegister"));
const AccountLayout = lazy(() => import("./pages/account/AccountLayout"));
const AccountOverview = lazy(() => import("./pages/account/AccountOverview"));
const AccountOrders = lazy(() => import("./pages/account/AccountOrders"));
const AccountOrderDetail = lazy(() => import("./pages/account/AccountOrderDetail"));
const AccountProfile = lazy(() => import("./pages/account/AccountProfile"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <CustomerAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />

                <Route path="/campaigns/:slug" element={<CampaignLanding />} />

                {/* Shop (public browsing) */}
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:slug" element={<ProductDetail />} />

                {/* Cart / checkout require a logged-in customer */}
                <Route element={<RequireCustomerAuth />}>
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                </Route>

                {/* Customer account */}
                <Route path="/account/login" element={<CustomerLogin />} />
                <Route path="/account/register" element={<CustomerRegister />} />
                <Route element={<RequireCustomerAuth />}>
                  <Route path="/account" element={<AccountLayout />}>
                    <Route index element={<AccountOverview />} />
                    <Route path="orders" element={<AccountOrders />} />
                    <Route path="orders/:id" element={<AccountOrderDetail />} />
                    <Route path="profile" element={<AccountProfile />} />
                  </Route>
                </Route>

                <Route path="/admin" element={<AdminAuthProvider><Outlet /></AdminAuthProvider>}>
                  <Route path="login" element={<AdminLogin />} />
                  <Route element={<RequireAdminAuth />}>
                    <Route element={<AdminLayout />}>
                      <Route index element={<Navigate to="dashboard" replace />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="appointments" element={<AdminAppointments />} />
                      <Route path="slots" element={<AdminSlots />} />
                      <Route path="shop-dashboard" element={<AdminShopDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="shop-orders" element={<AdminShopOrders />} />
                      <Route path="customers" element={<AdminCustomers />} />
                      <Route path="shop-settings" element={<AdminShopSettings />} />
                    </Route>
                  </Route>
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </CustomerAuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
