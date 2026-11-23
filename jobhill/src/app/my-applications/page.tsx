// app/my-applications/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ClipboardList, Plus, SearchX, SlidersHorizontal, X } from "lucide-react";
import { useUserApplications, useFilteredApplications, useUpdateApplicationStatus, useDeleteApplication } from "@/hooks/useApplications";
import { ApplicationFilters } from "@/interfaces/Application";
import ApplicationFilterPanel from "@/components/ApplicationFilter";
import ApplicationTable from "@/components/ApplicationTable";
import AddApplicationModal from "@/components/Modals/AddApplicationModal";
import DeleteConfirmationModal from "@/components/Modals/DeleteConfirmationModal";
import EmptyState from "@/components/ui/EmptyState";
import { AntWaving } from "@/components/mascots";

const DEFAULT_FILTERS: ApplicationFilters = {
  company: [],
  category: [],
  status: "",
  referral: "",
  location: "",
  order: "newest",
};

export default function MyApplicationsPage() {
  const [filters, setFilters] = useState<ApplicationFilters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<{ id: string; companyName: string; role: string } | null>(null);

  const { data: allApplications = [], isLoading, error } = useUserApplications();
  const { data: filteredApplications = [] } = useFilteredApplications(filters);
  const updateStatusMutation = useUpdateApplicationStatus();
  const deleteApplicationMutation = useDeleteApplication();

  useEffect(() => {
    if (!filtersOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFiltersOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [filtersOpen]);

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ applicationId, status: newStatus });
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleDeleteApplication = (applicationId: string) => {
    const application = allApplications.find(app => app.id === applicationId);
    if (application) {
      setApplicationToDelete({
        id: applicationId,
        companyName: application.company_name,
        role: application.role,
      });
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (applicationToDelete) {
      try {
        await deleteApplicationMutation.mutateAsync(applicationToDelete.id);
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    }
  };

  const activeFilterCount =
    filters.company.length +
    (filters.status ? 1 : 0) +
    (filters.referral ? 1 : 0) +
    (filters.location ? 1 : 0);

  const pageHeader = (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">My Applications</h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base">Track every application from submitted to offer.</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8" aria-busy="true">
        <div className="skeleton mb-6 h-8 w-60" />
        <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8">
          <div className="skeleton hidden h-[420px] rounded-2xl lg:block" />
          <div className="card space-y-4 p-4">
            <div className="skeleton h-10 w-full sm:w-72" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="skeleton h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3.5 w-1/2" />
                  <div className="skeleton h-3 w-1/3" />
                </div>
                <div className="skeleton h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <span className="sr-only">Loading your applications…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={AlertTriangle}
          title="We couldn't load your applications"
          description="Please refresh the page or try again in a moment."
        />
      </div>
    );
  }

  if (allApplications.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {pageHeader}
        <EmptyState
          icon={ClipboardList}
          illustration={<AntWaving className="h-36 w-36 sm:h-40 sm:w-40" />}
          title="No applications yet"
          description="Start applying to jobs and they'll appear here so you can track your progress."
          action={
            <>
              <Link href="/opportunities" className="btn-primary">Browse opportunities</Link>
              <button onClick={() => setIsAddModalOpen(true)} className="btn-secondary">
                <Plus className="h-4 w-4" />
                Add manually
              </button>
            </>
          }
        />
        <AddApplicationModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {pageHeader}

      <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8">
        {filtersOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm animate-fade-in lg:hidden"
            onClick={() => setFiltersOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          aria-label="Filters"
          className={`fixed inset-y-0 left-0 z-50 flex w-[88vw] max-w-sm flex-col bg-white shadow-pop transition-[transform,visibility] duration-300 ease-out
            lg:visible lg:sticky lg:top-24 lg:z-auto lg:w-auto lg:max-w-none lg:translate-x-0 lg:self-start lg:bg-transparent lg:shadow-none
            ${filtersOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'}`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 lg:hidden">
            <h2 className="font-display text-lg font-bold text-slate-900">Filters</h2>
            <button onClick={() => setFiltersOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close filters">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 lg:-m-1 lg:max-h-[calc(100dvh-7rem)] lg:p-1">
            <ApplicationFilterPanel
              data={allApplications}
              filteredData={filteredApplications}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
          <div className="border-t border-slate-100 p-4 lg:hidden">
            <button onClick={() => setFiltersOpen(false)} className="btn-primary w-full py-3">
              Show {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
            </button>
          </div>
        </aside>

        <section className="min-w-0" aria-label="Applications">
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <span className="text-sm font-medium text-slate-500">
              {filteredApplications.length} of {allApplications.length} applications
            </span>
            <button onClick={() => setFiltersOpen(true)} className="btn-secondary" aria-expanded={filtersOpen}>
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {filteredApplications.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No applications match your filters"
              description="Try adjusting your filters or clear them to see all applications."
              action={
                <button onClick={() => setFilters(DEFAULT_FILTERS)} className="btn-secondary">
                  Clear filters
                </button>
              }
            />
          ) : (
            <ApplicationTable
              applications={filteredApplications}
              onUpdateStatus={handleUpdateStatus}
              onDeleteApplication={handleDeleteApplication}
              onAddApplication={() => setIsAddModalOpen(true)}
            />
          )}
        </section>
      </div>

      <AddApplicationModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {applicationToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          applicationInfo={{
            companyName: applicationToDelete.companyName,
            role: applicationToDelete.role,
          }}
        />
      )}
    </div>
  );
}
