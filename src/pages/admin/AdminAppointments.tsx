import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import AppointmentsTable from '@/components/admin/AppointmentsTable';
import AppointmentDetailDialog from '@/components/admin/AppointmentDetailDialog';
import { useAdminCampaign } from '@/contexts/AdminCampaignContext';
import * as appointmentsApi from '@/lib/api/adminAppointments.api';
import type { Appointment, BookingStatus } from '@/lib/api/types';
import { getApiErrorMessage } from '@/lib/api/client';

const STATUS_FILTERS: (BookingStatus | 'all')[] = ['all', 'Pending', 'Confirmed', 'Cancelled', 'Completed'];

const AdminAppointments = () => {
  const { selectedSlug } = useAdminCampaign();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<BookingStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [exporting, setExporting] = useState(false);
  const queryClient = useQueryClient();

  const params = {
    page,
    limit: 20,
    search: search || undefined,
    status: status === 'all' ? undefined : status,
    date: dateFilter || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-appointments', selectedSlug, params],
    queryFn: () => appointmentsApi.listAppointments(selectedSlug as string, params),
    enabled: Boolean(selectedSlug),
  });

  const handleExport = async (format: 'csv' | 'xlsx') => {
    if (!selectedSlug) return;
    setExporting(true);
    try {
      const blob = await appointmentsApi.exportAppointmentsUrl(selectedSlug, format, {
        status: status === 'all' ? undefined : status,
        date: dateFilter || undefined,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `appointments-${selectedSlug}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Export failed'));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-poppins font-bold text-2xl text-gray-800">Applications</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={exporting} onClick={() => handleExport('csv')}>
            <Download className="w-4 h-4 mr-1.5" /> CSV
          </Button>
          <Button variant="outline" size="sm" disabled={exporting} onClick={() => handleExport('xlsx')}>
            <Download className="w-4 h-4 mr-1.5" /> Excel
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, phone, or pet..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as BookingStatus | 'all');
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === 'all' ? 'All statuses' : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          className="w-44"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <AppointmentsTable appointments={data?.data ?? []} onView={setSelectedAppointment} />

            {data && data.totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.max(1, p - 1));
                      }}
                      className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-4 text-sm text-gray-600">
                      Page {data.page} of {data.totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.min(data.totalPages, p + 1));
                      }}
                      className={page >= data.totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>

      {selectedSlug && (
        <AppointmentDetailDialog
          slug={selectedSlug}
          appointment={selectedAppointment}
          onClose={() => {
            setSelectedAppointment(null);
            queryClient.invalidateQueries({ queryKey: ['admin-appointments', selectedSlug] });
          }}
        />
      )}
    </div>
  );
};

export default AdminAppointments;
