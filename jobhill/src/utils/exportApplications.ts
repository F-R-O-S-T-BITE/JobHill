// utils/exportApplications.ts
import type { Application } from '@/interfaces/Application';

const HEADER_STYLE = {
  fontWeight: 'bold' as const,
  backgroundColor: '#0353A4',
  textColor: '#FFFFFF',
};

const COLUMNS: { header: string; width: number; value: (app: Application) => string | Date | null }[] = [
  { header: 'Company', width: 24, value: (a) => a.company_name },
  { header: 'Role', width: 40, value: (a) => a.role },
  { header: 'Location', width: 28, value: (a) => a.location || null },
  { header: 'Status', width: 14, value: (a) => a.status },
  { header: 'Referral', width: 14, value: (a) => a.referral_type },
  { header: 'Applied', width: 13, value: (a) => toDate(a.applied_date) },
  { header: 'Last updated', width: 13, value: (a) => toDate(a.last_updated) },
  { header: 'Application link', width: 50, value: (a) => a.application_link || null },
];

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  // Fechas "YYYY-MM-DD" se interpretan en local para no correr un día por zona horaria
  const d = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Genera un .xlsx con las aplicaciones y lo descarga en el navegador.
 * La librería se carga solo al exportar para no pesar en la página.
 */
export async function exportApplicationsToExcel(applications: Application[]) {
  const { default: writeExcelFile } = await import('write-excel-file/universal');

  const data = [
    COLUMNS.map((c) => ({ value: c.header, ...HEADER_STYLE })),
    ...applications.map((app) =>
      COLUMNS.map((c) => {
        const value = c.value(app);
        if (value instanceof Date) return { value, type: Date, format: 'yyyy-mm-dd' };
        return value === null ? null : { value, type: String };
      })
    ),
  ];

  const blob = await writeExcelFile(data, {
    sheet: 'Applications',
    columns: COLUMNS.map((c) => ({ width: c.width })),
    stickyRowsCount: 1,
  }).toBlob();

  const date = new Date().toISOString().slice(0, 10);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `jobhill-applications-${date}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
