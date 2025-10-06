"use client";

import { useState } from "react";
import { useUserApplications, useFilteredApplications, useUpdateApplicationStatus, useDeleteApplication } from "@/hooks/useApplications";
import { ApplicationFilters } from "@/interfaces/Application";
import ApplicationFilterPanel from "@/components/ApplicationFilter";
import ApplicationTable from "@/components/ApplicationTable";
import AddApplicationModal from "@/components/Modals/AddApplicationModal";

export default function MyApplicationsPage() {
  const [filters, setFilters] = useState<ApplicationFilters>({
    company: [],
    category: [],
    status: "",
    referral: "",
    location: "",
    order: "newest",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: allApplications = [], isLoading, error } = useUserApplications();
  const { data: filteredApplications = [] } = useFilteredApplications(filters);
  const updateStatusMutation = useUpdateApplicationStatus();
  const deleteApplicationMutation = useDeleteApplication();

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        applicationId,
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await deleteApplicationMutation.mutateAsync(applicationId);
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading applications. Please try again.</p>
        </div>
      </div>
    );
  }


  if (allApplications.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="px-4 sm:px-6 xl:px-20 3xl:px-40 w-full max-w-[1700px] mx-auto py-6">
          <div className="flex items-center justify-center h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="text-gray-400 text-6xl">📋</div>
              <span className="text-base xm:text-[1.25rem] sm:text-[1.5rem] font-mono font-bold text-black leading-tight text-center">
                No applications yet
              </span>
              <span className="text-sm text-gray-600 text-center max-w-md">
                Start applying to jobs and they'll appear here for you to track.
              </span>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <a
                  href="/opportunities"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Opportunities
                </a>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Application Manually
                </button>
              </div>
            </div>
          </div>
        </div>
        <AddApplicationModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 px-4 sm:px-6 xl:px-20 3xl:px-40 w-full max-w-[1700px] mx-auto py-6">
        <div className="lg:w-[350px] lg:flex-shrink-0">
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <ApplicationFilterPanel
              data={allApplications}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 mt-6">
          {filteredApplications.length === 0 ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="flex flex-col items-center gap-4">
                <div className="text-gray-400 text-5xl">🔍</div>
                <span className="text-lg font-mono font-bold text-black leading-tight text-center">
                  No applications match your filters
                </span>
                <span className="text-sm text-gray-600 text-center max-w-md">
                  Try adjusting your filters or clear them to see all applications.
                </span>
                <button
                  onClick={() => setFilters({
                    company: [],
                    category: [],
                    status: "",
                    referral: "",
                    location: "",
                    order: "newest",
                  })}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <ApplicationTable
              applications={filteredApplications}
              onUpdateStatus={handleUpdateStatus}
              onDeleteApplication={handleDeleteApplication}
              onAddApplication={() => setIsAddModalOpen(true)}
            />
          )}
        </div>
      </div>

      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}