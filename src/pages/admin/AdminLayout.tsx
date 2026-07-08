import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, CalendarClock, ListChecks, LogOut, PawPrint } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { AdminCampaignProvider, useAdminCampaign } from '@/contexts/AdminCampaignContext';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/appointments', label: 'Appointments', icon: CalendarClock },
  { to: '/admin/slots', label: 'Slot Management', icon: ListChecks },
];

const CampaignSelector = () => {
  const { campaigns, selectedSlug, setSelectedSlug, isLoading } = useAdminCampaign();

  if (isLoading || campaigns.length === 0) return null;

  return (
    <Select value={selectedSlug ?? undefined} onValueChange={setSelectedSlug}>
      <SelectTrigger className="w-full">
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

const AdminLayoutInner = () => {
  const { admin, logout } = useAdminAuth();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2 font-poppins font-bold text-primary text-lg mb-3">
            <PawPrint className="w-5 h-5" /> PriyoPet Admin
          </div>
          <CampaignSelector />
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
                        className={({ isActive }) =>
                          isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
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
          <p className="text-xs text-sidebar-foreground/70 truncate">{admin?.email}</p>
          <Button variant="outline" size="sm" className="w-full" onClick={() => logout()}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex items-center gap-3 border-b border-border px-4 py-3 md:hidden">
          <SidebarTrigger />
          <span className="font-poppins font-semibold text-gray-800">PriyoPet Admin</span>
        </header>
        <main className="flex-1 p-4 md:p-8 bg-muted/30">
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
