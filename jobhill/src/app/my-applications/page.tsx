"use client";

import { useState, useCallback } from "react";
import { useUserApplications, useUpdateApplicationStatus, useDeleteApplication } from "@/hooks/useApplications";
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

  const [filteredApplications, setFilteredApplications] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { data: applications = [], isLoading, error } = useUserApplications();
  const updateStatusMutation = useUpdateApplicationStatus();
  const deleteApplicationMutation = useDeleteApplication();

  const handleFilter = useCallback((filtered: any[]) => {
    setFilteredApplications(filtered);
  }, []);

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

  const dataToShow = filteredApplications.length > 0 ? filteredApplications : applications;

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 px-4 sm:px-6 xl:px-20 3xl:px-40 w-full max-w-[1700px] mx-auto py-6">
        
        <div className="lg:hidden mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
              <p className="text-gray-600">
                Track and manage all your job applications in one place
              </p>
            </div>
            
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Application
            </button>
          </div>
        </div>

        <div className="lg:w-[350px] lg:flex-shrink-0">
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <div className="hidden lg:block mb-6">
              <div className="flex flex-col space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
                  <p className="text-gray-600">
                    Track and manage all your job applications in one place
                  </p>
                </div>
                
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Application
                </button>
              </div>
            </div>
            
            <ApplicationFilterPanel
              data={applications}
              onFilter={handleFilter}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {applications.length === 0 ? (
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
          ) : (
            <ApplicationTable
              applications={dataToShow}
              onUpdateStatus={handleUpdateStatus}
              onDeleteApplication={handleDeleteApplication}
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