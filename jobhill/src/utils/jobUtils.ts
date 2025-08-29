import { JobOfferResponse } from '@/interfaces/JobOffer'
import { OfferCardTag } from '@/interfaces/OfferCard'

// Función simple para formatear fechas
export function formatPublishDate(dateString: string): string {
  const publishDate = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - publishDate.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    return diffInHours <= 1 ? 'Just now' : `${diffInHours} hours ago`
  } else if (diffInDays === 1) {
    return '1 day ago'
  } else if (diffInDays <= 7) {
    return `${diffInDays} days ago`
  } else {
    const diffInWeeks = Math.floor(diffInDays / 7)
    return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`
  }
}

// Solo mapear categorías que realmente necesitan cambios
function getCategoryLabel(category: string): string {
  const categoryMap: Record<string, string> = {
    'SWE': 'Software',
    'Game Development': 'Game Dev',
    'FrontEnd': 'Frontend',
    'BackEnd': 'Backend'
  }
  return categoryMap[category] || category
}

// Función para crear tags de un job offer
export function createJobTags(jobOffer: JobOfferResponse): OfferCardTag[] {
  const tags: OfferCardTag[] = []
  
  // Categorías
  if (jobOffer.categories?.length) {
    jobOffer.categories.forEach(category => {
      tags.push({
        label: getCategoryLabel(category),
        type: 'category'
      })
    })
  }
  
  // Período de trabajo
  if (jobOffer.period) {
    tags.push({
      label: jobOffer.period,
      type: 'hours_job_type'
    })
  }
  
  // Modalidad (sin mapeo, se usa tal como viene)
  if (jobOffer.modality) {
    tags.push({
      label: jobOffer.modality,
      type: 'modality'
    })
  }
  
  // Requisitos críticos
  if (jobOffer.noSponsor === 1) {
    tags.push({
      label: 'No Sponsorship',
      type: 'extra_critical_requirements'
    })
  }
  
  if (jobOffer.usaCitizen === 1) {
    tags.push({
      label: 'US Citizenship',
      type: 'extra_critical_requirements'
    })
  }
  
  if (jobOffer.emergingTalent === 1) {
    tags.push({
      label: 'Emerging Talent',
      type: 'extra_critical_requirements'
    })
  }
  
  if (jobOffer.newGrad === 1) {
    tags.push({
      label: 'New Grad',
      type: 'extra_critical_requirements'
    })
  }
  
  return tags
}