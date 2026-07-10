import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ShoppingCart, UserCircle, LogOut } from 'lucide-react';
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
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import logo from '../../../public/logo1.png';

const NAV_ITEMS = [
  { to: '/account', label: 'ওভারভিউ', icon: LayoutDashboard, end: true },
  { to: '/account/orders', label: 'আমার অর্ডার', icon: ShoppingBag, end: false },
  { to: '/cart', label: 'কার্ট', icon: ShoppingCart, end: false },
  { to: '/account/profile', label: 'প্রোফাইল', icon: UserCircle, end: false },
];

const AccountLayout = () => {
  const { customer, logout } = useCustomerAuth();

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-[#1a3d1a]/[0.06]">
        <SidebarHeader className="p-4">
          <Link to="/" className="flex items-center gap-2 mb-1">
            <img src={logo} alt="Priyo Pet & Vet Care" className="h-10 w-auto" />
          </Link>
          <p className="text-xs text-[#1a3d1a]/50 font-hero-inter">আমার অ্যাকাউন্ট</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          isActive ? 'bg-[#1a3d1a]/10 text-[#1a3d1a] font-medium' : 'text-[#1a3d1a]/70'
                        }
                      >
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
        <SidebarFooter className="p-4 space-y-2">
          <p className="text-xs text-[#1a3d1a]/60 truncate font-hero-inter">{customer?.email}</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-full border-[#1a3d1a]/20 text-[#1a3d1a]"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4 mr-2" /> লগআউট
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-[#EFFDF0]">
        <header className="flex items-center gap-3 border-b border-[#1a3d1a]/[0.06] px-4 py-3 md:hidden bg-white">
          <SidebarTrigger />
          <span className="font-serif-display text-[#1a3d1a]">আমার অ্যাকাউন্ট</span>
        </header>
        <main className="flex-1 p-4 md:p-8 font-hero-inter">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AccountLayout;
