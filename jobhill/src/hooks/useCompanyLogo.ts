// src/hooks/useCompanyLogo.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateCompanyLogoParams {
  companyId: number;
  logo_url: string;
}

export const useUpdateCompanyLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ companyId, logo_url }: UpdateCompanyLogoParams) => {
      const response = await fetch(`/api/companies/${companyId}/logo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logo_url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update company logo');
      }

      return response.json();
    },
    onSuccess: () => {
      // Only invalidate job offers cache since that's where company logos are displayed
      queryClient.invalidateQueries({ queryKey: ['jobOffers'] });
    },
  });
};