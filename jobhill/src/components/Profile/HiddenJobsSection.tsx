'use client'

import { Eye, Calendar } from 'lucide-react'
import type { JobOfferResponse } from '@/interfaces/JobOffer'
import { useUnhideJob } from '@/hooks/useJobOffers'

interface HiddenJobsSectionProps {
  hiddenJobs: JobOfferResponse[]
  isLoading: boolean
}

function HiddenJobCard({ job, onUnhide }: {
  job: JobOfferResponse
  onUnhide: (jobId: string) => void
}) {
  return (
    <div className="p-3 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors min-w-0 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {job.company?.logo_url ? (
              <img
                src={job.company.logo_url}
                alt={job.company.name}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600 ${job.company?.logo_url ? 'hidden' : ''}`}>
              {job.company?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-xs truncate">
                {job.job_title.length > 35 ? `${job.job_title.substring(0, 35)}...` : job.job_title}
            </h4>
            <p className="text-xs text-gray-500 truncate">{job.company?.name}</p>
            <div className="flex items-center space-x-2 mt-1">
              {job.location && job.location.length > 0 && (
                <span className="text-xs text-gray-400 truncate">
                  {job.location[0].length > 15 ? `${job.location[0].substring(0, 15)}...` : job.location[0]}
                </span>
              )}
              {job.created_at && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    {new Date(job.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => onUnhide(job.id)}
          className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0 ml-2"
          title="Unhide job"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function HiddenJobsSection({
  hiddenJobs,
  isLoading
}: HiddenJobsSectionProps) {
  const unhideJobMutation = useUnhideJob()

  const handleUnhide = (jobId: string) => {
    unhideJobMutation.mutate(jobId)
  }
  if (!hiddenJobs.length && !isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Hidden Jobs</h2>
        <div className="text-center py-8">
          <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hidden jobs</p>
          <p className="text-sm text-gray-400 mt-1">Jobs you hide will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Hidden Jobs</h2>
        <span className="text-sm text-gray-500">
          {hiddenJobs.length} {hiddenJobs.length === 1 ? 'job' : 'jobs'} hidden
        </span>
      </div>


      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0353A4] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hidden jobs...</p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {hiddenJobs.map((job) => (
            <HiddenJobCard
              key={job.id}
              job={job}
              onUnhide={handleUnhide}
            />
          ))}
        </div>
      )}

    </div>
  )
}