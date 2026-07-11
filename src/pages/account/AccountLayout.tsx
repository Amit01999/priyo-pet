import { Suspense } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ShoppingCart, UserCircle, LogOut, ChevronRight, Loader2 } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import logo from '../../../public/logo1.png';

const NAV_ITEMS = [
  { to: '/account', label: 'ওভারভিউ', icon: LayoutDashboard, end: true },
  { to: '/account/orders', label: 'আমার অর্ডার', icon: ShoppingBag, end: false },
  { to: '/account/cart', label: 'কার্ট', icon: ShoppingCart, end: false },
  { to: '/account/profile', label: 'প্রোফাইল', icon: UserCircle, end: false },
];

const NAV_LINK_BASE =
  'text-[#EFFDF0]/70 hover:bg-white/[0.06] hover:text-white rounded-xl transition-colors duration-200';
const NAV_LINK_ACTIVE = 'bg-[#E86A10] text-white font-medium hover:bg-[#E86A10] hover:text-white';

const AccountLayout = () => {
  const { customer, logout } = useCustomerAuth();
  const location = useLocation();
  const currentLabel = NAV_ITEMS.find((item) => item.to === location.pathname)?.label ?? 'ওভারভিউ';

  return (
    <SidebarProvider>
      <Sidebar className="border-r-0">
        <SidebarHeader className="p-4">
          <Link to="/" className="flex items-center gap-2 mb-1">
            <img src={logo} alt="Priyo Pet & Vet Care" className="h-10 w-auto" />
          </Link>
          <p className="text-xs text-[#EFFDF0]/40 font-hero-inter uppercase tracking-wider">আমার অ্যাকাউন্ট</p>
        </SidebarHeader>
        <SidebarContent className="px-1">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild className={NAV_LINK_BASE}>
                      <NavLink to={item.to} end={item.end} className={({ isActive }) => (isActive ? NAV_LINK_ACTIVE : '')}>
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
          <div className="flex items-center gap-2.5 px-1">
            <span className="w-8 h-8 rounded-full bg-[#E86A10] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {customer?.name?.[0]?.toUpperCase() ?? 'A'}
            </span>
            <p className="text-xs text-[#EFFDF0]/50 truncate font-hero-inter">{customer?.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-full bg-transparent border-white/10 text-[#EFFDF0]/80 hover:bg-white/[0.06] hover:text-white"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4 mr-2" /> লগআউট
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-[#F5FBF6]">
        <header className="flex items-center gap-3 border-b border-[#1a3d1a]/[0.06] bg-white/80 backdrop-blur-sm px-4 py-3 sticky top-0 z-10">
          <SidebarTrigger className="text-[#1a3d1a] hover:bg-[#1a3d1a]/5" />
          <div className="hidden sm:flex items-center gap-1.5 text-sm text-[#1a3d1a]/45">
            <span>আমার অ্যাকাউন্ট</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1a3d1a] font-medium">{currentLabel}</span>
          </div>
          <span className="sm:hidden font-serif-display text-[#1a3d1a]">আমার অ্যাকাউন্ট</span>

          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-[#1a3d1a]/5 transition-colors">
                  <span className="w-8 h-8 rounded-full bg-[#1a3d1a] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {customer?.name?.[0]?.toUpperCase() ?? 'A'}
                  </span>
                  <span className="hidden sm:block text-sm text-[#1a3d1a]/70 max-w-[160px] truncate">
                    {customer?.email}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs font-normal text-[#1a3d1a]/50 truncate">
                  {customer?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" /> লগআউট
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto font-hero-inter animate-fade-in">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[#1a3d1a]" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AccountLayout;
