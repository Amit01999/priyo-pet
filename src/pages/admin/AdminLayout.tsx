import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarClock,
  ListChecks,
  LogOut,
  PawPrint,
  Store,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Settings,
  ChevronRight,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { AdminCampaignProvider, useAdminCampaign } from '@/contexts/AdminCampaignContext';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/appointments', label: 'Appointments', icon: CalendarClock },
  { to: '/admin/slots', label: 'Slot Management', icon: ListChecks },
];

const SHOP_NAV_ITEMS = [
  { to: '/admin/shop-dashboard', label: 'Shop Dashboard', icon: Store },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/shop-orders', label: 'Shop Orders', icon: ShoppingCart },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/shop-settings', label: 'Shop Settings', icon: Settings },
];

const NAV_LINK_BASE =
  'text-[#EFFDF0]/70 hover:bg-white/[0.06] hover:text-white rounded-xl transition-colors duration-200';
const NAV_LINK_ACTIVE = 'bg-[#E86A10] text-white font-medium hover:bg-[#E86A10] hover:text-white';

const CampaignSelector = () => {
  const { campaigns, selectedSlug, setSelectedSlug, isLoading } = useAdminCampaign();

  if (isLoading || campaigns.length === 0) return null;

  return (
    <Select value={selectedSlug ?? undefined} onValueChange={setSelectedSlug}>
      <SelectTrigger className="w-full bg-white/[0.06] border-white/10 text-[#EFFDF0] focus:ring-[#E86A10]">
        <SelectValue placeholder="Select campaign" />
      </SelectTrigger>
      <SelectContent>
        {campaigns.map((c) => (
          <SelectItem key={c.slug} value={c.slug}>
            {c.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const ALL_NAV_ITEMS = [...NAV_ITEMS, ...SHOP_NAV_ITEMS];

const AdminLayoutInner = () => {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const currentLabel = ALL_NAV_ITEMS.find((item) => item.to === location.pathname)?.label ?? 'Dashboard';

  return (
    <SidebarProvider>
      <Sidebar className="border-r-0">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2.5 font-poppins font-bold text-white text-lg mb-4 px-1">
            <span className="w-8 h-8 rounded-xl bg-[#E86A10] flex items-center justify-center flex-shrink-0">
              <PawPrint className="w-4 h-4 text-white" />
            </span>
            PriyoPet Admin
          </div>
          <CampaignSelector />
        </SidebarHeader>
        <SidebarContent className="px-1">
          <SidebarGroup>
            <SidebarGroupLabel className="text-[#EFFDF0]/40 uppercase tracking-wider text-[10px] font-semibold px-3">
              Campaign
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild className={NAV_LINK_BASE}>
                      <NavLink to={item.to} className={({ isActive }) => (isActive ? NAV_LINK_ACTIVE : '')}>
                        <item.icon />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-[#EFFDF0]/40 uppercase tracking-wider text-[10px] font-semibold px-3">
              Shop
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {SHOP_NAV_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild className={NAV_LINK_BASE}>
                      <NavLink to={item.to} className={({ isActive }) => (isActive ? NAV_LINK_ACTIVE : '')}>
                        <item.icon />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 space-y-2.5 border-t border-white/[0.06]">
          <p className="text-xs text-[#EFFDF0]/50 truncate px-1">{admin?.email}</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent border-white/10 text-[#EFFDF0]/80 hover:bg-white/[0.06] hover:text-white rounded-xl"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-[#F5FBF6]">
        <header className="flex items-center gap-3 border-b border-[#1a3d1a]/[0.06] bg-white/80 backdrop-blur-sm px-4 py-3 sticky top-0 z-10">
          <SidebarTrigger className="text-[#1a3d1a] hover:bg-[#1a3d1a]/5" />
          <div className="hidden sm:flex items-center gap-1.5 text-sm text-[#1a3d1a]/45">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1a3d1a] font-medium">{currentLabel}</span>
          </div>

          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-[#1a3d1a]/5 transition-colors">
                  <span className="w-8 h-8 rounded-full bg-[#1a3d1a] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {admin?.email?.[0]?.toUpperCase() ?? 'A'}
                  </span>
                  <span className="hidden sm:block text-sm text-[#1a3d1a]/70 max-w-[160px] truncate">
                    {admin?.email}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs font-normal text-[#1a3d1a]/50 truncate">
                  {admin?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

const AdminLayout = () => (
  <AdminCampaignProvider>
    <AdminLayoutInner />
  </AdminCampaignProvider>
);

export default AdminLayout;
