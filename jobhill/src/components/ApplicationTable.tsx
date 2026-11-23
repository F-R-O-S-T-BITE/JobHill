// components/ApplicationTable.tsx
"use client";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Download, ExternalLink, Loader2, MapPin, Plus, Search, Trash2, X } from "lucide-react";
import { Application, APPLICATION_STATUSES } from "@/interfaces/Application";
import CompanyLogo from "@/components/ui/CompanyLogo";
import EmptyState from "@/components/ui/EmptyState";
import { exportApplicationsToExcel } from "@/utils/exportApplications";

interface ApplicationTableProps {
  applications: Application[];
  onUpdateStatus: (applicationId: string, newStatus: string) => void;
  onDeleteApplication: (applicationId: string) => void;
  onAddApplication: () => void;
  onBulkDelete: (applicationIds: string[]) => void;
  onBulkUpdateStatus: (applicationIds: string[], newStatus: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  Applied: "bg-brand-50 text-brand-700 ring-brand-200",
  OA: "bg-amber-50 text-amber-800 ring-amber-200",
  Behavioral: "bg-amber-50 text-amber-800 ring-amber-200",
  "Technical 1": "bg-amber-50 text-amber-800 ring-amber-200",
  "Technical 2": "bg-amber-50 text-amber-800 ring-amber-200",
  "Technical 3": "bg-amber-50 text-amber-800 ring-amber-200",
  "Technical 4": "bg-amber-50 text-amber-800 ring-amber-200",
  Offer: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Declined: "bg-red-50 text-red-700 ring-red-200",
  Rejected: "bg-red-50 text-red-700 ring-red-200",
  Ghosted: "bg-slate-100 text-slate-600 ring-slate-200",
  Canceled: "bg-slate-100 text-slate-600 ring-slate-200",
  Delivered: "bg-violet-50 text-violet-700 ring-violet-200",
  Process: "bg-orange-50 text-orange-700 ring-orange-200",
};

const REFERRAL_STYLES: Record<string, string> = {
  "Cold Apply": "bg-slate-100 text-slate-700",
  "Employee Ref": "bg-orange-50 text-orange-700",
  Referred: "bg-emerald-50 text-emerald-700",
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/** Devuelve un rango compacto de páginas: 1 … 4 5 6 … 12 */
function getPageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '…')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('…');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('…');
  pages.push(total);
  return pages;
}

function StatusSelect({ application, onUpdateStatus }: { application: Application; onUpdateStatus: ApplicationTableProps['onUpdateStatus'] }) {
  return (
    <select
      value={application.status}
      onChange={(e) => onUpdateStatus(application.id, e.target.value)}
      aria-label={`Status for ${application.role} at ${application.company_name}`}
      className={`rounded-full border-0 py-1 pl-2.5 pr-7 text-xs font-semibold ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-brand-500 ${STATUS_STYLES[application.status] ?? 'bg-slate-100 text-slate-700 ring-slate-200'}`}
    >
      {APPLICATION_STATUSES.map((status) => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
  );
}

function RowActions({ application, onDeleteApplication }: { application: Application; onDeleteApplication: (id: string) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => application.application_link && window.open(application.application_link, '_blank', 'noopener,noreferrer')}
        disabled={!application.application_link}
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-30"
        aria-label="Open application link"
        title="Open application link"
      >
        <ExternalLink className="h-4 w-4" />
      </button>
      <button
        onClick={() => onDeleteApplication(application.id)}
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
        aria-label="Delete application"
        title="Delete application"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  onUpdateStatus,
  onDeleteApplication,
  onAddApplication,
  onBulkDelete,
  onBulkUpdateStatus,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApplications = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return applications.filter(app =>
      app.company_name.toLowerCase().includes(q) ||
      app.role.toLowerCase().includes(q) ||
      app.location.toLowerCase().includes(q)
    );
  }, [applications, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / entriesPerPage));
  const page = Math.min(currentPage, totalPages);
  const indexOfFirstApp = (page - 1) * entriesPerPage;
  const indexOfLastApp = indexOfFirstApp + entriesPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApp, indexOfLastApp);

  // Selección: solo cuenta lo que sigue visible con los filtros y la búsqueda actuales
  const selectedApplications = useMemo(
    () => filteredApplications.filter(app => selectedIds.has(app.id)),
    [filteredApplications, selectedIds]
  );
  const selectedCount = selectedApplications.length;
  const pageIds = currentApplications.map(app => app.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id));
  const somePageSelected = pageIds.some(id => selectedIds.has(id));

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePage = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allPageSelected) pageIds.forEach(id => next.delete(id));
      else pageIds.forEach(id => next.add(id));
      return next;
    });
  };

  const selectAllResults = () => setSelectedIds(new Set(filteredApplications.map(app => app.id)));
  const clearSelection = () => setSelectedIds(new Set());

  const handleExport = async (rows: Application[]) => {
    if (rows.length === 0 || isExporting) return;
    setIsExporting(true);
    try {
      await exportApplicationsToExcel(rows);
      toast.success(`Downloaded ${rows.length} application${rows.length === 1 ? '' : 's'}`);
    } catch (error) {
      console.error('Error exporting applications:', error);
      toast.error("Couldn't create the Excel file. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const selectedIdList = selectedApplications.map(app => app.id);

  return (
    <div className="card overflow-clip">
      {/* Barra de acciones en lote (aparece al seleccionar) */}
      {selectedCount > 0 ? (
        <div className="sticky top-16 z-20 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-brand-100 bg-brand-50 px-4 py-3" role="region" aria-label="Bulk actions">
          <div className="flex items-center gap-2">
            <button
              onClick={clearSelection}
              className="rounded-lg p-1.5 text-brand-700 hover:bg-brand-100"
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-brand-900">{selectedCount} selected</span>
            {selectedCount < filteredApplications.length && (
              <button onClick={selectAllResults} className="text-sm font-semibold text-brand-600 hover:text-brand-800 hover:underline">
                Select all {filteredApplications.length}
              </button>
            )}
          </div>
          <div className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto">
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) onBulkUpdateStatus(selectedIdList, e.target.value);
              }}
              className="field w-auto flex-1 py-2 pr-8 sm:flex-none"
              aria-label="Change status of selected applications"
            >
              <option value="" disabled>Change status</option>
              {APPLICATION_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
            <button
              onClick={() => handleExport(selectedApplications)}
              disabled={isExporting}
              className="btn-secondary px-3 sm:px-4"
              aria-label="Export selected to Excel"
            >
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => onBulkDelete(selectedIdList)}
              className="btn-danger px-3 sm:px-4"
              aria-label="Delete selected applications"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      ) : (
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-stretch xl:flex-row xl:items-center">
        <div className="relative w-full sm:max-w-xs lg:max-w-none xl:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="field py-2 pl-9"
            placeholder="Search company, role or location"
            aria-label="Search applications"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-500">
            <span className="hidden sm:inline">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="field w-auto py-2 pr-8"
              aria-label="Entries per page"
            >
              {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="hidden sm:inline">per page</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport(filteredApplications)}
              disabled={isExporting || filteredApplications.length === 0}
              className="btn-secondary whitespace-nowrap"
              title="Download as Excel"
            >
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span className="hidden xs:inline">Export</span>
            </button>
            <button onClick={onAddApplication} className="btn-primary whitespace-nowrap">
              <Plus className="h-4 w-4" />
              <span>Add <span className="hidden sm:inline">application</span></span>
            </button>
          </div>
        </div>
      </div>
      )}

      {currentApplications.length === 0 ? (
        <div className="p-4">
          <EmptyState
            icon={Search}
            title="No applications found"
            description="Try a different search term."
            className="border-0"
          />
        </div>
      ) : (
        <>
          {/* Móvil: tarjetas */}
          <label className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 md:hidden">
            <input
              type="checkbox"
              checked={allPageSelected}
              ref={(el) => { if (el) el.indeterminate = somePageSelected && !allPageSelected; }}
              onChange={togglePage}
              className="h-4 w-4 cursor-pointer rounded accent-brand-600"
            />
            Select all on this page
          </label>
          <ul className="divide-y divide-slate-100 md:hidden">
            {currentApplications.map((application) => (
              <li key={application.id} className={`flex gap-3 p-4 transition-colors ${selectedIds.has(application.id) ? 'bg-brand-50/60' : ''}`}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(application.id)}
                  onChange={() => toggleOne(application.id)}
                  className="mt-3 h-4 w-4 shrink-0 cursor-pointer rounded accent-brand-600"
                  aria-label={`Select ${application.role} at ${application.company_name}`}
                />
                <CompanyLogo src={application.company_logo} name={application.company_name} className="h-11 w-11" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-500">{application.company_name}</p>
                      <p className="line-clamp-2 font-semibold leading-snug text-slate-900">{application.role}</p>
                    </div>
                    <div className="-mr-2 -mt-1 shrink-0">
                      <RowActions application={application} onDeleteApplication={onDeleteApplication} />
                    </div>
                  </div>
                  <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{application.location || 'No location'}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusSelect application={application} onUpdateStatus={onUpdateStatus} />
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${REFERRAL_STYLES[application.referral_type] ?? 'bg-slate-100 text-slate-700'}`}>
                      {application.referral_type}
                    </span>
                    <span className="ml-auto text-xs text-slate-400">Applied {formatDate(application.applied_date)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop: tabla */}
          <div className="relative hidden overflow-x-auto md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="w-10 py-3 pl-4 pr-0 xl:pl-5">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      ref={(el) => { if (el) el.indeterminate = somePageSelected && !allPageSelected; }}
                      onChange={togglePage}
                      className="h-4 w-4 cursor-pointer rounded accent-brand-600"
                      aria-label="Select all applications on this page"
                    />
                  </th>
                  <th scope="col" className="px-4 py-3 xl:px-5">Company &amp; role</th>
                  <th scope="col" className="hidden px-4 py-3 2xl:table-cell">Location</th>
                  <th scope="col" className="px-4 py-3">Applied</th>
                  <th scope="col" className="hidden px-4 py-3 xl:table-cell">Updated</th>
                  <th scope="col" className="hidden px-4 py-3 xl:table-cell">Referral</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentApplications.map((application) => (
                  <tr key={application.id} className={`transition-colors ${selectedIds.has(application.id) ? 'bg-brand-50/60 hover:bg-brand-50' : 'hover:bg-slate-50/70'}`}>
                    <td className="w-10 py-3.5 pl-4 pr-0 xl:pl-5">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(application.id)}
                        onChange={() => toggleOne(application.id)}
                        className="h-4 w-4 cursor-pointer rounded accent-brand-600"
                        aria-label={`Select ${application.role} at ${application.company_name}`}
                      />
                    </td>
                    <td className="px-4 py-3.5 xl:px-5">
                      <div className="flex items-center gap-3">
                        <CompanyLogo src={application.company_logo} name={application.company_name} className="h-10 w-10" />
                        <div className="min-w-0 max-w-[13rem] xl:max-w-[18rem]">
                          <p className="truncate font-semibold text-slate-900" title={application.role}>{application.role}</p>
                          <p className="truncate text-slate-500">{application.company_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden max-w-[14rem] px-4 py-3.5 text-slate-600 2xl:table-cell">
                      <span className="block truncate" title={application.location}>{application.location || 'No location'}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">{formatDate(application.applied_date)}</td>
                    <td className="hidden whitespace-nowrap px-4 py-3.5 text-slate-600 xl:table-cell">{formatDate(application.last_updated)}</td>
                    <td className="hidden whitespace-nowrap px-4 py-3.5 xl:table-cell">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${REFERRAL_STYLES[application.referral_type] ?? 'bg-slate-100 text-slate-700'}`}>
                        {application.referral_type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <StatusSelect application={application} onUpdateStatus={onUpdateStatus} />
                    </td>
                    <td className="whitespace-nowrap py-3.5 pl-2 pr-4 text-right">
                      <RowActions application={application} onDeleteApplication={onDeleteApplication} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {currentApplications.length > 0 && totalPages > 1 && (
        <nav className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3" aria-label="Pagination">
          <p className="hidden text-sm text-slate-500 sm:block">
            <span className="font-medium text-slate-700">{indexOfFirstApp + 1}-{Math.min(indexOfLastApp, filteredApplications.length)}</span>
            {' '}of{' '}
            <span className="font-medium text-slate-700">{filteredApplications.length}</span>
          </p>
          <div className="flex w-full items-center justify-between gap-1 sm:w-auto">
            <button
              onClick={() => setCurrentPage(Math.max(page - 1, 1))}
              disabled={page === 1}
              className="btn-ghost px-2.5"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-slate-600 sm:hidden">Page {page} of {totalPages}</span>
            <div className="hidden items-center gap-1 sm:flex">
              {getPageRange(page, totalPages).map((p, i) =>
                p === '…' ? (
                  <span key={`gap-${i}`} className="px-1 text-slate-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    aria-current={p === page ? 'page' : undefined}
                    className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition-colors ${
                      p === page ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
              className="btn-ghost px-2.5"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default ApplicationTable;
